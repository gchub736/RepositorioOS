-- =====================================================================
-- Tabela de tokens de recuperação de senha.
--
-- POR QUE: o PasswordResetController já existia no projeto, mas a tabela
-- (e o model) nunca foram criados — o endpoint quebraria se fosse chamado.
-- Usado por: PasswordResetController (forgot-password / reset-password).
--
-- Token: hash sha256 (64 caracteres), de uso único, expira em 60 minutos.
--
-- Este script é idempotente (pode rodar mais de uma vez sem erro).
--
-- APLICAR EM BANCOS JÁ EXISTENTES:
--   psql -U postgres -d <banco> -f backend/sql_updates/2026_07_14_add_password_resets.sql
--
-- Bancos novos já nascem com a tabela: ela também foi incluída em
-- backend/estrutura_banco.sql.
-- =====================================================================

CREATE TABLE IF NOT EXISTS gestoes.password_resets (
    id bigserial PRIMARY KEY,
    cpf character varying(11) NOT NULL,
    token character varying(64) NOT NULL,
    criado_em timestamp without time zone DEFAULT now() NOT NULL
);

-- Busca pelo token (validação/reset) e limpeza por CPF (invalida os anteriores).
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON gestoes.password_resets USING btree (token);
CREATE INDEX IF NOT EXISTS idx_password_resets_cpf   ON gestoes.password_resets USING btree (cpf);
