"use client";
import { useEffect, useState } from "react";
import { carregarMetadados } from "../services/metadadosService";
import {
  CATEGORIAS_DEFAULT,
  STATUS_DEFAULT,
  URGENCIAS_DEFAULT,
  PRIORIDADES_DEFAULT,
} from "../lib/constantes";
import { normalizarLista } from "../lib/normalizacao";
import { Metadado } from "../types";

// Carrega e expõe os metadados auxiliares (categorias/status/urgências/prioridades),
// usando cache em sessionStorage. Aplica os fallbacks default e a normalização de "Média".
export function useMetadados() {
  const [listaCategorias, setListaCategorias] = useState<Metadado[]>([]);
  const [listaStatus, setListaStatus] = useState<Metadado[]>([]);
  const [listaUrgencias, setListaUrgencias] = useState<Metadado[]>([]);
  const [listaPrioridades, setListaPrioridades] = useState<Metadado[]>([]);

  useEffect(() => {
    const getCachedData = (key: string) => {
      try {
        const val = sessionStorage.getItem(key);
        return val ? JSON.parse(val) : null;
      } catch {
        return null;
      }
    };
    const setCachedData = (key: string, val: any) => {
      try {
        sessionStorage.setItem(key, JSON.stringify(val));
      } catch {}
    };

    const cachedCat = getCachedData("aux_categorias");
    const cachedStatus = getCachedData("aux_status");
    const cachedUrg = getCachedData("aux_urgencias");
    const cachedPri = getCachedData("aux_prioridades");

    if (cachedCat && cachedStatus && cachedUrg && cachedPri) {
      setListaCategorias(cachedCat);
      setListaStatus(cachedStatus);
      setListaUrgencias(cachedUrg);
      setListaPrioridades(cachedPri);
    } else {
      carregarMetadados()
        .then(([resCat, resStatus, resUrg, resPri]) => {
          setListaCategorias(resCat.data);
          setListaStatus(resStatus.data);
          setListaUrgencias(resUrg.data);
          setListaPrioridades(resPri.data);

          setCachedData("aux_categorias", resCat.data);
          setCachedData("aux_status", resStatus.data);
          setCachedData("aux_urgencias", resUrg.data);
          setCachedData("aux_prioridades", resPri.data);
        })
        .catch((err) => console.error("Erro ao carregar dados auxiliares da API", err));
    }
  }, []);

  const categorias = listaCategorias.length ? listaCategorias : CATEGORIAS_DEFAULT;
  const statusList = (listaStatus.length ? listaStatus : STATUS_DEFAULT).filter(
    (s) => s.nome !== "Concluído"
  );
  const urgenciasList = normalizarLista(listaUrgencias.length ? listaUrgencias : URGENCIAS_DEFAULT);
  const prioridadesList = normalizarLista(
    listaPrioridades.length ? listaPrioridades : PRIORIDADES_DEFAULT
  );

  return { categorias, statusList, urgenciasList, prioridadesList };
}
