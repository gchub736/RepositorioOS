"use client";
import Badge from "../comum/Badge";
import IconeAnexo from "../comum/IconeAnexo";
import { categoriaCor, statusCor, badgeCorPadrao } from "../../lib/constantes";
import { AnexoPreview, Ordem } from "../../types";

interface Props {
  ordens: Ordem[];
  carregando: boolean;
  onAbrir: (os: Ordem) => void;
  onPreviewAnexo: (preview: AnexoPreview) => void;
}

// Tabela simplificada exibida para o cliente (cargo "Usuario"). Desktop (md+): <table>.
// Mobile: cards (a tabela tem largura mínima e não cabe em telas estreitas).
export default function ChamadosTabelaUsuario({
  ordens,
  carregando,
  onAbrir,
  onPreviewAnexo,
}: Props) {
  const vazio = !carregando && ordens.length === 0;

  return (
    <>
      {/* ===== DESKTOP (xl+): tabela ===== */}
      <div className="hidden xl:block bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-300 dark:border-slate-800 overflow-auto max-w-full flex-1 min-h-0">
        <table className="w-full min-w-[640px] text-left text-[11px] table-fixed">
          <thead className="bg-blue-900 text-white font-bold uppercase text-[10px] tracking-widest">
            <tr>
              <th className="sticky top-0 z-10 bg-blue-900 px-4 py-3 rounded-tl-lg w-[45%]">Chamado</th>
              <th className="sticky top-0 z-10 bg-blue-900 px-4 py-3 w-[15%]">Categoria</th>
              <th className="sticky top-0 z-10 bg-blue-900 px-4 py-3 w-[15%] text-center">Abertura</th>
              <th className="sticky top-0 z-10 bg-blue-900 px-4 py-3 w-[15%] text-center">Situação</th>
              <th className="sticky top-0 z-10 bg-blue-900 px-4 py-3 rounded-tr-lg w-[10%] text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300 dark:divide-slate-800">
            {carregando && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400 dark:text-slate-600 italic text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                    <span>Carregando chamados...</span>
                  </div>
                </td>
              </tr>
            )}
            {vazio && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400 dark:text-slate-600 italic text-sm">
                  Você ainda não abriu nenhum chamado.
                </td>
              </tr>
            )}
            {!carregando &&
              ordens.map((os) => (
                <tr key={os.id}>
                  <td className="px-4 py-3 overflow-hidden align-middle">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                        <span className="truncate overflow-hidden text-sm">{os.titulo}</span>
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
                      <span className="text-slate-500 dark:text-slate-400 text-[10px] truncate">
                        {os.localizacao || <span className="italic">Local não informado</span>}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 overflow-hidden align-middle">
                    <Badge
                      cor={categoriaCor[(os.categoria as any)?.nome || (os.categoria as any)] || badgeCorPadrao}
                      className="text-[10px]"
                    >
                      {(os.categoria as any)?.nome || (os.categoria as any) || "-"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-[11px] font-semibold text-center truncate overflow-hidden align-middle">
                    {os.criado_em ? new Date(os.criado_em).toLocaleDateString("pt-BR") : "-"}
                  </td>
                  <td className="px-4 py-3 text-center overflow-hidden align-middle">
                    <Badge
                      cor={statusCor[(os.status as any)?.nome || (os.status as any)] || badgeCorPadrao}
                      className="text-[10px] truncate"
                    >
                      {(os.status as any)?.nome || (os.status as any)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right overflow-hidden align-middle">
                    <button
                      onClick={() => onAbrir(os)}
                      className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-bold text-[10px] tracking-wider uppercase transition-colors shadow-sm"
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ===== MOBILE/TABLET (< xl): cards ===== */}
      <div className="xl:hidden flex flex-col gap-3">
        {carregando && (
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-800 p-6 flex items-center justify-center gap-2 text-slate-400 dark:text-slate-600 italic text-sm">
            <div className="w-4 h-4 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
            <span>Carregando chamados...</span>
          </div>
        )}
        {vazio && (
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-800 p-6 text-center text-slate-400 dark:text-slate-600 italic text-sm">
            Você ainda não abriu nenhum chamado.
          </div>
        )}
        {!carregando &&
          ordens.map((os) => (
            <div
              key={os.id}
              className="bg-white dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-800 shadow-sm p-4"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 dark:text-slate-100 text-base leading-snug break-words min-w-0">
                  {os.titulo}
                </span>
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
              <p className="text-slate-500 dark:text-slate-400 text-xs truncate mt-0.5">
                {os.localizacao || <span className="italic">Local não informado</span>}
              </p>

              <div className="flex items-center flex-wrap gap-2 mt-3">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${categoriaCor[(os.categoria as any)?.nome || (os.categoria as any)] || badgeCorPadrao}`}>
                  {(os.categoria as any)?.nome || (os.categoria as any) || "-"}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${statusCor[(os.status as any)?.nome || (os.status as any)] || badgeCorPadrao}`}>
                  {(os.status as any)?.nome || (os.status as any)}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap ml-auto">
                  {os.criado_em ? new Date(os.criado_em).toLocaleDateString("pt-BR") : "-"}
                </span>
              </div>

              <button
                onClick={() => onAbrir(os)}
                className="w-full mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Ver Detalhes
              </button>
            </div>
          ))}
      </div>
    </>
  );
}
