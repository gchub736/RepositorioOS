"use client";
import { useState, type FormEvent } from "react";
import { esqueciSenha } from "../services/authService";

// Solicita o e-mail de recuperação de senha.
// Por segurança o back responde a mesma mensagem mesmo se o CPF não existir,
// então aqui também não damos pistas sobre a existência do cadastro.
export function useEsqueciSenha() {
  const [cpf, setCpf] = useState("");
  const [erro, setErro] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempoBloqueio, setTempoBloqueio] = useState(0);

  const submeter = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");
    setIsSubmitting(true);

    try {
      await esqueciSenha(cpf);
      setEnviado(true);
    } catch (err: any) {
      if (err.response?.status === 429) {
        const retryAfter = err.response.headers["retry-after"];
        setTempoBloqueio(retryAfter ? parseInt(retryAfter) : 60);
        setErro("Muitas tentativas. Aguarde antes de tentar novamente.");
      } else {
        setErro(err.response?.data?.message || "Não foi possível concluir a solicitação.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return { cpf, setCpf, erro, enviado, isSubmitting, tempoBloqueio, submeter };
}
