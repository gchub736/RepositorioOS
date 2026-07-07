"use client";
import { baixarAnexo } from "../services/ordensService";
import { baixarBlob } from "../lib/csv";
import { isUrlSegura } from "../lib/seguranca";
import { AnexoPreview } from "../types";

interface Props {
  anexoPreview: AnexoPreview;
  onClose: () => void;
}

// Modal de visualização de anexo (imagem ou PDF), com download e validação de segurança da URL.
export default function AnexoPreviewModal({ anexoPreview, onClose }: Props) {
  const baixar = async () => {
    try {
      const res = await baixarAnexo(anexoPreview.osId);
      const ext = anexoPreview.url.split(".").pop() || "pdf";
      baixarBlob(res.data, `anexo_os_${anexoPreview.osId}.${ext}`);
    } catch {
      alert("Erro ao baixar anexo.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[60]"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-300 dark:border-slate-800 max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-300 dark:border-slate-800">
          <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">
            Visualizar Anexo
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={baixar}
              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              BAIXAR
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold transition-colors"
            >
              FECHAR
            </button>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-auto flex items-center justify-center min-h-[400px]">
          {!isUrlSegura(anexoPreview.url) ? (
            <div className="text-red-500 font-bold text-sm text-center">
              ⚠️ URL de anexo bloqueada por motivos de segurança (domínio externo não confiável).
            </div>
          ) : anexoPreview.url.match(/\.(jpg|jpeg|png|gif|webp)/i) ? (
            <img
              src={anexoPreview.url}
              alt="Anexo"
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
          ) : (
            <iframe
              src={anexoPreview.url}
              className="w-full h-[70vh] rounded-lg border-0"
              title="Anexo PDF"
            />
          )}
        </div>
      </div>
    </div>
  );
}
