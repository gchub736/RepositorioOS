"use client";
import Link from "next/link";
import { type FormEvent } from "react";
import InputSenha from "../InputSenha";
import AlertaAuth from "./AlertaAuth";
import { authInputClass, authLabelClass, authBotaoClass } from "../../lib/constantes";
import { mascararCpf } from "../../lib/formatters";

interface Props {
  isCadastro: boolean;
  nome: string;
  setNome: (v: string) => void;
  cpf: string;
  setCpf: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  senha: string;
  setSenha: (v: string) => void;
  erro: string;
  sucesso: string;
  isSubmitting: boolean;
  tempoBloqueio: number;
  onSubmit: (e: FormEvent) => void;
}

// Formulário de entrada: serve tanto para login quanto para cadastro (os campos
// extras aparecem só no modo cadastro).
export default function LoginForm({
  isCadastro,
  nome,
  setNome,
  cpf,
  setCpf,
  email,
  setEmail,
  senha,
  setSenha,
  erro,
  sucesso,
  isSubmitting,
  tempoBloqueio,
  onSubmit,
}: Props) {
  const bloqueado = tempoBloqueio > 0;

  return (
    <>
      {bloqueado && (
        <AlertaAuth tipo="bloqueio">
          <strong className="block mb-0.5">Muitas tentativas incorretas</strong>
          Tente novamente em <span className="font-black">{tempoBloqueio}s</span>.
        </AlertaAuth>
      )}

      {sucesso && !bloqueado && <AlertaAuth tipo="sucesso">{sucesso}</AlertaAuth>}
      {erro && !bloqueado && <AlertaAuth tipo="erro">{erro}</AlertaAuth>}

      <form onSubmit={onSubmit} className="space-y-4">
        {isCadastro && (
          <>
            <div className="space-y-1.5">
              <label className={authLabelClass}>Nome Completo</label>
              <input
                required
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite seu nome"
                autoComplete="name"
                className={authInputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className={authLabelClass}>E-mail</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                autoComplete="email"
                className={authInputClass}
              />
            </div>
          </>
        )}

        <div className="space-y-1.5">
          <label className={authLabelClass}>CPF</label>
          <input
            required
            type="text"
            inputMode="numeric"
            // Guarda só os dígitos no estado, mas exibe com máscara enquanto digita.
            value={mascararCpf(cpf)}
            onChange={(e) => setCpf(e.target.value.replace(/\D/g, "").slice(0, 11))}
            placeholder="000.000.000-00"
            autoComplete="username"
            className={`${authInputClass} font-mono`}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className={authLabelClass}>Senha</label>
            {!isCadastro && (
              <Link
                href="/login/esqueci-senha"
                className="text-[10px] font-bold text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 uppercase tracking-wider transition-colors"
              >
                Esqueci minha senha
              </Link>
            )}
          </div>
          <InputSenha
            value={senha}
            onChange={setSenha}
            required
            autoComplete={isCadastro ? "new-password" : "current-password"}
          />
        </div>

        <button type="submit" disabled={isSubmitting || bloqueado} className={authBotaoClass}>
          {bloqueado
            ? `Aguarde ${tempoBloqueio}s...`
            : isSubmitting
            ? "Aguarde..."
            : isCadastro
            ? "Cadastrar"
            : "Entrar no Sistema"}
        </button>
      </form>
    </>
  );
}
