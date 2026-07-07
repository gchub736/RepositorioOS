import api from "./api";

// Carrega os metadados auxiliares (categorias/status/urgências/prioridades) em paralelo.
export const carregarMetadados = () =>
  Promise.all([
    api.get("/categorias"),
    api.get("/status"),
    api.get("/urgencias"),
    api.get("/prioridades"),
  ]);
