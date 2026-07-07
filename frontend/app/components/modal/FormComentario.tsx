"use client";
import { ComentariosControle } from "../../hooks/useComentarios";

// Formulário de envio de comentário, com preview do comentário sendo respondido.
export default function FormComentario({ controle }: { controle: ComentariosControle }) {
  const {
    comentarioRespondendo,
    setComentarioRespondendo,
    inputComentarioRef,
    novoComentario,
    setNovoComentario,
    enviandoComentario,
    enviarComentario,
  } = controle;

  return (
    <div className="mt-auto border-t border-slate-150 dark:border-slate-800/80 pt-3 flex flex-col gap-2">
      {comentarioRespondendo && (
        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-xl flex justify-between items-start border-l-4 border-blue-500 shadow-sm relative">
          <div className="pr-6">
            <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mb-0.5">
              Respondendo a {comentarioRespondendo.usuario_nome}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 max-w-[250px] italic">
              {comentarioRespondendo.conteudo}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setComentarioRespondendo(null)}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      )}
      <form onSubmit={enviarComentario} className="flex gap-2">
        <input
          ref={inputComentarioRef}
          type="text"
          value={novoComentario}
          onChange={(e) => setNovoComentario(e.target.value)}
          placeholder="Digite sua mensagem..."
          maxLength={1000}
          className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-850 dark:text-slate-150"
          required
        />
        <button
          type="submit"
          disabled={enviandoComentario || !novoComentario.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-black uppercase transition-colors"
        >
          {enviandoComentario ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}
