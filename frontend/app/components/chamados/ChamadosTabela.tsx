"use client";
import { Pin, SquarePen, Trash2 } from "lucide-react";
import Badge from "../Badge";
import IconeAnexo from "../IconeAnexo";
import { urgenciaCor, categoriaCor, slaLabel, badgeCorPadrao } from "../../lib/constantes";
import { statusSla } from "../../lib/sla";
import { AnexoPreview, Ordem } from "../../types";

interface Props {
  ordens: Ordem[];
  carregando: boolean;
  cargo: string;
  navMode: boolean;
  navIndex: number;
  onAbrir: (os: Ordem) => void;
  onPreviewAnexo: (preview: AnexoPreview) => void;
  onFixar: (id: number) => void;
  onDeletar: (id: number) => void;
}

// Tabela completa exibida para Admin/Técnico.
export default function ChamadosTabela({
  ordens,
  carregando,
  cargo,
  navMode,
  navIndex,
  onAbrir,
  onPreviewAnexo,
  onFixar,
  onDeletar,
}: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-300 dark:border-slate-800 overflow-auto max-w-full flex-1 min-h-0">
      <table className="w-full min-w-[880px] text-left text-[11px] table-fixed">
        <thead className="bg-blue-900 text-white font-bold uppercase text-[10px] tracking-widest">
          <tr>
            <th className="sticky top-0 z-10 bg-blue-900 px-3 py-3 w-[20%]">CHAMADOS</th>
            <th className="sticky top-0 z-10 bg-blue-900 px-3 py-3 w-[12%]">Categoria</th>
            <th className="sticky top-0 z-10 bg-blue-900 px-3 py-3 w-[15%]">Solicitante</th>
            <th className="sticky top-0 z-10 bg-blue-900 px-3 py-3 w-[11%] text-center">Urgência</th>
            <th className="sticky top-0 z-10 bg-blue-900 px-3 py-3 w-[11%] text-center">Status</th>
            <th className="sticky top-0 z-10 bg-blue-900 px-3 py-3 w-[10%] text-center">SLA</th>
            <th className="sticky top-0 z-10 bg-blue-900 px-3 py-3 w-[11%]">Responsável</th>
            <th className="sticky top-0 z-10 bg-blue-900 px-3 py-3 w-[10%] text-center">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-300 dark:divide-slate-800">
          {carregando && (
            <tr>
              <td colSpan={8} className="px-6 py-10 text-center text-slate-400 dark:text-slate-600 italic text-sm">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-navy-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Carregando chamados...</span>
                </div>
              </td>
            </tr>
          )}
          {!carregando && ordens.length === 0 && (
            <tr>
              <td colSpan={8} className="px-6 py-10 text-center text-slate-400 dark:text-slate-600 italic text-sm">
                Nenhum chamado encontrado.
              </td>
            </tr>
          )}
          {!carregando &&
            ordens.map((os, index) => {
              const slaStatus = statusSla(os);
              const statusNome = (os.status as any)?.nome || (os.status as any);
              return (
                <tr
                  key={os.id}
                  className={`transition-colors ${
                    navMode && navIndex === index
                      ? "bg-blue-100 dark:bg-blue-900/40 ring-2 ring-blue-500 ring-inset cursor-pointer"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                  }`}
                >
                  <td className="px-3 py-3 overflow-hidden align-middle">
                    <div className="flex flex-col gap-1 justify-center">
                      <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                        <button
                          onClick={() => onFixar(os.id)}
                          className={`flex-shrink-0 transition-colors ${
                            os.fixada
                              ? "text-red-500 hover:text-red-600"
                              : "text-slate-500 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
                          }`}
                          title={os.fixada ? "Desfixar Chamado" : "Fixar Chamado"}
                        >
                          <Pin size={12} className={os.fixada ? "fill-current" : ""} />
                        </button>
                        <span className="text-[10px] text-blue-900 dark:text-blue-400 font-mono">#{os.id}</span>
                        {os.anexo_url && (
                          <button
                            onClick={() => onPreviewAnexo({ url: os.anexo_url as string, osId: os.id })}
                            className="p-1 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/70 flex-shrink-0 transition-colors"
                            title="Ver Anexo"
                          >
                            <IconeAnexo size={13} />
                          </button>
                        )}
                      </div>
                      <span className="truncate overflow-hidden text-xs font-bold text-slate-700 dark:text-slate-300">
                        {os.titulo}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 overflow-hidden align-middle">
                    <div className="flex items-center h-full">
                      <Badge
                        cor={categoriaCor[(os.categoria as any)?.nome || (os.categoria as any)] || badgeCorPadrao}
                        className="text-[9px]"
                      >
                        {(os.categoria as any)?.nome || (os.categoria as any) || "-"}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-3 py-3 overflow-hidden align-middle">
                    <div className="flex flex-col gap-0.5 justify-center h-full">
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">
                        {os.usuario?.nome || "-"}
                      </span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 truncate">
                        {os.criado_em ? new Date(os.criado_em).toLocaleDateString("pt-BR") : "-"}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center overflow-hidden align-middle">
                    <div className="flex flex-col gap-1 items-center justify-center h-full">
                      <Badge
                        cor={urgenciaCor[(os.urgencia as any)?.nome || (os.urgencia as any)] || badgeCorPadrao}
                        className="text-[9px] w-max"
                        title="Urgência"
                      >
                        {(os.urgencia as any)?.nome || (os.urgencia as any) || "-"}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center align-middle">
                    <div className="flex flex-col items-center justify-center relative">
                      <Badge
                        cor={
                          statusNome === "Fechado"
                            ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                            : ["Pausado", "Aguardando Peça"].includes(statusNome)
                            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                            : statusNome === "Em Andamento"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        }
                        className="text-[9px] truncate w-max"
                      >
                        {statusNome}
                      </Badge>
                      {os.motivo_pausa && (
                        <span
                          className="absolute -bottom-3.5 text-[9px] font-bold text-indigo-500 dark:text-indigo-400 truncate max-w-[90px]"
                          title={os.motivo_pausa}
                        >
                          {os.motivo_pausa}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center overflow-hidden align-middle">
                    {slaStatus ? (
                      <Badge
                        cor={
                          slaStatus === "vencido"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : slaStatus === "alerta"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : slaStatus === "pausado"
                            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        }
                        className="text-[9px] truncate"
                      >
                        {slaLabel[slaStatus]}
                      </Badge>
                    ) : (
                      <span className="text-[10px] text-slate-300 dark:text-slate-600 italic">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3 overflow-hidden align-middle">
                    <div className="flex flex-col gap-0.5 justify-center h-full">
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">
                        {os.tecnico?.nome || <span className="italic text-slate-400">Sem atribuição</span>}
                      </span>
                      <span
                        className="text-[9px] text-slate-500 dark:text-slate-400 truncate"
                        title={os.solucao}
                      >
                        {os.solucao ? os.solucao : <span className="italic">Sem solução</span>}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 overflow-hidden align-middle">
                    <div className="flex items-center gap-2 justify-center">
                      <button
                        onClick={() => onAbrir(os)}
                        title="Editar"
                        className="p-1.5 rounded-lg text-slate-500 dark:text-white hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        <SquarePen size={16} />
                      </button>
                      {cargo === "Admin" && (
                        <button
                          onClick={() => onDeletar(os.id)}
                          title="Deletar"
                          className="p-1.5 rounded-lg text-slate-500 dark:text-white hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
