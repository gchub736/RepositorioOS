import { Metadado } from "../types";

// "Média" (com acento, vindo do back) é normalizado para "Media" para casar com os
// valores usados nos selects e mapas de cor.
export const normalizarMedia = (nome: string): string => (nome === "Média" ? "Media" : nome);

// Aplica a normalização de "Média" e remove duplicados por nome. Usado para urgências
// e prioridades.
export const normalizarLista = (lista: Metadado[]): Metadado[] =>
  lista
    .map((item) => (item.nome === "Média" ? { ...item, nome: "Media" } : item))
    .filter((v, i, a) => a.findIndex((t) => t.nome === v.nome) === i);

// Resolve o nome de um campo que pode vir como objeto { nome } ou string, aplicando a
// normalização de "Média" e um fallback. Espelha a lógica usada ao abrir o modal.
export const resolverNomeNormalizado = (valor: any, fallback = "Media"): string => {
  if (valor?.nome === "Média") return "Media";
  if (valor === "Média") return "Media";
  return valor?.nome || valor || fallback;
};
