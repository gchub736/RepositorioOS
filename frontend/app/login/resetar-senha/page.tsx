"use client";
import { Suspense } from "react";
import Link from "next/link";
import { useResetarSenha } from "../../hooks";
import { AuthCard, ResetarSenhaForm } from "../../components/auth";

// Orquestrador da redefinição de senha (o token vem por ?token= na URL do e-mail).
function ResetarSenhaConteudo() {
  const {
    validando,
    tokenValido,
    erroToken,
    novaSenha,
    setNovaSenha,
    confirmacao,
    setConfirmacao,
    erro,
    sucesso,
    isSubmitting,
    submeter,
  } = useResetarSenha();

  return (
    <AuthCard
      titulo="Redefinir Senha"
      subtitulo="Crie sua nova senha de acesso"
      rodape={
        <Link
          href="/login"
          className="text-[11px] font-bold text-slate-600 hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-400 uppercase tracking-widest transition-colors"
        >
          Voltar para o login
        </Link>
      }
    >
      <ResetarSenhaForm
        validando={validando}
        tokenValido={tokenValido}
        erroToken={erroToken}
        novaSenha={novaSenha}
        setNovaSenha={setNovaSenha}
        confirmacao={confirmacao}
        setConfirmacao={setConfirmacao}
        erro={erro}
        sucesso={sucesso}
        isSubmitting={isSubmitting}
        onSubmit={submeter}
      />
    </AuthCard>
  );
}

// useSearchParams exige um limite de Suspense no App Router.
export default function ResetarSenha() {
  return (
    <Suspense
      fallback={
        <AuthCard titulo="Redefinir Senha" subtitulo="Crie sua nova senha de acesso">
          <div className="flex items-center justify-center gap-2 py-6 text-xs text-slate-600 dark:text-slate-400">
            <div className="w-4 h-4 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
            <span>Carregando...</span>
          </div>
        </AuthCard>
      }
    >
      <ResetarSenhaConteudo />
    </Suspense>
  );
}
