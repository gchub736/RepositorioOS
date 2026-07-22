"use client";
import { Pin, SquarePen, Trash2 } from "lucide-react";
import Badge from "../comum/Badge";
import IconeAnexo from "../comum/IconeAnexo";
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

// Cor (classes Tailwind) do badge de status — regra de negócio compartilhada.
function statusBadgeCor(statusNome: string): string {
  if (statusNome === "Fechado") return "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400";
  if (["Pausado", "Aguardando Peça"].includes(statusNome)) return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400";
  if (statusNome === "Em Andamento") return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
  return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
}

// Cor (classes Tailwind) do badge de SLA — compartilhada entre tabela e card.
function slaBadgeCor(slaStatus: NonNullable<ReturnType<typeof statusSla>>): string {
  if (slaStatus === "vencido") return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  if (slaStatus === "alerta") return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
  if (slaStatus === "pausado") return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400";
  return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
}

// Badge de status para a tabela (desktop).
function StatusBadge({ statusNome, motivoPausa }: { statusNome: string; motivoPausa?: string | null }) {
  return (
    <Badge cor={statusBadgeCor(statusNome)} className="text-[9px] truncate w-max" title={motivoPausa || undefined}>
      {statusNome}
    </Badge>
  );
}

// Badge de SLA para a tabela (desktop) — traço quando não há SLA aplicável.
function SlaBadge({ slaStatus }: { slaStatus: ReturnType<typeof statusSla> }) {
  if (!slaStatus) return <span className="text-[10px] text-slate-300 dark:text-slate-600 italic">—</span>;
  return (
    <Badge cor={slaBadgeCor(slaStatus)} className="text-[9px] truncate">
      {slaLabel[slaStatus]}
    </Badge>
  );
}

// Pin de fixar/desfixar — mesmo botão na tabela e no card.
function BotaoFixar({ os, onFixar }: { os: Ordem; onFixar: (id: number) => void }) {
  return (
    <button
      onClick={() => onFixar(os.id)}
      className={`flex items-center flex-shrink-0 transition-colors ${
        os.fixada
          ? "text-red-500 hover:text-red-600"
          : "text-slate-500 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
      }`}
      title={os.fixada ? "Desfixar Chamado" : "Fixar Chamado"}
    >
      <Pin size={12} className={os.fixada ? "fill-current" : ""} />
    </button>
  );
}

