"use client";
import { useCallback, useState, type FormEvent } from "react";
import { obterOrdem, atualizarOrdem } from "../services/ordensService";
import { resolverNomeNormalizado } from "../lib/normalizacao";
import { useTecnicoBusca } from "./useTecnicoBusca";
import { useComentarios } from "./useComentarios";
import { AbaModal, Metadado, Ordem } from "../types";

interface Params {
  cargo: string;
  statusList: Metadado[];
  onSaved: () => void;
}

// Orquestra o modal de edição/detalhes de um chamado: carrega os detalhes, mantém os
// campos do formulário e compõe o autocomplete de técnico e a discussão de comentários.
export function useChamadoModal({ cargo, statusList, onSaved }: Params) {
  const [chamadoSelecionado, setChamadoSelecionado] = useState<Ordem | null>(null);
  const [status, setStatus] = useState("");
  const [urgencia, setUrgencia] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [solucao, setSolucao] = useState("");
  const [motivoPausa, setMotivoPausa] = useState("");
  const [editAnexo, setEditAnexo] = useState<File | null>(null);
  const [abaModal, setAbaModal] = useState<AbaModal>("comentarios");

  const tecnico = useTecnicoBusca();

  const recarregarChamado = useCallback(async (id: number | string) => {
    try {
      const res = await obterOrdem(id);
      setChamadoSelecionado(res.data);
    } catch (err) {
      console.error("Erro ao recarregar chamado", err);
    }
  }, []);

  const comentarios = useComentarios(chamadoSelecionado, recarregarChamado);

  const fecharModal = () => setChamadoSelecionado(null);

  const abrirModalEdicao = async (os: Ordem) => {
    setAbaModal("comentarios");
    comentarios.setNovoComentario("");
    try {
      const res = await obterOrdem(os.id);
      const osDetalhes: Ordem = res.data;
      setChamadoSelecionado(osDetalhes);
      setStatus((osDetalhes.status as any)?.nome || osDetalhes.status || "Novo");
      tecnico.iniciar(osDetalhes.tecnico?.nome || "", osDetalhes.tecnico_id || "");
      setUrgencia(resolverNomeNormalizado(osDetalhes.urgencia));
      setPrioridade(resolverNomeNormalizado(osDetalhes.prioridade));
      setSolucao(osDetalhes.solucao || "");
      setMotivoPausa(osDetalhes.motivo_pausa || "");
      setEditAnexo(null);
    } catch (err) {
      console.error("Erro ao carregar detalhes do chamado", err);
      setChamadoSelecionado(os);
      setStatus((os.status as any)?.nome || (os.status as any));
      tecnico.iniciar(os.tecnico?.nome || "", os.tecnico_id || "");
      setUrgencia(resolverNomeNormalizado(os.urgencia));
      setPrioridade(resolverNomeNormalizado(os.prioridade));
      setSolucao(os.solucao || "");
      setMotivoPausa(os.motivo_pausa || "");
      setEditAnexo(null);
    }
  };

  const salvarEdicao = async (e: FormEvent) => {
    e.preventDefault();
    if (!chamadoSelecionado) return;
    try {
      const selectedStatus = statusList.find((s) => s.nome === status);
      const statusId = selectedStatus?.id ?? null;

      if (editAnexo) {
        const formData = new FormData();
        formData.append("_method", "PUT");
        if (statusId) {
          formData.append("status_id", String(statusId));
        } else {
          formData.append("status", status);
        }
        formData.append("solucao", solucao || "");
        if (["Pausado", "Aguardando Peça"].includes(status)) {
          formData.append("motivo_pausa", motivoPausa || "");
        }
        if (cargo === "Admin") {
          formData.append("urgencia", urgencia);
          formData.append("prioridade", prioridade);
          formData.append("tecnico_id", tecnico.tecnicoId ? String(tecnico.tecnicoId) : "");
        }
        formData.append("anexo", editAnexo);

        await atualizarOrdem(chamadoSelecionado.id, formData);
      } else {
        const payload: any = {
          status_id: statusId,
          solucao,
          motivo_pausa: ["Pausado", "Aguardando Peça"].includes(status) ? motivoPausa : null,
        };

        if (!statusId) {
          payload.status = status;
        }

        if (cargo === "Admin") {
          payload.urgencia = urgencia;
          payload.prioridade = prioridade;
          payload.tecnico_id = tecnico.tecnicoId || null;
        }

        await atualizarOrdem(chamadoSelecionado.id, payload);
      }
      setChamadoSelecionado(null);
      setEditAnexo(null);
      onSaved();
      window.dispatchEvent(new Event("notificacoes:atualizar"));
    } catch (err) {
      alert("Erro ao atualizar a ordem de serviço.");
    }
  };

  return {
    chamadoSelecionado,
    setChamadoSelecionado,
    fecharModal,
    status,
    setStatus,
    urgencia,
    setUrgencia,
    prioridade,
    setPrioridade,
    solucao,
    setSolucao,
    motivoPausa,
    setMotivoPausa,
    editAnexo,
    setEditAnexo,
    abaModal,
    setAbaModal,
    tecnico,
    comentarios,
    abrirModalEdicao,
    salvarEdicao,
    recarregarChamado,
  };
}

export type ChamadoModalControle = ReturnType<typeof useChamadoModal>;
