"use client";
import { useEffect, useState } from "react";
import { obterPerfil } from "../services/perfilService";

// Fornece cargo e id do usuário logado. Inicializa de forma síncrona pelo sessionStorage
// (resposta visual imediata) e valida o perfil na API em segundo plano quando necessário.
export function usePerfil() {
  const [cargo, setCargo] = useState("");
  const [meuUsuarioId, setMeuUsuarioId] = useState("");

  useEffect(() => {
    const localCargo = sessionStorage.getItem("usuarioCargo") || "";
    const localId = sessionStorage.getItem("usuarioId") || "";
    setCargo(localCargo);
    setMeuUsuarioId(localId);

    if (!localCargo || !localId) {
      obterPerfil()
        .then((res) => {
          const perfilCargo = res.data.cargo?.nome || res.data.cargo || "";
          const perfilId = res.data.id?.toString() || "";
          setCargo(perfilCargo);
          setMeuUsuarioId(perfilId);
          sessionStorage.setItem("usuarioCargo", perfilCargo);
          sessionStorage.setItem("usuarioId", perfilId);
        })
        .catch((err) => console.error("Erro ao validar perfil", err));
    }
  }, []);

  return { cargo, meuUsuarioId };
}
