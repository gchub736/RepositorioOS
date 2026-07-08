"use client";
import { CheckCircle } from "lucide-react";

// Modal de confirmação exibido após registrar um chamado com sucesso.
export default function SucessoModal({ onFechar }: { onFechar: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl flex flex-col items-center justify-center max-w-sm w-full mx-4 animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-2xl font-black text-slate-800 dark:text-white text-center mb-3 tracking-tight">
          Chamado Registrado!
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-center text-sm mb-8 leading-relaxed">
          Sua solicitação foi enviada com sucesso e em breve será analisada pela nossa equipe técnica.
        </p>
        <button
          onClick={onFechar}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all uppercase text-xs tracking-widest shadow-lg shadow-blue-600/20"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
