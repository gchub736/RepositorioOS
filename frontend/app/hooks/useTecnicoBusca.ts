"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { buscarTecnicos as buscarTecnicosApi } from "../services/usuariosService";
import { Usuario } from "../types";

// Encapsula o autocomplete de técnicos: texto de busca, resultados vindos do back
// (sem filtragem no front), estado do dropdown e o técnico selecionado.
// Usa um guard de request-id para descartar respostas obsoletas e nunca travar em "Buscando…".
export function useTecnicoBusca() {
  const [tecnicoId, setTecnicoId] = useState<number | string>("");
  const [tecnicoBusca, setTecnicoBusca] = useState("");
  const [tecnicoResultados, setTecnicoResultados] = useState<Usuario[]>([]);
  const [tecnicoDropdownAberto, setTecnicoDropdownAberto] = useState(false);
  const [buscandoTecnico, setBuscandoTecnico] = useState(false);
  const tecnicoDropdownRef = useRef<HTMLDivElement>(null);
  const tecnicoRequestIdRef = useRef(0);

  const buscar = useCallback(async (query: string) => {
    const requestId = ++tecnicoRequestIdRef.current;
    setBuscandoTecnico(true);
    try {
      const res = await buscarTecnicosApi(query);
      if (requestId !== tecnicoRequestIdRef.current) return; // resposta obsoleta, ignora
      const lista = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setTecnicoResultados(lista);
    } catch (err) {
      if (requestId !== tecnicoRequestIdRef.current) return;
      console.error("Erro ao buscar técnicos", err);
    } finally {
      if (requestId === tecnicoRequestIdRef.current) setBuscandoTecnico(false);
    }
  }, []);

  useEffect(() => {
    if (!tecnicoDropdownAberto) return;
    const delay = setTimeout(() => buscar(tecnicoBusca), 300);
    return () => clearTimeout(delay);
  }, [tecnicoBusca, tecnicoDropdownAberto, buscar]);

  useEffect(() => {
    if (!tecnicoDropdownAberto) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (tecnicoDropdownRef.current && !tecnicoDropdownRef.current.contains(e.target as Node)) {
        setTecnicoDropdownAberto(false);
        setBuscandoTecnico(false);
        tecnicoRequestIdRef.current++; // invalida qualquer busca em andamento
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [tecnicoDropdownAberto]);

  // Handlers usados pelo componente de autocomplete (espelham os antigos inline).
  const onChangeBusca = (valor: string) => {
    setTecnicoBusca(valor);
    setTecnicoId("");
    setTecnicoDropdownAberto(true);
    setBuscandoTecnico(true);
  };
  const onFocus = () => {
    setTecnicoDropdownAberto(true);
    setBuscandoTecnico(true);
  };
  const selecionar = (t: Usuario) => {
    setTecnicoId(t.id);
    setTecnicoBusca(t.nome);
    setTecnicoDropdownAberto(false);
    setBuscandoTecnico(false);
    tecnicoRequestIdRef.current++;
  };
  const limpar = () => {
    setTecnicoId("");
    setTecnicoBusca("");
    setTecnicoDropdownAberto(false);
    setBuscandoTecnico(false);
    tecnicoRequestIdRef.current++;
  };
  // Preenche com o técnico já atribuído ao abrir o modal (sem abrir dropdown).
  const iniciar = (nome: string, id: number | string) => {
    setTecnicoId(id || "");
    setTecnicoBusca(nome || "");
    setTecnicoResultados([]);
    setTecnicoDropdownAberto(false);
  };

  return {
    tecnicoId,
    tecnicoBusca,
    tecnicoResultados,
    tecnicoDropdownAberto,
    buscandoTecnico,
    tecnicoDropdownRef,
    onChangeBusca,
    onFocus,
    selecionar,
    limpar,
    iniciar,
  };
}

export type TecnicoBusca = ReturnType<typeof useTecnicoBusca>;
