import { statTituloClass, prioridadeCor } from "../../lib/constantes";
import { EstatisticaPrioridade } from "../../types";

// Lista de chamados em aberto agrupados por prioridade.
export default function ListaPrioridades({ prioridades }: { prioridades: EstatisticaPrioridade[] }) {
  return (
    <div className="flex flex-col h-full w-full">
      <h3 className={statTituloClass}>Abertos por Prioridade</h3>
      <div className="space-y-3">
        {prioridades && prioridades.length > 0 ? (
          prioridades.map((p) => (
            <div
              key={p.prioridade}
              className="flex justify-between items-center bg-slate-100 dark:bg-slate-800/50 p-2 rounded border border-slate-400/60 dark:border-slate-800"
            >
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${prioridadeCor[p.prioridade] || "bg-slate-400"}`}></div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase">
                  {p.prioridade}
                </span>
              </div>
              <span className="text-xs font-black text-slate-800 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-1 rounded shadow-sm border border-slate-400/60 dark:border-slate-700">
                {p.abertos}
              </span>
            </div>
          ))
        ) : (
          <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 italic">
            Nenhum chamado em aberto com prioridade classificada.
          </p>
        )}
      </div>
    </div>
  );
}
