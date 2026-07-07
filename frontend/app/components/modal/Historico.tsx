import { Historico as HistoricoTipo } from "../../types";

// Linha do tempo com o histórico de ações do chamado.
export default function Historico({ historicos }: { historicos: HistoricoTipo[] | undefined }) {
  return (
    <div className="space-y-4 flex-1 min-h-[240px] max-h-[340px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {!historicos || historicos.length === 0 ? (
        <p className="text-xs text-slate-400 dark:text-slate-500 italic">Nenhum registro de histórico.</p>
      ) : (
        [...historicos].reverse().map((h) => (
          <div key={h.id} className="relative pl-6 border-l border-blue-500/30 pb-4 last:pb-0">
            <div className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-100 dark:ring-blue-900/30" />
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-wider block">
              {h.acao}
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-semibold leading-relaxed">
              {h.descricao}
            </p>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium block mt-1">
              Por: {h.usuario?.nome || "Sistema"} •{" "}
              {new Date(h.criado_em || h.data || "").toLocaleString("pt-BR")}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
