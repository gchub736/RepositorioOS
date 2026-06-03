# 🛡️ Guia Completo — Backup e Restauração do Banco de Dados

**Sistema:** OS Manager System  
**Banco:** PostgreSQL 15  
**Ferramenta:** Spatie Laravel Backup v10  
**Armazenamento:** Google Drive  
**Última atualização:** Junho 2026

---

## 📋 Índice

1. [Visão Geral](#1-visão-geral)
2. [Como Funciona o Backup Automático](#2-como-funciona-o-backup-automático)
3. [Comandos Úteis do Dia a Dia](#3-comandos-úteis-do-dia-a-dia)
4. [Como Fazer um Backup Manual](#4-como-fazer-um-backup-manual)
5. [🚨 Restauração de Emergência](#5-restauração-de-emergência)
6. [Configurações Importantes](#6-configurações-importantes)
7. [Solução de Problemas](#7-solução-de-problemas)

---

## 1. Visão Geral

O sistema realiza **backups diários automáticos** do banco de dados PostgreSQL e envia para o **Google Drive**. Os backups são mantidos por **7 dias** — após esse período, são excluídos automaticamente.

| Item                  | Valor                         |
|-----------------------|-------------------------------|
| Frequência            | Diária (01:30 da manhã)       |
| Limpeza automática    | Diária (01:00 da manhã)       |
| Retenção              | 7 dias                        |
| Destino               | Google Drive (pasta dedicada) |
| Tipo de backup        | Somente banco de dados (SQL)  |
| Container responsável | `os_api`                      |

---

## 2. Como Funciona o Backup Automático

O Laravel Scheduler roda em background dentro do container `os_api` e executa dois comandos diariamente:

```
01:00 → php artisan backup:clean      (remove backups com mais de 7 dias)
01:30 → php artisan backup:run --only-db  (faz o backup do banco)
```

O scheduler é iniciado automaticamente pelo `entrypoint.sh` do container:

```sh
php artisan schedule:work >> /var/www/storage/logs/scheduler.log 2>&1 &
```

**Não é necessário configurar cron manualmente.** Tudo já está embutido no container.

---

## 3. Comandos Úteis do Dia a Dia

### Listar todos os backups salvos
```bash
docker exec os_api php artisan backup:list
```

Saída esperada:
```
+---------+--------+-----------+---------+--------------+-----------------------+--------------+
| Name    | Disk   | Reachable | Healthy | # of backups | Newest backup         | Used storage |
+---------+--------+-----------+---------+--------------+-----------------------+--------------+
| Laravel | google | ✅        | ✅      |            2 | 0.01 (10 minutes ago) |    556.86 KB |
+---------+--------+-----------+---------+--------------+-----------------------+--------------+
```

> ⚠️ Se aparecer ❌ no campo **Healthy**, significa que o último backup é muito antigo (mais de 1 dia). Rode um backup manual imediatamente.

### Verificar se o scheduler está rodando
```bash
docker exec os_api php artisan schedule:list
```

### Ver logs do scheduler
```bash
docker exec os_api cat /var/www/storage/logs/scheduler.log
```

---

## 4. Como Fazer um Backup Manual

Se precisar forçar um backup fora do horário agendado:

```bash
docker exec os_api php artisan backup:run --only-db
```

Saída esperada:
```
Starting backup...
Dumping database os_manager_db...
Determining files to backup...
Zipping 1 files and directories...
Created zip containing 1 files and directories. Size is 278.43 KB
Copying zip to disk named google...
Successfully copied zip to disk named google.
Backup completed!
```

Para forçar a limpeza de backups antigos:
```bash
docker exec os_api php artisan backup:clean
```

---

## 5. 🚨 Restauração de Emergência

> **CENÁRIO:** O banco de dados foi corrompido, apagado, ou precisa ser revertido para um estado anterior.

### Passo 1 — Baixar o backup do Google Drive

1. Acesse o [Google Drive](https://drive.google.com)
2. Navegue até a pasta de backups (a pasta configurada pelo `GOOGLE_DRIVE_FOLDER_ID` no `.env`)
3. Dentro dessa pasta, haverá uma subpasta chamada **`Laravel/`**
4. Os backups estão nomeados por data e hora, ex: `2026-06-03-18-36-22.zip`
5. **Baixe o arquivo `.zip` mais recente** (ou o da data que deseja restaurar)

### Passo 2 — Extrair o arquivo ZIP

```bash
# Crie uma pasta temporária e extraia
mkdir -p /tmp/backup-restore
unzip ~/Downloads/2026-06-03-18-36-22.zip -d /tmp/backup-restore
```

Dentro da pasta extraída, o arquivo SQL estará em:
```
/tmp/backup-restore/db-dumps/pgsql-os_manager_db.sql
```

### Passo 3 — Copiar o SQL para dentro do container do banco

```bash
docker cp /tmp/backup-restore/db-dumps/pgsql-os_manager_db.sql os_db:/tmp/restore.sql
```

### Passo 4 — Parar a API temporariamente

Para evitar que a aplicação tente acessar o banco durante a restauração:

```bash
docker stop os_api
```

### Passo 5 — Dropar e recriar o banco de dados

```bash
docker exec os_db psql -U postgres -c "DROP DATABASE IF EXISTS os_manager_db;"
docker exec os_db psql -U postgres -c "CREATE DATABASE os_manager_db;"
```

### Passo 6 — Restaurar o backup

```bash
docker exec os_db psql -U postgres -d os_manager_db -f /tmp/restore.sql
```

### Passo 7 — Verificar a restauração

```bash
# Listar as tabelas restauradas
docker exec os_db psql -U postgres -d os_manager_db -c "\dt"

# Contar registros de uma tabela importante (ex: usuarios)
docker exec os_db psql -U postgres -d os_manager_db -c "SELECT COUNT(*) FROM usuarios;"
```

### Passo 8 — Reiniciar a API

```bash
docker start os_api
```

### Passo 9 — Limpar arquivo temporário

```bash
docker exec os_db rm /tmp/restore.sql
rm -rf /tmp/backup-restore
```

---

### 📝 Resumo Rápido (Copiar e Colar)

```bash
# 1. Extrair o zip baixado do Drive
mkdir -p /tmp/backup-restore
unzip ~/Downloads/NOME_DO_BACKUP.zip -d /tmp/backup-restore

# 2. Copiar para o container
docker cp /tmp/backup-restore/db-dumps/pgsql-os_manager_db.sql os_db:/tmp/restore.sql

# 3. Parar a API
docker stop os_api

# 4. Dropar e recriar o banco
docker exec os_db psql -U postgres -c "DROP DATABASE IF EXISTS os_manager_db;"
docker exec os_db psql -U postgres -c "CREATE DATABASE os_manager_db;"

# 5. Restaurar
docker exec os_db psql -U postgres -d os_manager_db -f /tmp/restore.sql

# 6. Verificar
docker exec os_db psql -U postgres -d os_manager_db -c "\dt"

# 7. Reiniciar API
docker start os_api

# 8. Limpar
docker exec os_db rm /tmp/restore.sql
rm -rf /tmp/backup-restore
```

---

## 6. Configurações Importantes

### Arquivos de configuração

| Arquivo | Descrição |
|---------|-----------|
| `backend/.env` | Credenciais do Google Drive |
| `backend/config/backup.php` | Configuração do Spatie Backup |
| `backend/config/filesystems.php` | Disco "google" configurado |
| `backend/routes/console.php` | Agendamento dos comandos |
| `backend/entrypoint.sh` | Inicia o scheduler em background |

### Variáveis de ambiente (`.env`)

```env
GOOGLE_DRIVE_CLIENT_ID=seu_client_id
GOOGLE_DRIVE_CLIENT_SECRET=seu_client_secret
GOOGLE_DRIVE_REFRESH_TOKEN=seu_refresh_token
GOOGLE_DRIVE_FOLDER_ID=id_da_pasta_no_drive
```

### Política de retenção atual (`config/backup.php`)

```php
'keep_all_backups_for_days' => 7,        // Mantém tudo por 7 dias
'keep_daily_backups_for_days' => 0,      // Não mantém diários extras
'keep_weekly_backups_for_weeks' => 0,    // Não mantém semanais
'keep_monthly_backups_for_months' => 0,  // Não mantém mensais
'keep_yearly_backups_for_years' => 0,    // Não mantém anuais
```

---

## 7. Solução de Problemas

### ❌ `backup:list` mostra "Unhealthy"
**Causa:** O backup mais recente tem mais de 1 dia.  
**Solução:** Rode um backup manual:
```bash
docker exec os_api php artisan backup:run --only-db
```

### ❌ Backup falha com erro de conexão ao Google Drive
**Causa:** Token do Google Drive expirou ou credenciais inválidas.  
**Solução:** Gere um novo `GOOGLE_DRIVE_REFRESH_TOKEN` e atualize no `.env`.

### ❌ Scheduler não está rodando
**Causa:** Container foi reiniciado sem rebuild.  
**Solução:** Rebuilde o container:
```bash
docker compose down
docker compose up --build -d
```

### ❌ Erro "pg_dump not found" durante backup
**Causa:** PostgreSQL client não instalado no container da API.  
**Solução:** Já está resolvido no Dockerfile com `postgresql-client`. Se precisar reinstalar:
```bash
docker exec os_api apt-get update && docker exec os_api apt-get install -y postgresql-client
```

### ❌ O banco do .env aponta para `os_manager_test`
**Lembrete:** No `.env` a linha do `DB_DATABASE` está como:
```
DB_DATABASE=os_manager_test
```
Para produção, altere para `os_manager_db`.

---

> 💡 **Dica:** Sempre teste a restauração em um ambiente de desenvolvimento antes de aplicar em produção. Isso garante que o processo está funcionando corretamente e que o backup não está corrompido.
