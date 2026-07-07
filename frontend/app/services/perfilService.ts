import api from "./api";

// Retorna os dados do usuário autenticado.
export const obterPerfil = () => api.get("/perfil");
