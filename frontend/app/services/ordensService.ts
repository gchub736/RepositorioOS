import api from "./api";

// Camada de acesso assíncrono às ordens de serviço. Encapsula os endpoints do back-end
// para que hooks/componentes não dependam diretamente do axios.

export const listarOrdens = (params: Record<string, any>) =>
  api.get("/ordens", { params });

// Cria uma nova ordem de serviço (multipart, pois pode conter anexo).
export const criarOrdem = (dados: FormData) =>
  api.post("/ordens", dados, { headers: { "Content-Type": "multipart/form-data" } });

export const obterOrdem = (id: number | string) => api.get(`/ordens/${id}`);

// Atualiza a ordem. Com anexo usa POST + _method=PUT (multipart); sem anexo, PUT JSON.
export const atualizarOrdem = (id: number | string, dados: FormData | Record<string, any>) => {
  if (dados instanceof FormData) {
    return api.post(`/ordens/${id}`, dados, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return api.put(`/ordens/${id}`, dados);
};

export const fixarOrdem = (id: number | string) => api.post(`/ordens/${id}/fixar`);

export const removerOrdem = (id: number | string) => api.delete(`/ordens/${id}`);

export const criarComentario = (
  ordemId: number | string,
  conteudo: string,
  parentId: number | null
) => api.post(`/ordens/${ordemId}/comentarios`, { conteudo, parent_id: parentId });

export const editarComentario = (
  ordemId: number | string,
  comentarioId: number,
  conteudo: string
) => api.put(`/ordens/${ordemId}/comentarios/${comentarioId}`, { conteudo });

export const removerComentario = (
  ordemId: number | string,
  comentarioId: number,
  tipo: "mim" | "todos"
) => api.delete(`/ordens/${ordemId}/comentarios/${comentarioId}?tipo=${tipo}`);

export const baixarAnexo = (osId: number | string) =>
  api.get(`/ordens/${osId}/anexo`, { responseType: "blob" });

// Busca para exportação (per_page alto). A montagem do CSV fica na camada lib.
export const exportarOrdens = (params: URLSearchParams) =>
  api.get(`/ordens?${params.toString()}`);
