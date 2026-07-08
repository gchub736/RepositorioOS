import api from "./api";

// Configurações gerais do sistema (nome, SLAs por urgência) — acesso restrito a Admin.
export const obterConfiguracoes = () => api.get("/configuracoes");

export const atualizarConfiguracoes = (payload: Record<string, any>) =>
  api.put("/configuracoes", payload);
