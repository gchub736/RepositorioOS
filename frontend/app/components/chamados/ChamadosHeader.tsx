"use client";
import { Home } from "lucide-react";
import { filterClass } from "../../lib/constantes";

interface Props {
  busca: string;
  onBuscaChange: (valor: string) => void;
  onExportarCSV: () => void;
  onAdicionar: () => void;
}

// Cabeçalho da tela de chamados: breadcrumb, título/subtítulo e ações (busca, CSV, adicionar).
export default function ChamadosHeader({
  busca,
  onBuscaChange,
  onExportarCSV,
  onAdicionar,
}: Props) {
  return (
    <>
      <div className="flex items-center gap-1.5 mb-2 text-xs">
        <Home size={14} className="text-slate-400 dark:text-slate-500" />
        <span className="text-slate-400 dark:text-slate-500 font-medium">Início</span>
        <span className="text-slate-400 dark:text-slate-500">&gt;</span>
        <span className="text-slate-600 dark:text-slate-300 font-semibold">Chamados</span>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
            Gestão de Chamados
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Visualize e gerencie as ordens de serviço.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Filtrar por ID ou título..."
            className={`${filterClass} w-64`}
            value={busca}
            onChange={(e) => onBuscaChange(e.target.value)}
          />
          <button
            onClick={onExportarCSV}
            className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-lg text-xs uppercase tracking-wider transition-all shadow-sm"
          >
            CSV
          </button>
          <button
            onClick={onAdicionar}
            className="px-4 py-2.5 bg-[#1e3a8a] hover:bg-[#162e6e] text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg shadow-[#1e3a8a]/20"
          >
            Adicionar
          </button>
        </div>
      </div>
    </>
  );
}
