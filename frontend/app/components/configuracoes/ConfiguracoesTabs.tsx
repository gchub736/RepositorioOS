"use client";
import { AbaConfig } from "../../types";

interface Props {
  abaAtiva: AbaConfig;
  setAbaAtiva: (aba: AbaConfig) => void;
  mostrarSistema: boolean; // aba Sistema só para Admin
}

// Alternador de abas (Meu Perfil / Sistema).
export default function ConfiguracoesTabs({ abaAtiva, setAbaAtiva, mostrarSistema }: Props) {
  const tabClass = (ativa: boolean) =>
    `px-4 py-2 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
      ativa
        ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
        : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
    }`;

  return (
    <div className="flex gap-2 mb-6 border-b border-slate-300 dark:border-slate-800 shrink-0">
      <button onClick={() => setAbaAtiva("perfil")} className={tabClass(abaAtiva === "perfil")}>
        Meu Perfil
      </button>
      {mostrarSistema && (
        <button onClick={() => setAbaAtiva("sistema")} className={tabClass(abaAtiva === "sistema")}>
          Sistema
        </button>
      )}
    </div>
  );
}
