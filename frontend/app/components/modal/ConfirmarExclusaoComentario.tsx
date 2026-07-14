"use client";
import { Comentario } from "../../types";

interface Props {
  comentario: Comentario;
  onExcluir: (tipo: "mim" | "todos") => void;
  onCancelar: () => void;
}

// Diálogo de exclusão de mensagem: uma única lixeira abre este passo, onde o usuário
// escolhe o alcance da exclusão. z-[60] para ficar acima do modal do chamado (z-50).
export default function ConfirmarExclusaoComentario({ comentario, onExcluir, onCancelar }: Props) {
  return (
    <div
      className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onCancelar}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border-b border-slate-300 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#1e3a8a] px-5 py-4">
          <h3 className="text-sm font-black text-white uppercase tracking-widest">
            Excluir mensagem
          </h3>
        </div>

        <div className="p-5">
          <p className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-widest mb-2">
            Esta mensagem será removida
          </p>
          <p className="text-xs italic text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 line-clamp-3 mb-5">
            {comentario.conteudo}
          </p>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => onExcluir("mim")}
              className="w-full py-2.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Excluir para mim
            </button>
            <button
              type="button"
              onClick={() => onExcluir("todos")}
              className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-red-600/20"
            >
              Excluir para todos
            </button>
            <button
              type="button"
              onClick={onCancelar}
              className="w-full py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
