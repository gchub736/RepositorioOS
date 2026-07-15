"use client";
import { type FormEvent } from "react";
import AlertaSucesso from "./AlertaSucesso";
import {
  formInputClass as inputClass,
  formLabelClass as labelClass,
  formSecaoClass,
  formCardClass,
} from "../../lib/constantes";

interface Props {
  nomeSistema: string;
  setNomeSistema: (v: string) => void;
  slaMuito: string;
  setSlaMuito: (v: string) => void;
  slaAlta: string;
  setSlaAlta: (v: string) => void;
  slaMedia: string;
  setSlaMedia: (v: string) => void;
  slaBaixa: string;
  setSlaBaixa: (v: string) => void;
  sucesso: boolean;
  onSubmit: (e: FormEvent) => void;
}

// Formulário das configurações gerais do sistema (nome e SLA por urgência) — só Admin.
export default function FormSistema({
  nomeSistema,
  setNomeSistema,
  slaMuito,
  setSlaMuito,
  slaAlta,
  setSlaAlta,
  slaMedia,
  setSlaMedia,
  slaBaixa,
  setSlaBaixa,
  sucesso,
  onSubmit,
}: Props) {
  return (
    <div className={formCardClass}>
      {sucesso && <AlertaSucesso mensagem="Configurações salvas!" />}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className={labelClass}>Nome do Sistema</label>
          <input
            className={inputClass}
            value={nomeSistema}
            onChange={(e) => setNomeSistema(e.target.value)}
            required
          />
        </div>

        <div className="border-t border-slate-300 dark:border-slate-800 pt-4">
          <p className={`${formSecaoClass} mb-3`}>SLA por Urgência (horas)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>🔴 Muito Alta</label>
              <input className={inputClass} type="number" min="1" value={slaMuito} onChange={(e) => setSlaMuito(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>🟠 Alta</label>
              <input className={inputClass} type="number" min="1" value={slaAlta} onChange={(e) => setSlaAlta(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>🟡 Media</label>
              <input className={inputClass} type="number" min="1" value={slaMedia} onChange={(e) => setSlaMedia(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>🔵 Baixa</label>
              <input className={inputClass} type="number" min="1" value={slaBaixa} onChange={(e) => setSlaBaixa(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 sm:py-2.5 bg-[#1e3a8a] hover:bg-[#162e6e] text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#1e3a8a]/20"
          >
            Salvar Configurações
          </button>
        </div>
      </form>
    </div>
  );
}
