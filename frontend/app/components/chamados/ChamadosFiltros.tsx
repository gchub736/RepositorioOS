"use client";
import { X } from "lucide-react";
import { filterClass } from "../../lib/constantes";
import { Filtros, Metadado } from "../../types";

interface Props {
  cargo: string;
  filtros: Filtros;
  setFiltros: (f: Filtros) => void;
  statusList: Metadado[];
  categorias: Metadado[];
  urgenciasList: Metadado[];
}

// Barra de filtros da listagem. Alguns filtros só aparecem para não-cliente.
export default function ChamadosFiltros({
  cargo,
  filtros,
  setFiltros,
  statusList,
  categorias,
  urgenciasList,
}: Props) {
  return (
    <div className="flex gap-3 mb-6 flex-wrap bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-300 dark:border-slate-800 shadow-sm">
      {cargo !== "Usuario" && (
        <select
          value={filtros.status}
          onChange={(e) => setFiltros({ ...filtros, status: e.target.value, page: 1 })}
          className={filterClass}
        >
          <option value="">Todos os status</option>
          {statusList.map((s) => (
            <option key={s.id} value={s.nome}>
              {s.nome}
            </option>
          ))}
        </select>
      )}
      {cargo !== "Usuario" && (
        <select
          value={filtros.sla}
          onChange={(e) => setFiltros({ ...filtros, sla: e.target.value, page: 1 })}
          className={filterClass}
        >
          <option value="">Todos os SLAs</option>
          <option value="ok">No Prazo</option>
          <option value="alerta">Em Alerta</option>
          <option value="vencido">Vencido</option>
          <option value="pausado">Pausado</option>
        </select>
      )}
      <select
        value={filtros.categoria}
        onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value, page: 1 })}
        className={filterClass}
      >
        <option value="">Todas as categorias</option>
        {categorias.map((c) => (
          <option key={c.id} value={c.nome}>
            {c.nome}
          </option>
        ))}
      </select>
      {cargo !== "Usuario" && (
        <>
          <select
            value={filtros.urgencia}
            onChange={(e) => setFiltros({ ...filtros, urgencia: e.target.value, page: 1 })}
            className={filterClass}
          >
            <option value="">Todas as urgências</option>
            {urgenciasList.map((u) => (
              <option key={u.id} value={u.nome}>
                {u.nome}
              </option>
            ))}
          </select>
        </>
      )}
      <select
        value={filtros.per_page}
        onChange={(e) => setFiltros({ ...filtros, per_page: Number(e.target.value), page: 1 })}
        className={filterClass}
      >
        <option value={15}>15 por página</option>
        <option value={30}>30 por página</option>
        <option value={50}>50 por página</option>
        <option value={100}>100 por página</option>
      </select>
      {/* Chip do drill-down "pendentes de atribuição": sem isso o usuário veria a lista
          filtrada sem saber o porquê nem como limpar (não há select para esse filtro). */}
      {filtros.sem_tecnico && (
        <button
          onClick={() => setFiltros({ ...filtros, sem_tecnico: false, page: 1 })}
          title="Remover filtro"
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
        >
          Pendentes de atribuição
          <X size={13} />
        </button>
      )}

      {((cargo !== "Usuario" && (filtros.status || filtros.urgencia || filtros.sla)) ||
        filtros.categoria ||
        filtros.sem_tecnico) && (
        <button
          onClick={() =>
            setFiltros({
              ...filtros,
              status: "",
              categoria: "",
              urgencia: "",
              sla: "",
              sem_tecnico: false,
              page: 1,
              per_page: 15,
            })
          }
          className="text-xs font-bold text-red-400 hover:text-red-600 px-3"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}
