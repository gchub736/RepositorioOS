"use client";
import Link from "next/link";
import { useEsqueciSenha } from "../../hooks";
import { AuthCard, EsqueciSenhaForm } from "../../components/auth";

// Orquestrador da solicitação de recuperação de senha.
export default function EsqueciSenha() {
  const { cpf, setCpf, erro, enviado, isSubmitting, submeter } = useEsqueciSenha();

  return (
    <AuthCard
      titulo="Recuperar Senha"
      subtitulo="Enviaremos um link para o seu e-mail"
      rodape={
        <Link
          href="/login"
          className="text-[11px] font-bold text-slate-600 hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-400 uppercase tracking-widest transition-colors"
        >
          Voltar para o login
        </Link>
      }
    >
      <EsqueciSenhaForm
        cpf={cpf}
        setCpf={setCpf}
        erro={erro}
        enviado={enviado}
        isSubmitting={isSubmitting}
        onSubmit={submeter}
      />
    </AuthCard>
  );
}
