"use client";
import { useRouter } from "next/navigation";
import { statCardClass, statTituloClass } from "../../lib/constantes";
import { EstatisticasGeral } from "../../types";

// Card 1: proporção de chamados resolvidos x em aberto, e alerta (clicável) de
// chamados pendentes de atribuição.
export default function CardStatusChamados({ geral }: { geral: EstatisticasGeral }) {
  const router = useRouter();
  const percAbertos = geral.total > 0 ? (geral.abertos / geral.total) * 100 : 0;

  return (
    <div className={statCardClass}>
      <h3 className={statTituloClass}>Status dos Chamados</h3>
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-[10px] md:text-xs font-bold mb-1">
            <span className="text-slate-600 dark:text-slate-300">RESOLVIDOS</span>
            <span className="text-green-600 dark:text-green-400">{geral.resolvidos}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 md:h-4 rounded-full overflow-hidden">
            <div
              className="bg-green-500 h-full transition-all duration-1000"
              style={{ width: `${geral.perc_resolvidos}%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-[10px] md:text-xs font-bold mb-1">
            <span className="text-slate-600 dark:text-slate-300">EM ABERTO</span>
            <span className="text-blue-600 dark:text-blue-400">{geral.abertos}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 md:h-4 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-1000"
              style={{ width: `${percAbertos}%` }}
            ></div>
          </div>
        </div>

        {geral.sem_tecnico > 0 && (
          <button
            type="button"
            onClick={() => router.push("/?sem_tecnico=1")}
            title="Ver chamados pendentes de atribuição"
            className="mt-2 w-full flex items-center gap-2 bg-orange-100 dark:bg-orange-900/20 border border-orange-500 dark:border-orange-800 text-orange-800 dark:text-orange-400 px-3 py-2 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/40 transition-colors cursor-pointer"
          >
            <span className="text-[10px] font-bold">
              {geral.sem_tecnico} chamado{geral.sem_tecnico > 1 ? "s" : ""} sem técnico
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
