"use client";
import { selectClass } from "../../lib/constantes";
import { TecnicoBusca } from "../../hooks/useTecnicoBusca";

// Campo de busca (autocomplete) de técnico. Toda a lógica de busca/estado vem do hook
// useTecnicoBusca; este componente apenas apresenta e dispara os handlers.
export default function TecnicoAutocomplete({ tecnico }: { tecnico: TecnicoBusca }) {
  const {
    tecnicoBusca,
    tecnicoResultados,
    tecnicoDropdownAberto,
    buscandoTecnico,
    tecnicoDropdownRef,
    onChangeBusca,
    onFocus,
    selecionar,
    limpar,
  } = tecnico;

  return (
    <div className="relative" ref={tecnicoDropdownRef}>
      <label className="text-xs font-bold text-slate-400 uppercase">Técnico</label>
      <input
        type="text"
        value={tecnicoBusca}
        onChange={(e) => onChangeBusca(e.target.value)}
        onFocus={onFocus}
        placeholder="Buscar técnico por nome..."
        autoComplete="off"
        className={selectClass}
      />
      {tecnicoDropdownAberto && (
        <div className="absolute z-20 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          <button
            type="button"
            onClick={limpar}
            className="w-full text-left px-3 py-2 text-xs italic text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Não atribuído
          </button>
          {buscandoTecnico && (
            <div className="px-3 py-2 text-xs text-slate-400 italic">Buscando...</div>
          )}
          {!buscandoTecnico && tecnicoResultados.length === 0 && (
            <div className="px-3 py-2 text-xs text-slate-400 italic">Nenhum técnico encontrado.</div>
          )}
          {!buscandoTecnico &&
            tecnicoResultados.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => selecionar(t)}
                className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
              >
                {t.nome}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
