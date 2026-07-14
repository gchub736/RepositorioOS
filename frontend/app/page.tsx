"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import {
  usePerfil,
  useMetadados,
  useChamados,
  useChamadoModal,
  useNavegacaoTeclado,
} from "./hooks";
import {
  ChamadosHeader,
  ChamadosFiltros,
  ChamadosTabela,
  ChamadosTabelaUsuario,
} from "./components/chamados";
import { ModalChamado } from "./components/modal";
import PaginacaoBar from "./components/PaginacaoBar";
import AnexoPreviewModal from "./components/AnexoPreviewModal";
import ModoNavegacaoBanner from "./components/ModoNavegacaoBanner";
import { AnexoPreview, Ordem } from "./types";

// Orquestrador da tela de listagem de chamados: conecta os hooks de dados/estado aos
// componentes de apresentação. Toda a lógica vive nos hooks (hooks/), serviços
// (services/) e utilitários puros (lib/).
export default function ListaChamados() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { cargo, meuUsuarioId } = usePerfil();
  const { categorias, statusList, urgenciasList } = useMetadados();

  // Drill-down vindo do dashboard: abre a listagem já filtrada (ex.: /?sla=vencido).
  // Lido só na montagem — depois o usuário controla os filtros pela própria tela.
  const filtrosIniciais = useMemo(
    () => ({
      ...(searchParams.get("sla") ? { sla: searchParams.get("sla") as string } : {}),
      ...(searchParams.get("sem_tecnico") === "1" ? { sem_tecnico: true } : {}),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const {
    ordens,
    meta,
    carregando,
    filtros,
    setFiltros,
    buscarChamados,
    deletarChamado,
    fixarChamado,
    exportarCSV,
  } = useChamados(filtrosIniciais);

  const modal = useChamadoModal({ cargo, statusList, onSaved: buscarChamados });

  // Estado de orquestração compartilhado entre tabela e modais.
  const [anexoPreview, setAnexoPreview] = useState<AnexoPreview | null>(null);

  const { navMode, navIndex } = useNavegacaoTeclado({
    ordens,
    bloqueado: !!modal.chamadoSelecionado || !!anexoPreview,
    onAbrir: (os) => modal.abrirModalEdicao(os),
    onEscape: () => {
      modal.fecharModal();
      setAnexoPreview(null);
    },
  });

  // Detecta o query param ?abrirChamado=ID vindo das notificações.
  useEffect(() => {
    const chamadoId = searchParams.get("abrirChamado");
    if (chamadoId) {
      router.replace("/", { scroll: false });
      modal.abrirModalEdicao({ id: Number(chamadoId) } as Ordem);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <>
      <div className="p-6 pb-0 max-w-full overflow-hidden h-full flex flex-col">
        <ChamadosHeader
          busca={filtros.busca}
          onBuscaChange={(valor) => setFiltros({ ...filtros, busca: valor, page: 1 })}
          onExportarCSV={exportarCSV}
          onAdicionar={() => router.push("/novo")}
        />

        <ChamadosFiltros
          cargo={cargo}
          filtros={filtros}
          setFiltros={setFiltros}
          statusList={statusList}
          categorias={categorias}
          urgenciasList={urgenciasList}
        />

        {cargo === "Usuario" ? (
          <ChamadosTabelaUsuario
            ordens={ordens}
            carregando={carregando}
            onAbrir={modal.abrirModalEdicao}
            onPreviewAnexo={setAnexoPreview}
          />
        ) : (
          <ChamadosTabela
            ordens={ordens}
            carregando={carregando}
            cargo={cargo}
            navMode={navMode}
            navIndex={navIndex}
            onAbrir={modal.abrirModalEdicao}
            onPreviewAnexo={setAnexoPreview}
            onFixar={fixarChamado}
            onDeletar={deletarChamado}
          />
        )}

        <PaginacaoBar
          page={filtros.page}
          lastPage={meta?.last_page ?? 0}
          total={meta?.total ?? 0}
          labelSingular="Chamado"
          labelPlural="Chamados"
          onPageChange={(page) => setFiltros({ ...filtros, page })}
        />

        <ModalChamado
          modal={modal}
          cargo={cargo}
          urgenciasList={urgenciasList}
          statusList={statusList}
          meuUsuarioId={meuUsuarioId}
          onPreviewAnexo={setAnexoPreview}
        />
      </div>

      {anexoPreview && (
        <AnexoPreviewModal anexoPreview={anexoPreview} onClose={() => setAnexoPreview(null)} />
      )}

      {navMode && !modal.chamadoSelecionado && !anexoPreview && <ModoNavegacaoBanner />}
    </>
  );
}
