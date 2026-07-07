import { Ordem } from "../types";

// Monta o conteúdo CSV (com BOM UTF-8) a partir da lista de ordens. Lógica pura.
export const montarCsvChamados = (dados: Ordem[]): string => {
  const cabecalho = [
    "ID",
    "Titulo",
    "Dono",
    "Tecnico",
    "Status",
    "Categoria",
    "Urgencia",
    "Prioridade",
    "Criado Em",
  ];
  const linhas = dados.map((os: any) => [
    os.id,
    `"${(os.titulo || "").replace(/"/g, '""')}"`,
    `"${(os.usuario?.nome || "").replace(/"/g, '""')}"`,
    `"${(os.tecnico?.nome || "Não atribuído").replace(/"/g, '""')}"`,
    `"${(os.status?.nome || os.status || "").replace(/"/g, '""')}"`,
    `"${(os.categoria?.nome || os.categoria || "").replace(/"/g, '""')}"`,
    `"${(os.urgencia?.nome || os.urgencia || "").replace(/"/g, '""')}"`,
    `"${(os.prioridade?.nome || os.prioridade || "").replace(/"/g, '""')}"`,
    os.criado_em || os.created_at || "",
  ]);

  return "﻿" + [cabecalho.join(","), ...linhas.map((l: any) => l.join(","))].join("\n");
};

// Dispara o download de um arquivo a partir de um Blob (efeito de DOM, mas sem React).
export const baixarBlob = (blob: Blob, nomeArquivo: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", nomeArquivo);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
