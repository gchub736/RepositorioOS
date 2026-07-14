"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { validarTokenSenha, resetarSenha } from "../services/authService";

// Redefine a senha a partir do token recebido por e-mail (?token=... na URL).
// Valida o token ao abrir a tela, para não deixar o usuário preencher o formulário
// à toa quando o link já expirou ou foi usado.
export function useResetarSenha() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [validando, setValidando] = useState(true);
  const [tokenValido, setTokenValido] = useState(false);
  const [erroToken, setErroToken] = useState("");

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setErroToken("Link inválido: token não informado.");
      setValidando(false);
      return;
    }

    validarTokenSenha(token)
      .then(() => setTokenValido(true))
      .catch((err) => {
        setErroToken(
          err.response?.data?.message || "Link inválido ou expirado. Solicite uma nova recuperação."
        );
      })
      .finally(() => setValidando(false));
  }, [token]);

  const submeter = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");

    // Confere a confirmação no front para dar retorno imediato (o back também valida).
    if (novaSenha !== confirmacao) {
      setErro("As senhas não coincidem.");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetarSenha(token, novaSenha);
      setSucesso(true);
      // Leva de volta ao login após a confirmação.
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: any) {
      setErro(err.response?.data?.message || "Não foi possível redefinir a senha.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    validando,
    tokenValido,
    erroToken,
    novaSenha,
    setNovaSenha,
    confirmacao,
    setConfirmacao,
    erro,
    sucesso,
    isSubmitting,
    submeter,
  };
}
