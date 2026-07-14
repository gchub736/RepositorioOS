"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  criarComentario,
  editarComentario,
  removerComentario,
} from "../services/ordensService";
import { Comentario, Ordem } from "../types";

// Gerencia a discussão (comentários) de um chamado: envio, resposta, edição e exclusão.
// Recebe o chamado atual e a função de recarga para refletir as mudanças do back.
export function useComentarios(
  chamado: Ordem | null,
  recarregar: (id: number | string) => Promise<void>
) {
  const [novoComentario, setNovoComentario] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [comentarioEditandoId, setComentarioEditandoId] = useState<number | null>(null);
  const [comentarioEditandoConteudo, setComentarioEditandoConteudo] = useState("");
  const [comentarioRespondendo, setComentarioRespondendo] = useState<Comentario | null>(null);
  // Comentário aguardando confirmação de exclusão (abre o diálogo de opções).
  const [comentarioExcluindo, setComentarioExcluindo] = useState<Comentario | null>(null);
  const inputComentarioRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (comentarioRespondendo) {
      // Pequeno timeout para garantir que o render ocorreu antes de focar.
      setTimeout(() => {
        inputComentarioRef.current?.focus();
      }, 50);
    }
  }, [comentarioRespondendo]);

  const enviarComentario = async (e: FormEvent) => {
    e.preventDefault();
    if (!novoComentario.trim() || enviandoComentario || !chamado) return;

    setEnviandoComentario(true);
    try {
      await criarComentario(
        chamado.id,
        novoComentario,
        comentarioRespondendo ? comentarioRespondendo.id : null
      );
      setNovoComentario("");
      setComentarioRespondendo(null);
      await recarregar(chamado.id);
      window.dispatchEvent(new Event("notificacoes:atualizar"));
    } catch (err) {
      alert("Erro ao enviar comentário.");
    } finally {
      setEnviandoComentario(false);
    }
  };

  const salvarEdicaoComentario = async (id: number) => {
    if (!chamado) return;
    try {
      await editarComentario(chamado.id, id, comentarioEditandoConteudo);
      setComentarioEditandoId(null);
      await recarregar(chamado.id);
    } catch (err) {
      alert("Erro ao editar comentário.");
    }
  };

  // A confirmação agora é feita por um diálogo próprio (Excluir para mim / para todos /
  // cancelar), então aqui a exclusão é executada direto.
  const deletarComentario = async (id: number, tipo: "mim" | "todos") => {
    if (!chamado) return;
    try {
      await removerComentario(chamado.id, id, tipo);
      setComentarioExcluindo(null);
      await recarregar(chamado.id);
    } catch (err) {
      alert("Erro ao excluir comentário.");
    }
  };

  const pedirExclusao = (c: Comentario) => setComentarioExcluindo(c);
  const cancelarExclusao = () => setComentarioExcluindo(null);

  const iniciarEdicao = (c: Comentario) => {
    setComentarioEditandoId(c.id);
    setComentarioEditandoConteudo(c.conteudo);
  };

  return {
    novoComentario,
    setNovoComentario,
    enviandoComentario,
    comentarioEditandoId,
    setComentarioEditandoId,
    comentarioEditandoConteudo,
    setComentarioEditandoConteudo,
    comentarioRespondendo,
    setComentarioRespondendo,
    comentarioExcluindo,
    pedirExclusao,
    cancelarExclusao,
    inputComentarioRef,
    enviarComentario,
    salvarEdicaoComentario,
    deletarComentario,
    iniciarEdicao,
  };
}

export type ComentariosControle = ReturnType<typeof useComentarios>;
