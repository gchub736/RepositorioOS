import api from "./api";

// Retorna os dados do usuário autenticado.
export const obterPerfil = () => api.get("/perfil");

// Atualiza o perfil do usuário (nome, e-mail e, opcionalmente, senha).
export const atualizarPerfil = (id: number | string, payload: Record<string, any>) =>
  api.put(`/usuarios/${id}/perfil`, payload);
