import { Metadado } from "../types";

// Mapas de cor (classes Tailwind) por rótulo — usados nos badges das tabelas e modal.
export const urgenciaCor: Record<string, string> = {
  "Muito Alta": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Alta: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Media: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Baixa: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export const categoriaCor: Record<string, string> = {
  Rede: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Infraestrutura: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  Acesso: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export const statusCor: Record<string, string> = {
  Novo: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Em Andamento": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "Aguardando Peça": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Pausado: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
  Fechado: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export const slaLabel: Record<string, string> = {
  vencido: "Vencido",
  alerta: "Em Alerta",
  ok: "No Prazo",
  pausado: "Pausado",
};

// Classe do badge quando não há cor mapeada.
export const badgeCorPadrao =
  "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400";

// Classes reutilizadas dos formulários (Novo Chamado, Configurações).
export const formInputClass =
  "w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-400/55 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500";
// Variante de altura fixa para campos de linha única (iguala select e input).
export const formControlClass = `${formInputClass} h-[46px]`;
// Label preta (mesmo tom do título), boa legibilidade.
export const formLabelClass =
  "text-[10px] font-bold text-slate-800 dark:text-white uppercase tracking-widest";
// Label dos campos do modal de chamado (mesmo tom preto das demais telas,
// mantendo o tamanho text-xs já usado no modal).
export const modalLabelClass = "text-xs font-bold text-slate-800 dark:text-white uppercase";
// Sub-cabeçalho de seção dentro de um formulário (um pouco mais leve que a label).
export const formSecaoClass =
  "text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest";
// Card branco padrão que envolve os formulários.
export const formCardClass =
  "bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-300 dark:border-slate-800 p-5 md:p-6 flex-1 min-h-0 overflow-y-auto";

// Card de métrica (tela de estatísticas).
export const statCardClass =
  "bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-300 dark:border-slate-800 flex flex-col";
// Título dentro de um card de métrica.
export const statTituloClass =
  "text-[10px] md:text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-3 tracking-widest";

// Cor do marcador de prioridade (tela de estatísticas).
export const prioridadeCor: Record<string, string> = {
  Baixa: "bg-blue-500",
  Media: "bg-orange-500",
  Alta: "bg-red-500",
  "Muito Alta": "bg-red-700",
  Critica: "bg-red-900",
};

// Classes reutilizadas de inputs/selects.
export const selectClass =
  "w-full p-3 mt-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500";
export const filterClass =
  "p-2.5 border border-slate-300 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white";

// Listas default usadas enquanto os metadados reais não chegam da API.
export const CATEGORIAS_DEFAULT: Metadado[] = [
  { id: 1, nome: "Rede" },
  { id: 2, nome: "Acesso" },
  { id: 3, nome: "Infraestrutura" },
];
export const STATUS_DEFAULT: Metadado[] = [
  { id: 1, nome: "Novo" },
  { id: 2, nome: "Em Andamento" },
  { id: 3, nome: "Aguardando Peça" },
  { id: 4, nome: "Pausado" },
  { id: 5, nome: "Fechado" },
  { id: 6, nome: "Cancelado" },
];
export const URGENCIAS_DEFAULT: Metadado[] = [
  { id: 1, nome: "Baixa" },
  { id: 2, nome: "Media" },
  { id: 3, nome: "Alta" },
  { id: 4, nome: "Muito Alta" },
];
export const PRIORIDADES_DEFAULT: Metadado[] = [
  { id: 1, nome: "Baixa" },
  { id: 2, nome: "Media" },
  { id: 3, nome: "Alta" },
  { id: 4, nome: "Muito Alta" },
];
