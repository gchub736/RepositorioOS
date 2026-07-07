"use client";
import { SquarePen, Trash2 } from "lucide-react";
import { renderLinks } from "../../lib/renderLinks";
import { ComentariosControle } from "../../hooks/useComentarios";
import { Comentario } from "../../types";

interface Props {
  lista: Comentario[] | undefined;
  meuUsuarioId: string;
  controle: ComentariosControle;
}

// Lista de comentários (discussão) do chamado, com ações de responder/editar/excluir.
export default function ListaComentarios({ lista, meuUsuarioId, controle }: Props) {
  const {
    comentarioEditandoId,
    comentarioEditandoConteudo,
    setComentarioEditandoConteudo,
    setComentarioEditandoId,
    salvarEdicaoComentario,
    setComentarioRespondendo,
    iniciarEdicao,
    deletarComentario,
  } = controle;

  return (
    <div className="flex-1 space-y-3 overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mb-2 pb-2">
      {!lista || lista.length === 0 ? (
        <p className="text-xs text-slate-400 dark:text-slate-500 italic py-4">Nenhuma mensagem enviada.</p>
      ) : (
        lista.map((c) => {
          const isMe = String(c.usuario_id) === String(meuUsuarioId);
          const isEditing = comentarioEditandoId === c.id;

          return (
            <div
              key={c.id}
              className={`flex flex-col max-w-[85%] ${isMe ? "ml-auto items-end" : "mr-auto items-start"}`}
            >
              <span className="text-[9px] font-bold text-slate-400 mb-0.5">
                {c.usuario_nome} <span className="font-normal">({c.usuario_cargo})</span>
              </span>

              {isEditing ? (
                <div className="flex flex-col w-full gap-2 mt-1">
                  <textarea
                    value={comentarioEditandoConteudo}
                    onChange={(e) => setComentarioEditandoConteudo(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-blue-500 outline-none"
                    rows={3}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setComentarioEditandoId(null)}
                      className="text-[10px] px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg text-slate-700 dark:text-slate-200 font-bold transition-colors uppercase"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => salvarEdicaoComentario(c.id)}
                      className="text-[10px] px-3 py-1.5 bg-blue-900 hover:bg-blue-800 rounded-lg text-white font-bold transition-colors uppercase"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed group relative ${
                      isMe
                        ? "bg-blue-900 text-white rounded-tr-none"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-300/50 dark:border-slate-700/50"
                    }`}
                  >
                    {c.parent && (
                      <div
                        className={`mb-2 p-2 rounded-lg text-[10px] opacity-90 border-l-2 bg-black/10 dark:bg-white/10 ${
                          isMe ? "border-blue-200" : "border-slate-400"
                        }`}
                      >
                        <p className="font-bold mb-0.5">{c.parent.usuario?.nome || "Usuário"}</p>
                        <p className="line-clamp-2 max-w-[200px]">{c.parent.conteudo}</p>
                      </div>
                    )}
                    {renderLinks(c.conteudo)}

                    <div
                      className={`hidden group-hover:flex absolute -top-3 ${
                        isMe ? "right-0" : "left-0"
                      } bg-white dark:bg-slate-800 shadow-lg rounded-lg border border-slate-300 dark:border-slate-700 p-1 gap-1 z-10 items-center`}
                    >
                      <button
                        onClick={() => setComentarioRespondendo(c)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-green-500 transition-colors"
                        title="Responder"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                          />
                        </svg>
                      </button>
                      {c.pode_deletar && (
                        <>
                          {c.pode_editar && (
                            <button
                              onClick={() => iniciarEdicao(c)}
                              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-blue-500 transition-colors"
                              title="Editar"
                            >
                              <SquarePen size={16} className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => deletarComentario(c.id, "mim")}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-orange-500 transition-colors"
                            title="Deletar"
                          >
                            <Trash2 size={16} className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deletarComentario(c.id, "todos")}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-red-500 transition-colors"
                            title="Deletar"
                          >
                            <Trash2 size={16} className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[8px] text-slate-400 font-medium">
                      {new Date(c.criado_em).toLocaleDateString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {c.editado && (
                      <span className="text-[8px] text-slate-400 font-medium italic">• editado</span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
