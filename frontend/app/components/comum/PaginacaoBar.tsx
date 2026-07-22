"use client";
import Paginacao from "./Paginacao";

interface Props {
  page: number;
  lastPage: number;
  total: number;
  labelSingular: string;
  labelPlural: string;
  onPageChange: (page: number) => void;
}

// Barra inferior de paginação genérica (info textual + controle de páginas), reutilizada
// pelas telas de chamados e de usuários. Só aparece quando há mais de uma página.
export default function PaginacaoBar({
  page,
  lastPage,
  total,
  labelSingular,
  labelPlural,
  onPageChange,
}: Props) {
  if (lastPage <= 1) return null;

  return (
    <div className="flex justify-between items-center bg-white dark:bg-slate-900 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-800 shadow-sm mt-4 flex-shrink-0">
      <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest hidden md:block">
        Página {page} de {lastPage} • {total} {total === 1 ? labelSingular : labelPlural}
      </div>
      <div className="flex items-between justify-center w-full md:w-auto">
        <Paginacao currentPage={page} lastPage={lastPage} onPageChange={onPageChange} />
      </div>
    </div>
  );
}
