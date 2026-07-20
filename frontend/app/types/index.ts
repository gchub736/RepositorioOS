// Tipos compartilhados do domínio de chamados (ordens de serviço).
// Os campos que o back-end pode enviar como objeto { nome } OU string são tipados
// como união; um index signature mantém flexibilidade para campos auxiliares.

export interface Metadado {
  id: number;
  nome: string;
}

export interface Usuario {
  id: number;
  nome: string;
  cargo?: Metadado | string;
  cpf?: string;
  ativo?: boolean;
  ordens_ativas?: number;
  [key: string]: any;
}

export interface Comentario {
  id: number;
  usuario_id: number | string;
  usuario_nome: string;
  usuario_cargo?: string;
  conteudo: string;
  criado_em: string;
  editado?: boolean;
  parent?: { usuario?: { nome?: string }; conteudo?: string } | null;
  pode_deletar?: boolean;
  pode_editar?: boolean;
  [key: string]: any;
}

export interface Historico {
  id: number;
  acao: string;
  descricao: string;
  usuario?: { nome?: string } | null;
  criado_em?: string;
  data?: string;
  [key: string]: any;
}

export interface Ordem {
  id: number;
  titulo?: string;
  localizacao?: string;
  categoria?: Metadado | string;
  status?: Metadado | string;
  urgencia?: Metadado | string;
  prioridade?: Metadado | string;
  usuario?: Usuario;
  tecnico?: Usuario;
  tecnico_id?: number | string;
  solucao?: string;
  motivo_pausa?: string;
  anexo_url?: string;
  fixada?: boolean;
  criado_em?: string;
  created_at?: string;
  sla_limite_data?: string;
  status_sla?: SlaStatus;
  // Calculados no back-end (o front não faz conta de tempo, só exibe).
  sla_tempo_restante?: string | null;
  sla_atrasado?: boolean | null;
  comentarios?: Comentario[];
  historicos?: Historico[];
  [key: string]: any;
}

export interface Meta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface Filtros {
  busca: string;
  status: string;
  categoria: string;
  urgencia: string;
  prioridade: string;
  sla: string;
  sem_tecnico: boolean; // pendentes de atribuição (drill-down do dashboard)
  page: number;
  per_page: number;
}

export interface AnexoPreview {
  url: string;
  osId: number;
}

export type SlaStatus = "ok" | "alerta" | "vencido" | "pausado" | null;

export type AbaModal = "comentarios" | "historico";

export type AbaConfig = "perfil" | "sistema";

// --- Estatísticas (dashboard) ---
export interface EstatisticasGeral {
  total: number;
  resolvidos: number;
  abertos: number;
  perc_resolvidos: number;
  sem_tecnico: number;
}
export interface TopTecnico {
  id: number;
  nome: string;
  resolvidos: number;
}
export interface EstatisticaCategoria {
  categoria: string;
  abertos: number;
  resolvidos: number;
}
export interface EstatisticaSla {
  ok: number;
  alerta: number;
  vencido: number;
}
export interface EstatisticaPrioridade {
  prioridade: string;
  abertos: number;
}
export interface TempoMedioResolucao {
  horas: number | null;
  amostra: number;
}
export interface Estatisticas {
  periodo: number;
  geral: EstatisticasGeral;
  top_tecnicos: TopTecnico[];
  categorias: EstatisticaCategoria[];
  sla: EstatisticaSla;
  prioridades: EstatisticaPrioridade[];
  tempo_medio_resolucao: TempoMedioResolucao;
}

// Períodos aceitos pelo dashboard (em dias; 0 = todo o histórico).
export type PeriodoEstatisticas = 0 | 7 | 30 | 90;
