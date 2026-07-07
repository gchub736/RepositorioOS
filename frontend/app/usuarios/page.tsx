"use client";
import { useUsuarios } from "../hooks";
import { UsuariosHeader, UsuariosFiltros, UsuariosTabela } from "../components/usuarios";
import PaginacaoBar from "../components/PaginacaoBar";

// Orquestrador da tela de usuários: conecta o hook de dados/estado (useUsuarios) aos
// componentes de apresentação. Mesma arquitetura em camadas da tela de chamados.
export default function UsuariosPage() {
  const {
    usuarios,
    carregando,
    meuId,
    paginaAtual,
    setPaginaAtual,
    totalPaginas,
    totalUsuarios,
    filtroId,
    setFiltroId,
    filtroBusca,
    setFiltroBusca,
    itensPorPagina,
    setItensPorPagina,
    buscar,
    alterarCargo,
    excluirUsuario,
  } = useUsuarios();

  return (
    <div className="p-6 pb-0 max-w-full overflow-hidden h-full flex flex-col">
      <UsuariosHeader filtroBusca={filtroBusca} setFiltroBusca={setFiltroBusca} onBuscar={buscar} />

      <UsuariosFiltros
        filtroId={filtroId}
        setFiltroId={setFiltroId}
        onBuscar={buscar}
        itensPorPagina={itensPorPagina}
        setItensPorPagina={setItensPorPagina}
        setPaginaAtual={setPaginaAtual}
      />

      <UsuariosTabela
        usuarios={usuarios}
        carregando={carregando}
        meuId={meuId}
        alterarCargo={alterarCargo}
        excluirUsuario={excluirUsuario}
      />

      <PaginacaoBar
        page={paginaAtual}
        lastPage={totalPaginas}
        total={totalUsuarios}
        labelSingular="Usuário"
        labelPlural="Usuários"
        onPageChange={setPaginaAtual}
      />
    </div>
  );
}
