import api from "./api";

// Carrega apenas a lista de categorias.
export const listarCategorias = () => api.get("/categorias");

// Carrega os metadados auxiliares (categorias/status/urgências/prioridades) em paralelo.
export const carregarMetadados = () =>
  Promise.all([
    api.get("/categorias"),
    api.get("/status"),
    api.get("/urgencias"),
    api.get("/prioridades"),
  ]);
