"use client";
import DetalhesChamadoUsuario from "./DetalhesChamadoUsuario";
import FormEdicaoChamado from "./FormEdicaoChamado";
import DiscussaoHistorico from "./DiscussaoHistorico";
import ListaComentarios from "./ListaComentarios";
import FormComentario from "./FormComentario";
import { ChamadoModalControle } from "../../hooks/useChamadoModal";
import { AnexoPreview, Metadado } from "../../types";

interface Props {
  modal: ChamadoModalControle;
  cargo: string;
  urgenciasList: Metadado[];
  statusList: Metadado[];
  meuUsuarioId: string;
  onPreviewAnexo: (preview: AnexoPreview) => void;
}

// Modal de edição/detalhes do chamado. Escolhe as variantes de coluna conforme o cargo.
export default function ModalChamado({
  modal,
  cargo,
  urgenciasList,
  statusList,
  meuUsuarioId,
  onPreviewAnexo,
}: Props) {
  const chamado = modal.chamadoSelecionado;
  if (!chamado) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-start md:items-center justify-center z-50 p-3 sm:p-4 md:p-6 overflow-y-auto"
      onClick={modal.fecharModal}
    >
      <div className="relative w-full max-w-4xl my-auto">
        <div
          className="bg-white dark:bg-slate-900 rounded-2xl border-b border-slate-300 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[95vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="overflow-y-auto max-h-[95vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="bg-[#1e3a8a] mb-6 p-5 md:p-6">
              <h3 className="text-xl font-black mb-1 text-white">
                {cargo === "Usuario"
                  ? "Acompanhamento do Chamado"
                  : `Detalhes e Edição do Chamado #${chamado.id}`}
              </h3>
              <p className="text-xs text-blue-200 uppercase tracking-widest font-bold">
                {chamado.titulo}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-5 md:px-6 pb-5 md:pb-6">
              {cargo === "Usuario" ? (
                <DetalhesChamadoUsuario
                  chamado={chamado}
                  onPreviewAnexo={onPreviewAnexo}
                  onFechar={modal.fecharModal}
                />
              ) : (
                <FormEdicaoChamado
                  cargo={cargo}
                  chamado={chamado}
                  tecnico={modal.tecnico}
                  urgencia={modal.urgencia}
                  setUrgencia={modal.setUrgencia}
                  urgenciasList={urgenciasList}
                  status={modal.status}
                  setStatus={modal.setStatus}
                  statusList={statusList}
                  motivoPausa={modal.motivoPausa}
                  setMotivoPausa={modal.setMotivoPausa}
                  solucao={modal.solucao}
                  setSolucao={modal.setSolucao}
                  onSubmit={modal.salvarEdicao}
                  onCancelar={modal.fecharModal}
                  onPreviewAnexo={onPreviewAnexo}
                />
              )}

              {/* Coluna da Direita: Histórico e Discussão */}
              <div className="border-t md:border-t-0 md:border-l border-slate-300 dark:border-slate-800 md:pl-8 pt-6 md:pt-0 flex flex-col justify-between h-full">
                {cargo === "Usuario" ? (
                  <div className="flex flex-col flex-1 min-h-[240px] max-h-[340px]">
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                      Mensagens e Discussão
                    </h4>
                    <ListaComentarios
                      lista={chamado.comentarios}
                      meuUsuarioId={meuUsuarioId}
                      controle={modal.comentarios}
                    />
                    <FormComentario controle={modal.comentarios} />
                  </div>
                ) : (
                  <DiscussaoHistorico
                    chamado={chamado}
                    abaModal={modal.abaModal}
                    setAbaModal={modal.setAbaModal}
                    comentarios={modal.comentarios}
                    meuUsuarioId={meuUsuarioId}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute -top-1 left-0 right-0 h-5 bg-[#1e3a8a] rounded-t-2xl pointer-events-none"
          aria-hidden="true"
        ></div>
      </div>
    </div>
  );
}
