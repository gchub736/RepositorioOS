"use client";
import { type FormEvent } from "react";
import { Metadado } from "../../types";

const LIMITE_TITULO = 100;
const LIMITE_DESCRICAO = 200;
const LIMITE_LOCALIZACAO = 120;

const inputClass =
  "w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-400/55 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500";
// Campos de linha única com altura fixa idêntica (select e input renderizam alturas
// levemente diferentes por padrão do navegador; h-[46px] iguala os dois).
const controlClass = `${inputClass} h-[46px]`;
const labelClass = "text-[10px] font-bold text-slate-800 dark:text-white uppercase tracking-widest";

// Asterisco vermelho para campos obrigatórios.
const Obrigatorio = () => <span className="text-red-500">*</span>;

// Contador de caracteres (verde → amarelo → vermelho conforme se aproxima do limite).
function Contador({ atual, limite }: { atual: number; limite: number }) {
  return (
    <span
      className={`text-[10px] font-bold ${
        atual >= limite ? "text-red-500" : atual >= limite * 0.8 ? "text-yellow-500" : "text-slate-400"
      }`}
    >
      {atual}/{limite}
    </span>
  );
}

interface Props {
  titulo: string;
  setTitulo: (v: string) => void;
  descricao: string;
  setDescricao: (v: string) => void;
  categoria: string;
  setCategoria: (v: string) => void;
  localizacao: string;
  setLocalizacao: (v: string) => void;
  anexo: File | null;
  setAnexo: (f: File | null) => void;
  categorias: Metadado[];
  isSubmitting: boolean;
  onSubmit: (e: FormEvent) => void;
  onCancelar: () => void;
}

// Formulário de abertura de chamado. Preenche a altura disponível (a descrição cresce)
// para caber sem rolagem, seguindo o padrão visual das telas de listagem.
export default function NovoChamadoForm({
  titulo,
  setTitulo,
  descricao,
  setDescricao,
  categoria,
  setCategoria,
  localizacao,
  setLocalizacao,
  anexo,
  setAnexo,
  categorias,
  isSubmitting,
  onSubmit,
  onCancelar,
}: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-300 dark:border-slate-800 p-5 md:p-6 flex-1 min-h-0 flex flex-col">
      <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className={labelClass}>Categoria <Obrigatorio /></label>
            </div>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className={controlClass} required>
              {categorias.map((c) => (
                <option key={c.id} value={c.nome}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className={labelClass}>Localização</label>
              <Contador atual={localizacao.length} limite={LIMITE_LOCALIZACAO} />
            </div>
            <input
              className={controlClass}
              placeholder="Ex: Sala 101, Prédio A"
              value={localizacao}
              maxLength={LIMITE_LOCALIZACAO}
              onChange={(e) => setLocalizacao(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between items-center">
            <label className={labelClass}>Título <Obrigatorio /></label>
            <Contador atual={titulo.length} limite={LIMITE_TITULO} />
          </div>
          <input
            className={controlClass}
            placeholder="Assunto da requisição"
            value={titulo}
            maxLength={LIMITE_TITULO}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5 mb-4 flex-1 min-h-0 flex flex-col">
          <div className="flex justify-between items-center">
            <label className={labelClass}>Descrição <Obrigatorio /></label>
            <Contador atual={descricao.length} limite={LIMITE_DESCRICAO} />
          </div>
          <textarea
            className={`${inputClass} flex-1 min-h-[100px] resize-none`}
            placeholder="Descreva detalhadamente o problema..."
            value={descricao}
            maxLength={LIMITE_DESCRICAO}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5 mb-4">
          <label className={labelClass}>Anexo (Opcional)</label>
          <label className={`${controlClass} flex items-center cursor-pointer`}>
            <input
              type="file"
              className="hidden"
              onChange={(e) => setAnexo(e.target.files?.[0] || null)}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <span
              className={`truncate ${anexo ? "text-slate-800 dark:text-slate-100" : "text-slate-400 dark:text-slate-500"}`}
            >
              {anexo ? anexo.name : "Sem anexo"}
            </span>
          </label>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Formatos aceitos: PDF, JPG, PNG (Max: 5MB)</p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-300 dark:border-slate-800">
          <button
            type="button"
            onClick={onCancelar}
            className="px-6 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-lg text-xs uppercase tracking-wider transition-all shadow-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-2.5 bg-[#1e3a8a] hover:bg-[#162e6e] text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#1e3a8a]/20 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Enviando..." : "Abrir Chamado"}
          </button>
        </div>
      </form>
    </div>
  );
}
