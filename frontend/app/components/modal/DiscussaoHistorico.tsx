"use client";
import PainelSla from "./PainelSla";
import ListaComentarios from "./ListaComentarios";
import FormComentario from "./FormComentario";
import Historico from "./Historico";
import { ComentariosControle } from "../../hooks/useComentarios";
import { AbaModal, Ordem } from "../../types";

interface Props {
  chamado: Ordem;
  abaModal: AbaModal;
  setAbaModal: (aba: AbaModal) => void;
  comentarios: ComentariosControle;
  meuUsuarioId: string;
}

// Coluna direita do modal para Admin/Técnico: painel de SLA + abas Discussão/Histórico.
export default function DiscussaoHistorico({
  chamado,
  abaModal,
  setAbaModal,
  comentarios,
  meuUsuarioId,
}: Props) {
  return (
    <div className="flex flex-col flex-1 justify-between h-full">
      <div>
        <PainelSla os={chamado} />

        {/* Abas Switcher */}
        <div className="flex border-b border-slate-300 dark:border-slate-800 mb-4 gap-4">
          <button
            type="button"
            onClick={() => setAbaModal("comentarios")}
            className={`pb-2 text-xs font-black uppercase tracking-wider transition-colors relative ${
              abaModal === "comentarios"
                ? "text-blue-600 dark:text-blue-400"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            Discussão ({chamado.comentarios?.length || 0})
            {abaModal === "comentarios" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setAbaModal("historico")}
            className={`pb-2 text-xs font-black uppercase tracking-wider transition-colors relative ${
              abaModal === "historico"
                ? "text-blue-600 dark:text-blue-400"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            Histórico ({chamado.historicos?.length || 0})
            {abaModal === "historico" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {abaModal === "comentarios" && (
        <div className="flex flex-col flex-1 min-h-[240px] max-h-[340px]">
          <ListaComentarios
            lista={chamado.comentarios}
            meuUsuarioId={meuUsuarioId}
            controle={comentarios}
          />
          <FormComentario controle={comentarios} />
        </div>
      )}

      {abaModal === "historico" && <Historico historicos={chamado.historicos} />}
    </div>
  );
}
