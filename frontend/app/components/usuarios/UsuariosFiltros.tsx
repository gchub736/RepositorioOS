"use client";
import { filterClass } from "../../lib/constantes";

interface Props {
  filtroId: string;
  setFiltroId: (valor: string) => void;
  onBuscar: () => void;
  itensPorPagina: number;
  setItensPorPagina: (valor: number) => void;
  setPaginaAtual: (pagina: number) => void;
}

// Barra de filtros da tela de usuários: filtro por ID e itens por página.
export default function UsuariosFiltros({
  filtroId,
  setFiltroId,
  onBuscar,
  itensPorPagina,
  setItensPorPagina,
  setPaginaAtual,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6 sm:flex-wrap bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-300 dark:border-slate-800 shadow-sm">
      <input
        type="number"
        placeholder="Filtrar por ID"
        value={filtroId}
        onChange={(e) => setFiltroId(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onBuscar();
        }}
        className={`${filterClass} w-full sm:w-40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
      />
      <select
        value={itensPorPagina}
        onChange={(e) => {
          setItensPorPagina(Number(e.target.value));
          setPaginaAtual(1);
        }}
        className={`${filterClass} w-full sm:w-auto`}
      >
        <option value={5}>5 por página</option>
        <option value={10}>10 por página</option>
        <option value={15}>15 por página</option>
        <option value={30}>30 por página</option>
      </select>
    </div>
  );
}
