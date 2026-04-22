-- INSERIR USUÁRIO ADMIN
-- Schema: gestoes

INSERT INTO gestoes.usuarios (nome, cpf, email, senha, cargo_id, ativo, criado_em, atualizado_em)
VALUES (
    'Samarlo Admin',
    '44419299999',
    'samarlo@gmail.com',
    '$2y$12$du.MZJhMmS7tizbbbCLTS.q3WPyth2IHdG/QHObdTpXH.ubA9xQ3y',
    1,
    true,
    NOW(),
    NOW()
) ON CONFLICT (cpf) DO NOTHING;
