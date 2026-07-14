import { calcularSla } from "../../lib/sla";
import { Ordem } from "../../types";

// Painel de Controle de SLA exibido no modal (Admin/Técnico). Não renderiza nada quando
// não há SLA aplicável.
export default function PainelSla({ os }: { os: Ordem }) {
  const sla = calcularSla(os);
  if (!sla) return null;

  const { statusSla, deadline, isOverdue, formattedTime, textClass, bgClass } = sla;

  return (
    <div className={`p-4 rounded-xl border ${bgClass} mb-6 flex flex-col gap-1.5`}>
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Controle de SLA</span>
        <span
          className={`text-[9px] font-black uppercase px-2 py-1 rounded ${
            statusSla === "vencido"
              ? "bg-red-100 text-red-700"
              : statusSla === "alerta"
              ? "bg-yellow-100 text-yellow-700"
              : statusSla === "pausado"
              ? "bg-indigo-100 text-indigo-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {statusSla === "vencido"
            ? "Vencido"
            : statusSla === "alerta"
            ? "Em Alerta"
            : statusSla === "pausado"
            ? "Pausado"
            : "No Prazo"}
        </span>
      </div>
      <div className="flex justify-between items-end mt-1">
        <div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block font-semibold">
            Prazo de Resolução
          </span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {deadline.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block font-semibold">
            {statusSla === "pausado" ? "Contagem Suspensa" : isOverdue ? "Atrasado há" : "Tempo Restante"}
          </span>
          <span className={`text-sm font-black ${textClass}`}>
            {statusSla === "pausado" ? "—" : formattedTime}
          </span>
        </div>
      </div>
    </div>
  );
}
