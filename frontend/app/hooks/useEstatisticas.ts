"use client";
import { useCallback, useEffect, useState } from "react";
import { obterEstatisticas } from "../services/estatisticasService";
import { Estatisticas, PeriodoEstatisticas } from "../types";

// Carrega as métricas do painel. Expõe os dados, o período selecionado, o estado de
// carregamento, o erro e a hora da última atualização (com recarga manual).
export function useEstatisticas() {
  const [dados, setDados] = useState<Estatisticas | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [periodo, setPeriodo] = useState<PeriodoEstatisticas>(0);
  const [atualizadoEm, setAtualizadoEm] = useState<Date | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const res = await obterEstatisticas(periodo);
      setDados(res.data.data);
      setAtualizadoEm(new Date());
    } catch (err: any) {
      if (err.response && err.response.status === 403) {
        setErro("Acesso negado. Apenas administradores podem ver as estatísticas.");
      } else {
        setErro("Erro ao carregar os dados do painel.");
      }
      console.error(err);
    } finally {
      setCarregando(false);
    }
  }, [periodo]);

  // Recarrega ao montar e sempre que o período mudar.
  useEffect(() => {
    carregar();
  }, [carregar]);

  return { dados, erro, carregando, periodo, setPeriodo, atualizadoEm, recarregar: carregar };
}
