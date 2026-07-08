"use client";
import { useEffect, useState, type FormEvent } from "react";
import { criarOrdem } from "../services/ordensService";
import { listarCategorias } from "../services/metadadosService";
import { CATEGORIAS_DEFAULT } from "../lib/constantes";
import { Metadado } from "../types";

// Orquestra a criação de um novo chamado: estado do formulário, carregamento das
// categorias (com cache em sessionStorage) e o envio assíncrono para a API.
export function useNovoChamado() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState(CATEGORIAS_DEFAULT[0].nome);
  const [localizacao, setLocalizacao] = useState("");
  const [anexo, setAnexo] = useState<File | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [listaCategorias, setListaCategorias] = useState<Metadado[]>([]);

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem("aux_categorias");
      if (cached) {
        const parsed = JSON.parse(cached);
        setListaCategorias(parsed);
        if (parsed.length > 0) setCategoria(parsed[0].nome);
        return;
      }
    } catch {}

    listarCategorias()
      .then((res) => {
        setListaCategorias(res.data);
        try {
          sessionStorage.setItem("aux_categorias", JSON.stringify(res.data));
        } catch {}
        if (res.data.length > 0) setCategoria(res.data[0].nome);
      })
      .catch((err) => console.error("Erro ao carregar categorias", err));
  }, []);

  const categorias = listaCategorias.length ? listaCategorias : CATEGORIAS_DEFAULT;

  const salvarOrdem = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // O front envia só os dados do formulário; a identidade (token) vai no axios.
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descricao", descricao);
      formData.append("categoria", categoria);
      formData.append("localizacao", localizacao);
      if (anexo) formData.append("anexo", anexo);

      await criarOrdem(formData);
      setSucesso(true);
    } catch (err: any) {
      let errorMessage = "Verifique os dados";
      if (err.response?.data?.errors) {
        const firstErrorKey = Object.keys(err.response.data.errors)[0];
        errorMessage = err.response.data.errors[firstErrorKey][0];
      } else if (
        err.response?.data?.message &&
        err.response?.data?.message !== "The given data was invalid."
      ) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      alert("Falha ao registrar chamado:\n" + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetarFormulario = () => {
    setSucesso(false);
    setTitulo("");
    setDescricao("");
    setCategoria(categorias[0]?.nome || CATEGORIAS_DEFAULT[0].nome);
    setLocalizacao("");
    setAnexo(null);
  };

  return {
    titulo,
    setTitulo,
    descricao,
    setDescricao,
    categoria,
    setCategoria,
    localizacao,
    setLocalizacao,
    anexo,
    setAnexo,
    sucesso,
    isSubmitting,
    categorias,
    salvarOrdem,
    resetarFormulario,
  };
}
