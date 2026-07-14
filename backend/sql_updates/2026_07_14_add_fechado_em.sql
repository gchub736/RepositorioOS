-- =====================================================================
-- Adiciona a data de fechamento da ordem de serviço.
--
-- POR QUE: sem esse carimbo de tempo não é possível calcular o tempo médio
-- de resolução (o `atualizado_em` muda a cada edição, então não serve).
-- Usado por: DashboardController (métrica tempo_medio_resolucao).
--
-- Este script é idempotente (pode rodar mais de uma vez sem erro).
--
-- APLICAR EM BANCOS JÁ EXISTENTES:
--   psql -U postgres -d <banco> -f backend/sql_updates/2026_07_14_add_fechado_em.sql
--
-- Bancos novos já nascem com a coluna: ela também foi incluída em
-- backend/estrutura_banco.sql.
-- =====================================================================

-- 1) Coluna
ALTER TABLE core.ordem_servicos
    ADD COLUMN IF NOT EXISTS fechado_em timestamp without time zone NULL;

-- 2) Backfill das OS que já estavam fechadas.
-- Não existe registro da data real de fechamento (o histórico só grava a ação
-- genérica "Atualizado"), então `atualizado_em` é a melhor aproximação disponível.
UPDATE core.ordem_servicos os
   SET fechado_em = os.atualizado_em
  FROM core.status s
 WHERE s.id = os.status_id
   AND s.nome = 'Fechado'
   AND os.fechado_em IS NULL;

-- 3) Índice de apoio ao cálculo do tempo médio.
-- (O filtro por período usa `criado_em`, que já é coberto pelo índice existente
--  idx_os_criado_em — não é preciso criar outro.)
CREATE INDEX IF NOT EXISTS idx_os_fechado_em ON core.ordem_servicos USING btree (fechado_em);
