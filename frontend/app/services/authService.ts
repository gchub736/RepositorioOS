import api from "./api";

// Camada de acesso assíncrono à autenticação e recuperação de senha.
// Rotas públicas (não exigem token).

export const login = (cpf: string, senha: string) => api.post("/login", { cpf, senha });

export const cadastrar = (dados: {
  nome: string;
  cpf: string;
  email: string;
  senha: string;
}) => api.post("/usuarios", dados);

// Solicita o e-mail de recuperação. O back responde sempre a mesma mensagem,
// mesmo se o CPF não existir (não revela se o cadastro existe).
export const esqueciSenha = (cpf: string) => api.post("/forgot-password", { cpf });

export const validarTokenSenha = (token: string) =>
  api.post("/reset-password/validate", { token });

export const resetarSenha = (token: string, novaSenha: string) =>
  api.post("/reset-password", {
    token,
    nova_senha: novaSenha,
    nova_senha_confirmacao: novaSenha,
  });
