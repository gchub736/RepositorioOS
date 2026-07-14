"use client";
import { type FormEvent } from "react";
import AlertaAuth from "./AlertaAuth";
import { authInputClass, authLabelClass, authBotaoClass } from "../../lib/constantes";
import { mascararCpf } from "../../lib/formatters";

interface Props {
  cpf: string;
  setCpf: (v: string) => void;
  erro: string;
  enviado: boolean;
  isSubmitting: boolean;
  onSubmit: (e: FormEvent) => void;
}

// Solicitação do link de recuperação. Após o envio mostramos uma mensagem
// genérica de propósito: o back não revela se o CPF existe, e o front também não.
export default function EsqueciSenhaForm({
  cpf,
  setCpf,
  erro,
  enviado,
  isSubmitting,
  onSubmit,
}: Props) {
  if (enviado) {
    return (
      <AlertaAuth tipo="sucesso">
        <strong className="block mb-0.5">Solicitação recebida</strong>
        Se o CPF estiver cadastrado, enviaremos um link de recuperação para o e-mail
        cadastrado. O link vale por 60 minutos.
      </AlertaAuth>
    );
  }

  return (
    <>
      {erro && <AlertaAuth tipo="erro">{erro}</AlertaAuth>}

      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
        Informe o CPF da sua conta. Se ele estiver cadastrado, enviaremos um link para você
        criar uma nova senha.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className={authLabelClass}>CPF</label>
          <input
            required
            type="text"
            inputMode="numeric"
            value={mascararCpf(cpf)}
            onChange={(e) => setCpf(e.target.value.replace(/\D/g, "").slice(0, 11))}
            placeholder="000.000.000-00"
            autoComplete="username"
            className={`${authInputClass} font-mono`}
          />
        </div>

        <button type="submit" disabled={isSubmitting} className={authBotaoClass}>
          {isSubmitting ? "Enviando..." : "Enviar link de recuperação"}
        </button>
      </form>
    </>
  );
}