// Ações (editar/deletar) — mesmo par de botões na tabela e no card.
function Acoes({
  os,
  cargo,
  onAbrir,
  onDeletar,
}: {
  os: Ordem;
  cargo: string;
  onAbrir: (os: Ordem) => void;
  onDeletar: (id: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
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
  );
}

// Tabela completa exibida para Admin/Técnico. Desktop (md+): <table>. Mobile: cards
// (a tabela tem largura mínima e não cabe em telas estreitas).
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
  const vazio = !carregando && ordens.length === 0;

  return (
    <>
      {/* ===== DESKTOP (xl+): tabela ===== */}
      <div className="hidden xl:block bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-300 dark:border-slate-800 overflow-auto max-w-full flex-1 min-h-0">
        <table className="w-full min-w-[880px] text-left text-[11px] table-fixed">
          <thead className="bg-blue-900 text-white font-bold uppercase text-[10px] tracking-widest">
            <tr>
              <th className="sticky top-0 z-10 bg-blue-900 px-3 py-3 w-[20%]">CHAMADOS</th>
              <th className="sticky top-0 z-10 bg-blue-900 pl-5 pr-3 py-3 w-[13%]">Categoria</th>
              <th className="sticky top-0 z-10 bg-blue-900 px-3 py-3 w-[14%]">Solicitante</th>
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
            {vazio && (
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
                          <BotaoFixar os={os} onFixar={onFixar} />
                          <span className="relative top-[1px] text-[10px] text-blue-900 dark:text-blue-400 font-mono leading-none">#{os.id}</span>
                          {os.anexo_url && (
                            <button
                              onClick={() => onPreviewAnexo({ url: os.anexo_url as string, osId: os.id })}
                              className="flex items-center justify-center p-1 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/70 flex-shrink-0 transition-colors"
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
                        <StatusBadge statusNome={statusNome} motivoPausa={os.motivo_pausa} />
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
                      <SlaBadge slaStatus={slaStatus} />
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
                      <div className="flex items-center justify-center">
                        <Acoes os={os} cargo={cargo} onAbrir={onAbrir} onDeletar={onDeletar} />
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* ===== MOBILE/TABLET (< xl): cards ===== */}
      <div className="xl:hidden flex flex-col gap-3">
        {carregando && (
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-800 p-6 flex items-center justify-center gap-2 text-slate-400 dark:text-slate-600 italic text-sm">
            <div className="w-4 h-4 border-2 border-navy-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Carregando chamados...</span>
          </div>
        )}
        {vazio && (
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-800 p-6 text-center text-slate-400 dark:text-slate-600 italic text-sm">
            Nenhum chamado encontrado.
          </div>
        )}
        {!carregando &&
          ordens.map((os, index) => {
            const slaStatus = statusSla(os);
            const statusNome = (os.status as any)?.nome || (os.status as any);
            return (
              <div
                key={os.id}
                className={`bg-white dark:bg-slate-900 rounded-lg border shadow-sm p-4 transition-colors ${
                  navMode && navIndex === index
                    ? "border-blue-500 ring-2 ring-blue-500 ring-inset"
                    : "border-slate-300 dark:border-slate-800"
                }`}
              >
                {/* Topo: ID + pin + anexo à esquerda; título logo abaixo. Ações vão pro rodapé. */}
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                  <BotaoFixar os={os} onFixar={onFixar} />
                  <span className="text-xs text-blue-900 dark:text-blue-400 font-mono font-semibold">#{os.id}</span>
                  {os.anexo_url && (
                    <button
                      onClick={() => onPreviewAnexo({ url: os.anexo_url as string, osId: os.id })}
                      className="flex items-center justify-center p-1 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/70 flex-shrink-0 transition-colors"
                      title="Ver Anexo"
                    >
                      <IconeAnexo size={13} />
                    </button>
                  )}
                </div>

                <p className="font-bold text-slate-800 dark:text-slate-100 text-base leading-snug mt-1 break-words">
                  {os.titulo}
                </p>

                {/* Tags: fonte normal (não black), maiores e legíveis. */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${categoriaCor[(os.categoria as any)?.nome || (os.categoria as any)] || badgeCorPadrao}`}>
                    {(os.categoria as any)?.nome || (os.categoria as any) || "-"}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${urgenciaCor[(os.urgencia as any)?.nome || (os.urgencia as any)] || badgeCorPadrao}`}>
                    {(os.urgencia as any)?.nome || (os.urgencia as any) || "-"}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${statusBadgeCor(statusNome)}`}>
                    {statusNome}
                  </span>
                  {slaStatus && (
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${slaBadgeCor(slaStatus)}`}>
                      {slaLabel[slaStatus]}
                    </span>
                  )}
                </div>

                {/* Solicitante + Responsável em grade, com rótulos claros. */}
                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Solicitante</p>
                    <p className="text-slate-700 dark:text-slate-300 font-medium truncate mt-0.5">{os.usuario?.nome || "-"}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {os.criado_em ? new Date(os.criado_em).toLocaleDateString("pt-BR") : "-"}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Responsável</p>
                    <p className="text-slate-700 dark:text-slate-300 font-medium truncate mt-0.5">
                      {os.tecnico?.nome || <span className="italic text-slate-400">Sem atribuição</span>}
                    </p>
                  </div>
                </div>

                {/* Ações no rodapé, botões grandes e rotulados. */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => onAbrir(os)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    <SquarePen size={14} /> Editar
                  </button>
                  {cargo === "Admin" && (
                    <button
                      onClick={() => onDeletar(os.id)}
                      title="Excluir"
                      className="flex items-center justify-center px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}
