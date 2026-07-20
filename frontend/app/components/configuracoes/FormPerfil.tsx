"use client";
import { type FormEvent } from "react";
import AlertaSucesso from "./AlertaSucesso";
import InputSenha from "../comum/InputSenha";
import {
  formInputClass as inputClass,
  formLabelClass as labelClass,
  formSecaoClass,
  formCardClass,
} from "../../lib/constantes";

interface Props {
  nome: string;
  setNome: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  senhaAtual: string;
  setSenhaAtual: (v: string) => void;
  novaSenha: string;
  setNovaSenha: (v: string) => void;
  sucesso: boolean;
  onSubmit: (e: FormEvent) => void;
}

// Formulário de edição do perfil do usuário logado (nome, e-mail e senha opcional).
export default function FormPerfil({
  nome,
  setNome,
  email,
  setEmail,
  senhaAtual,
  setSenhaAtual,
  novaSenha,
  setNovaSenha,
  sucesso,
  onSubmit,
}: Props) {
  return (
    <div className={formCardClass}>
      {sucesso && <AlertaSucesso mensagem="Perfil atualizado com sucesso!" />}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={labelClass}>Nome Completo</label>
            <input className={inputClass} value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>E-mail</label>
            <input
              className={inputClass}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="border-t border-slate-300 dark:border-slate-800 pt-4">
          <p className={`${formSecaoClass} mb-3`}>Alterar Senha (opcional)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Senha Atual</label>
              <InputSenha
                value={senhaAtual}
                onChange={setSenhaAtual}
                autoComplete="current-password"
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Nova Senha</label>
              <InputSenha value={novaSenha} onChange={setNovaSenha} autoComplete="new-password" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 sm:py-2.5 bg-[#1e3a8a] hover:bg-[#162e6e] text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#1e3a8a]/20"
          >
            Salvar Perfil
          </button>
        </div>
      </form>
    </div>
  );
}
