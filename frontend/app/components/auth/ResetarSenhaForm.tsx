"use client";
import Link from "next/link";
import { type FormEvent } from "react";
import InputSenha from "../InputSenha";
import AlertaAuth from "./AlertaAuth";
import { authLabelClass, authBotaoClass } from "../../lib/constantes";

interface Props {
  validando: boolean;
  tokenValido: boolean;
  erroToken: string;
  novaSenha: string;
  setNovaSenha: (v: string) => void;
  confirmacao: string;
  setConfirmacao: (v: string) => void;
  erro: string;
  sucesso: boolean;
  isSubmitting: boolean;
  onSubmit: (e: FormEvent) => void;
}

// Redefinição da senha a partir do link recebido por e-mail.
export default function ResetarSenhaForm({
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
  onSubmit,
}: Props) {
  // 1) Validando o token do link
  if (validando) {
    return (
      <div className="flex items-center justify-center gap-2 py-6 text-xs text-slate-600 dark:text-slate-400">
        <div className="w-4 h-4 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
        <span>Validando o link...</span>
      </div>
    );
  }

  // 2) Link inválido/expirado — não adianta mostrar o formulário
  if (!tokenValido) {
    return (
      <>
        <AlertaAuth tipo="erro">{erroToken}</AlertaAuth>
        <Link
          href="/login/esqueci-senha"
          className={`${authBotaoClass} block text-center`}
        >
          Solicitar novo link
        </Link>
      </>
    );
  }

  // 3) Senha redefinida
  if (sucesso) {
    return (
      <AlertaAuth tipo="sucesso">
        <strong className="block mb-0.5">Senha redefinida com sucesso!</strong>
        Redirecionando para o login...
      </AlertaAuth>
    );
  }

  // 4) Formulário
  return (
    <>
      {erro && <AlertaAuth tipo="erro">{erro}</AlertaAuth>}

      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
        Crie uma nova senha para a sua conta. Ela deve ter no mínimo 4 caracteres.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className={authLabelClass}>Nova Senha</label>
          <InputSenha
            value={novaSenha}
            onChange={setNovaSenha}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="space-y-1.5">
          <label className={authLabelClass}>Confirmar Nova Senha</label>
          <InputSenha
            value={confirmacao}
            onChange={setConfirmacao}
            required
            autoComplete="new-password"
          />
        </div>

        <button type="submit" disabled={isSubmitting} className={authBotaoClass}>
          {isSubmitting ? "Salvando..." : "Redefinir senha"}
        </button>
      </form>
    </>
  );
}
