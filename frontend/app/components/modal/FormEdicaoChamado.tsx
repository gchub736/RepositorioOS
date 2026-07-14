"use client";
import { type FormEvent } from "react";
import TecnicoAutocomplete from "./TecnicoAutocomplete";
import { selectClass, modalLabelClass } from "../../lib/constantes";
import { TecnicoBusca } from "../../hooks/useTecnicoBusca";
import { AnexoPreview, Metadado, Ordem } from "../../types";

interface Props {
  cargo: string;
  chamado: Ordem;
  tecnico: TecnicoBusca;
  urgencia: string;
  setUrgencia: (v: string) => void;
  urgenciasList: Metadado[];
  status: string;
  setStatus: (v: string) => void;
  statusList: Metadado[];
  motivoPausa: string;
  setMotivoPausa: (v: string) => void;
  solucao: string;
  setSolucao: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  onCancelar: () => void;
  onPreviewAnexo: (preview: AnexoPreview) => void;
}

// Coluna esquerda do modal com o formulário de edição (Admin/Técnico).
export default function FormEdicaoChamado({
  cargo,
  chamado,
  tecnico,
  urgencia,
  setUrgencia,
  urgenciasList,
  status,
  setStatus,
  statusList,
  motivoPausa,
  setMotivoPausa,
  solucao,
  setSolucao,
  onSubmit,
  onCancelar,
  onPreviewAnexo,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {cargo === "Admin" && (
        <>
          <TecnicoAutocomplete tecnico={tecnico} />
          <div>
            <label className={modalLabelClass}>Urgência</label>
            <select
              value={urgencia}
              onChange={(e) => setUrgencia(e.target.value)}
              className={selectClass}
            >
              {urgenciasList.map((u) => (
                <option key={u.id} value={u.nome}>
                  {u.nome}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
      <div>
        <label className={modalLabelClass}>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={cargo === "Usuario"}
          className={selectClass}
        >
          {statusList.map((s) => {
            if (s.nome === "Novo" && cargo !== "Admin") return null;
            return (
              <option key={s.id} value={s.nome}>
                {s.nome}
              </option>
            );
          })}
        </select>
      </div>

      {["Pausado", "Aguardando Peça"].includes(status) && (
        <div className="mt-2">
          <label className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase">
            Motivo da Pausa / Pendência
          </label>
          <textarea
            value={motivoPausa}
            onChange={(e) => setMotivoPausa(e.target.value)}
            disabled={cargo === "Usuario"}
            maxLength={150}
            placeholder="Descreva o motivo (máx 150 caracteres)..."
            className={`${selectClass} h-20 resize-none border-indigo-200 dark:border-indigo-900/50 focus:ring-indigo-500`}
            required
          />
          <div className="text-[10px] text-right text-slate-400 mt-1">{motivoPausa.length}/150</div>
        </div>
      )}

      <div>
        <label className={modalLabelClass}>Solução</label>
        <textarea
          value={solucao}
          onChange={(e) => setSolucao(e.target.value)}
          disabled={cargo === "Usuario"}
          placeholder="O que foi feito para resolver este chamado?"
          className={`${selectClass} h-16 resize-none text-sm`}
        />
      </div>
      <div>
        <label className={modalLabelClass}>Anexo</label>
        {chamado.anexo_url ? (
          <div className="text-[12px] mt-1.5">
            <button
              type="button"
              onClick={() => onPreviewAnexo({ url: chamado.anexo_url as string, osId: chamado.id })}
              className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors font-semibold"
            >
              Visualizar anexo atual
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-1.5">Sem anexo</p>
        )}
      </div>
      <div className="flex justify-end gap-3 mt-4">
        {cargo === "Usuario" ? (
          <button
            type="button"
            onClick={onCancelar}
            className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-sm"
          >
            FECHAR
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onCancelar}
              className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-sm"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-900/20 text-xs tracking-wider uppercase transition-all"
            >
              SALVAR
            </button>
          </>
        )}
      </div>
    </form>
  );
}
