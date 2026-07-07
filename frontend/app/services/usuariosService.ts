import api from "./api";

// Busca técnicos/admins ativos no back-end (filtragem por nome feita pela API, não no front).
export const buscarTecnicos = (query: string) =>
  api.get("/usuarios", {
    params: {
      cargo: "Tecnico,Admin",
      ativo: true,
      per_page: 10,
      ...(query ? { busca: query } : {}),
    },
  });

// Lista usuários paginados/filtrados (filtragem feita pelo back-end).
export const listarUsuarios = (params: Record<string, any>) =>
  api.get("/usuarios", { params });

// Atualiza o cargo de um usuário.
export const atualizarCargo = (id: number, cargo: string) =>
  api.put(`/usuarios/${id}`, { cargo });

// Remove (desativa) um usuário.
export const removerUsuario = (id: number) => api.delete(`/usuarios/${id}`);
