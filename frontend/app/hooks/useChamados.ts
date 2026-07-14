"use client";
import { useCallback, useEffect, useState } from "react";
import {
  listarOrdens,
  removerOrdem,
  fixarOrdem,
  exportarOrdens,
} from "../services/ordensService";
import { montarCsvChamados, baixarBlob } from "../lib/csv";
import { Filtros, Meta, Ordem } from "../types";

// Gerencia a listagem de chamados: filtros, dados paginados, busca (com debounce) e
// ações que recarregam a lista (excluir, fixar, exportar CSV).
const FILTROS_INICIAIS: Filtros = {
  busca: "",
  status: "",
  categoria: "",
  urgencia: "",
  prioridade: "",
  sla: "",
  sem_tecnico: false,
  page: 1,
  per_page: 15,
};

// `filtrosIniciais` permite abrir a tela já filtrada (drill-down vindo do dashboard).
export function useChamados(filtrosIniciais?: Partial<Filtros>) {
  const [ordens, setOrdens] = useState<Ordem[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [filtros, setFiltros] = useState<Filtros>({
    ...FILTROS_INICIAIS,
    ...filtrosIniciais,
  });

  const buscarChamados = useCallback(async () => {
    setCarregando(true);
    try {
      // Lê cargo/id do sessionStorage no momento do request para não enviar vazio.
      const currentCargo = sessionStorage.getItem("usuarioCargo") || "";
      const currentUserId = sessionStorage.getItem("usuarioId") || "";

      const params: any = { page: filtros.page, per_page: filtros.per_page };
      if (filtros.busca) {
        if (/^\d+$/.test(filtros.busca.trim())) {
          params.id = filtros.busca.trim();
        } else {
          params.busca = filtros.busca;
        }
      }
      if (filtros.status) params.status = filtros.status;
      if (filtros.categoria) params.categoria = filtros.categoria;
      if (filtros.urgencia) params.urgencia = filtros.urgencia;
      if (filtros.prioridade) params.prioridade = filtros.prioridade;
      if (filtros.sla) params.sla = filtros.sla;
      if (filtros.sem_tecnico) params.sem_tecnico = 1;

      // Técnico só vê os próprios chamados (filtro aplicado pelo back).
      if (currentCargo === "Tecnico" && currentUserId) {
        params.tecnico_id = currentUserId;
      }

      const resOrdens = await listarOrdens(params);
      const resData = resOrdens.data;
      const listaOrdens = Array.isArray(resData) ? resData : resData?.data || [];
      setOrdens(listaOrdens);

      if (!Array.isArray(resData) && resData?.last_page) {
        setMeta({
          current_page: resData.current_page,
          last_page: resData.last_page,
          per_page: resData.per_page,
          total: resData.total,
        });
      }
    } catch (err) {
      console.error("Erro ao carregar dados", err);
    } finally {
      setCarregando(false);
    }
  }, [filtros]);

  // Refaz a busca sempre que um filtro mudar, com leve atraso para a digitação.
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      buscarChamados();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [filtros, buscarChamados]);

  const deletarChamado = async (id: number) => {
    if (confirm("Deseja excluir este chamado permanentemente?")) {
      try {
        await removerOrdem(id);
        buscarChamados();
      } catch (err) {
        alert("Erro ao excluir.");
      }
    }
  };

  const fixarChamado = async (id: number) => {
    if (!confirm("Deseja alterar a fixação desta ordem de serviço?")) return;
    try {
      const res = await fixarOrdem(id);
      alert(res.data.message);
      await buscarChamados();
    } catch (err) {
      alert("Erro ao alterar fixação da ordem de serviço.");
    }
  };

  const exportarCSV = async () => {
    try {
      const params = new URLSearchParams();
      if (filtros.busca) params.append("busca", filtros.busca);
      if (filtros.status) params.append("status", filtros.status);
      if (filtros.categoria) params.append("categoria", filtros.categoria);
      if (filtros.urgencia) params.append("urgencia", filtros.urgencia);
      if (filtros.prioridade) params.append("prioridade", filtros.prioridade);
      if (filtros.sla) params.append("sla", filtros.sla);
      if (filtros.sem_tecnico) params.append("sem_tecnico", "1");
      params.append("per_page", "1000");

      const res = await exportarOrdens(params);
      const dadosExportar = res.data.data || res.data || [];

      if (dadosExportar.length === 0) {
        alert("Nenhum chamado encontrado para exportar.");
        return;
      }

      const conteudoCSV = montarCsvChamados(dadosExportar);
      const blob = new Blob([conteudoCSV], { type: "text/csv;charset=utf-8;" });
      baixarBlob(blob, `exportacao_chamados_${new Date().toISOString().slice(0, 10)}.csv`);
    } catch (err) {
      console.error("Erro ao exportar dados", err);
      alert("Erro ao exportar dados.");
    }
  };

  return {
    ordens,
    meta,
    carregando,
    filtros,
    setFiltros,
    buscarChamados,
    deletarChamado,
    fixarChamado,
    exportarCSV,
  };
}
