"use client";
import { useEffect, useState } from "react";
import { listarUsuarios, atualizarCargo, removerUsuario } from "../services/usuariosService";
import { Usuario } from "../types";

// Gerencia a listagem de usuários: filtros, paginação, e as ações de alterar cargo e
// excluir. A filtragem/paginação é feita pelo back-end; o hook só orquestra o estado.
export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [filtroId, setFiltroId] = useState("");
  const [filtroBusca, setFiltroBusca] = useState("");
  const [itensPorPagina, setItensPorPagina] = useState(15);
  const [carregando, setCarregando] = useState(true);

  const meuId = typeof window !== "undefined" ? sessionStorage.getItem("usuarioId") : null;

  const buscarUsuarios = () => {
    setCarregando(true);
    const params: Record<string, any> = { page: paginaAtual, per_page: itensPorPagina };
    if (filtroId) params.id = filtroId;
    if (filtroBusca) params.busca = filtroBusca;

    listarUsuarios(params)
      .then((res) => {
        setUsuarios(res.data.data || []);
        setTotalPaginas(res.data.last_page || 1);
        setTotalUsuarios(res.data.total || 0);
      })
      .catch((err) => console.error("Erro ao carregar dados:", err))
      .finally(() => setCarregando(false));
  };

  // Recarrega sempre que a página ou a quantidade por página mudar.
  useEffect(() => {
    buscarUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginaAtual, itensPorPagina]);

  const buscar = () => {
    setPaginaAtual(1);
    buscarUsuarios();
  };

  const alterarCargo = async (userId: number, novoCargo: string) => {
    if (!confirm(`Tem certeza de que deseja alterar o cargo deste usuário para "${novoCargo}"?`)) {
      buscarUsuarios();
      return;
    }
    try {
      const res = await atualizarCargo(userId, novoCargo);
      const usuarioAtualizado = res.data;
      setUsuarios((prev) => prev.map((u) => (u.id === userId ? usuarioAtualizado : u)));
    } catch (err) {
      alert("Erro ao atualizar cargo.");
      buscarUsuarios();
    }
  };

  const excluirUsuario = async (userId: number, userName: string) => {
    if (String(userId) === String(meuId)) {
      alert("Você não pode excluir sua própria conta!");
      return;
    }
    if (!confirm(`Deseja excluir o usuário "${userName}" permanentemente?`)) return;
    try {
      await removerUsuario(userId);
      buscarUsuarios(); // Recarrega a lista para atualizar a paginação corretamente
    } catch (err) {
      alert("Erro ao excluir usuário.");
    }
  };

  return {
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
  };
}
