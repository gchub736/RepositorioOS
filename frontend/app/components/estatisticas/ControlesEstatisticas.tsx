"use client";
import { RefreshCw } from "lucide-react";
import { filterClass } from "../../lib/constantes";
import { PeriodoEstatisticas } from "../../types";

interface Props {
  periodo: PeriodoEstatisticas;
  setPeriodo: (p: PeriodoEstatisticas) => void;
  atualizadoEm: Date | null;
  carregando: boolean;
  onRecarregar: () => void;
}

const OPCOES: { valor: PeriodoEstatisticas; label: string }[] = [
  { valor: 0, label: "Todo o período" },
  { valor: 7, label: "Últimos 7 dias" },
  { valor: 30, label: "Últimos 30 dias" },
  { valor: 90, label: "Últimos 90 dias" },
];

// Seletor de período + botão de atualizar, com a hora da última carga.
export default function ControlesEstatisticas({
  periodo,
  setPeriodo,
  atualizadoEm,
  carregando,
  onRecarregar,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
      {atualizadoEm && (
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden lg:block mr-1">
          Atualizado às{" "}
          {atualizadoEm.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
        </span>
      )}
      <div className="flex items-center gap-2">
        <select
          value={periodo}
          onChange={(e) => setPeriodo(Number(e.target.value) as PeriodoEstatisticas)}
          className={`${filterClass} flex-1 sm:flex-none`}
        >
          {OPCOES.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.label}
            </option>
          ))}
        </select>
        <button
          onClick={onRecarregar}
          disabled={carregando}
          title="Atualizar"
          className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 flex-shrink-0"
        >
          <RefreshCw size={14} className={carregando ? "animate-spin" : ""} />
        </button>
      </div>
    </div>
  );
}
