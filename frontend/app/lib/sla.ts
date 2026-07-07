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

// Calcula os dados de exibição do painel de SLA. Retorna null quando não há SLA
// aplicável (sem prazo, ou chamado fechado/cancelado).
export const calcularSla = (os: Ordem | null): SlaCalculo | null => {
  if (!os || !os.sla_limite_data) return null;

  const statusSlaValor = os.status_sla as SlaStatus;
  const statusNome = (os.status as any)?.nome || os.status;
  if (["Fechado", "Cancelado"].includes(statusNome)) return null;

  const deadline = new Date(os.sla_limite_data);
  const now = new Date();

  const diffMs = deadline.getTime() - now.getTime();
  const diffMinTotal = Math.floor(diffMs / (1000 * 60));
  const isOverdue = diffMinTotal < 0;

  const absMin = Math.abs(diffMinTotal);
  const horas = Math.floor(absMin / 60);
  const minutos = absMin % 60;

  let formattedTime = "";
  if (horas > 0) {
    formattedTime = `${horas}h e ${minutos}min`;
  } else {
    formattedTime = `${minutos}min`;
  }

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
