"use client";
import { statusCor, badgeCorPadrao } from "../../lib/constantes";
import { AnexoPreview, Ordem } from "../../types";

interface Props {
  chamado: Ordem;
  onPreviewAnexo: (preview: AnexoPreview) => void;
  onFechar: () => void;
}

// Coluna esquerda do modal em modo leitura, exibida para o cliente (cargo "Usuario").
export default function DetalhesChamadoUsuario({ chamado, onPreviewAnexo, onFechar }: Props) {
  const statusNome = (chamado.status as any)?.nome || (chamado.status as any);

  return (
    <div className="space-y-5">
      <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 space-y-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Categoria
          </span>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-0.5 block">
            {(chamado.categoria as any)?.nome || (chamado.categoria as any) || "Geral"}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Localização
          </span>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-0.5 block">
            {chamado.localizacao || "Não informada"}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Situação
          </span>
          <span
            className={`inline-block px-2 py-1 rounded-lg text-[9px] font-black uppercase mt-1 ${
              statusCor[statusNome] || badgeCorPadrao
            }`}
          >
            {statusNome}
          </span>
        </div>

        {/* Solução */}
        {(chamado.solucao || statusNome === "Fechado") && (
          <div className="pt-2 border-t border-slate-300 dark:border-slate-800">
            <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider block">
              Solução
            </span>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mt-1 leading-relaxed whitespace-pre-line bg-green-50/50 dark:bg-green-950/10 p-3 rounded-xl border border-green-100/50 dark:border-green-900/20">
              {chamado.solucao || "Chamado resolvido."}
            </p>
          </div>
        )}
      </div>

      <div>
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
          Anexo do Chamado
        </span>
        {chamado.anexo_url ? (
          <div className="text-[12px]">
            <button
              type="button"
              onClick={() => onPreviewAnexo({ url: chamado.anexo_url as string, osId: chamado.id })}
              className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors font-semibold"
            >
              Visualizar anexo enviado
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-0.5">Sem anexo</p>
        )}
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={onFechar}
          className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all text-center block"
        >
          FECHAR
        </button>
      </div>
    </div>
  );
}
