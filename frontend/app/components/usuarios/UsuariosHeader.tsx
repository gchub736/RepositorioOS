"use client";
import { Home } from "lucide-react";
import { filterClass } from "../../lib/constantes";

interface Props {
  filtroBusca: string;
  setFiltroBusca: (valor: string) => void;
  onBuscar: () => void;
}

// Cabeçalho da tela de usuários: breadcrumb, título/subtítulo e busca por nome/CPF.
export default function UsuariosHeader({ filtroBusca, setFiltroBusca, onBuscar }: Props) {
  return (
    <>
      <div className="flex items-center gap-1.5 mb-2 text-xs">
        <Home size={14} className="text-slate-400 dark:text-slate-500" />
        <span className="text-slate-400 dark:text-slate-500 font-medium">Início</span>
        <span className="text-slate-400 dark:text-slate-500">&gt;</span>
        <span className="text-slate-600 dark:text-slate-300 font-semibold">Usuários</span>
      </div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
            Usuários Cadastrados
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Visualize e gerencie os usuários do sistema.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Buscar por Nome ou CPF..."
            className={`${filterClass} w-full sm:flex-1 md:flex-none md:w-64`}
            value={filtroBusca}
            onChange={(e) => setFiltroBusca(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onBuscar();
            }}
          />
          <button
            onClick={onBuscar}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#1e3a8a] hover:bg-[#162e6e] text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#1e3a8a]/20"
          >
            Buscar
          </button>
        </div>
      </div>
    </>
  );
}
