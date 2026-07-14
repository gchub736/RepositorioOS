import React from "react";

interface Props {
  titulo: string;
  subtitulo: string;
  children: React.ReactNode;
  rodape?: React.ReactNode;
}

// Casca visual compartilhada pelas telas de autenticação (login, cadastro,
// esqueci a senha e redefinir senha), garantindo o mesmo padrão nas quatro.
export default function AuthCard({ titulo, subtitulo, children, rodape }: Props) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-slate-100 dark:bg-slate-950">
      {/* Imagem de fundo (decorativa) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/fundo-login.png')" }}
        aria-hidden="true"
      />
      {/* Véu escuro só no tema escuro: a imagem é clara e brigaria com o dark mode */}
      <div className="absolute inset-0 bg-transparent dark:bg-slate-950/85" aria-hidden="true" />

      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-300 dark:border-slate-800 overflow-hidden">
        {/* Faixa navy, no mesmo padrão do modal e do popover de notificações */}
        <div className="bg-[#1e3a8a] px-8 py-6 text-center">
          <h1 className="text-xl font-black text-white uppercase tracking-tighter">{titulo}</h1>
          <p className="text-[10px] text-blue-200 mt-1.5 uppercase tracking-[0.2em] font-bold">
            {subtitulo}
          </p>
        </div>

        <div className="p-8">
          {children}
          {rodape && (
            <div className="mt-7 text-center border-t border-slate-300 dark:border-slate-800 pt-5">
              {rodape}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
