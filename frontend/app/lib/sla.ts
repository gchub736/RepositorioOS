import { Ordem, SlaStatus } from "../types";

// Reflete apenas o que o back enviou (propriedade status_sla), com tratamento
// dos status que suspendem/encerram a contagem. Lógica pura.
export const statusSla = (os: Ordem): SlaStatus => {
  const statusNome = (os.status as any)?.nome || os.status;
  if (["Fechado", "Cancelado"].includes(statusNome)) return null;
  if (["Pausado", "Aguardando Peça"].includes(statusNome)) return "pausado";

  // O Laravel envia essa propriedade pronta com 'ok', 'alerta' ou 'vencido'
  return (os.status_sla as SlaStatus) || null;
};

export interface SlaCalculo {
  statusSla: SlaStatus;
  deadline: Date;
  isOverdue: boolean;
  formattedTime: string;
  textClass: string;
  bgClass: string;
}

// Monta os dados de exibição do painel de SLA. NÃO faz conta de tempo: o "tempo
// restante" e o "atrasado" vêm prontos do back-end (sla_tempo_restante / sla_atrasado).
// Aqui só lemos esses valores e escolhemos a cor (apresentação). Retorna null quando
// não há SLA aplicável (sem prazo, ou chamado fechado/cancelado).
export const calcularSla = (os: Ordem | null): SlaCalculo | null => {
  if (!os || !os.sla_limite_data) return null;

  const statusSlaValor = os.status_sla as SlaStatus;
  const statusNome = (os.status as any)?.nome || os.status;
  if (["Fechado", "Cancelado"].includes(statusNome)) return null;

  // deadline é só a data do prazo (vinda do back) formatada para exibição.
  const deadline = new Date(os.sla_limite_data);
  const isOverdue = !!os.sla_atrasado;
  const formattedTime = os.sla_tempo_restante ?? "";

  let textClass = "text-green-600 dark:text-green-400";
  let bgClass = "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/30";

  if (statusSlaValor === "vencido") {
    textClass = "text-red-600 dark:text-red-400 font-bold";
    bgClass = "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/30";
  } else if (statusSlaValor === "alerta") {
    textClass = "text-yellow-600 dark:text-yellow-400 font-bold";
    bgClass = "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800/30";
  } else if (statusSlaValor === "pausado") {
    textClass = "text-indigo-600 dark:text-indigo-400";
    bgClass = "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/30";
  }

  return { statusSla: statusSlaValor, deadline, isOverdue, formattedTime, textClass, bgClass };
};
