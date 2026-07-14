"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { login as loginApi, cadastrar as cadastrarApi } from "../services/authService";

// Orquestra a tela de entrada: alterna entre login e cadastro, guarda a sessão e
// respeita o bloqueio por excesso de tentativas (429) informado pelo servidor.
export function useLogin() {
  const router = useRouter();

  const [isCadastro, setIsCadastro] = useState(false);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempoBloqueio, setTempoBloqueio] = useState(0);

  // Contagem regressiva do bloqueio (o tempo vem do header retry-after).
  useEffect(() => {
    if (tempoBloqueio <= 0) return;
    const interval = setInterval(() => {
      setTempoBloqueio((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [tempoBloqueio]);

  const alternarModo = () => {
    setIsCadastro((v) => !v);
    setErro("");
    setSucesso("");
  };

  const guardarSessao = (user: any, token: string) => {
    sessionStorage.setItem("tecnicoLogado", cpf);
    sessionStorage.setItem("usuarioId", user.id);
    sessionStorage.setItem("usuarioCargo", user.cargo?.nome || user.cargo);
    sessionStorage.setItem("usuarioNome", user.nome);
    sessionStorage.setItem("token", token);

    const temaSalvo = localStorage.getItem(`theme_${cpf}`) || "light";
    localStorage.setItem("theme", temaSalvo);
    document.documentElement.classList.toggle("dark", temaSalvo === "dark");
  };

  const submeter = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setIsSubmitting(true);

    try {
      if (isCadastro) {
        await cadastrarApi({ nome, cpf, email, senha });
        setIsCadastro(false);
        setSenha("");
        setSucesso("Conta criada com sucesso! Faça login para continuar.");
      } else {
        const resposta = await loginApi(cpf, senha);
        const { user, token } = resposta.data;
        guardarSessao(user, token);

        const cargo = user.cargo?.nome || user.cargo;
        router.push(cargo === "Usuario" ? "/novo" : "/");
      }
    } catch (err: any) {
      if (err.response?.status === 429) {
        // Aguarda exatamente o tempo informado pelo servidor.
        const retryAfter = err.response.headers["retry-after"];
        setTempoBloqueio(retryAfter ? parseInt(retryAfter) : 60);
        setErro("");
      } else {
        const padrao = isCadastro
          ? "Erro ao criar conta. Verifique os dados."
          : "Credenciais inválidas. Tente novamente.";
        setErro(err.response?.data?.message || padrao);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isCadastro,
    alternarModo,
    nome,
    setNome,
    cpf,
    setCpf,
    email,
    setEmail,
    senha,
    setSenha,
    erro,
    sucesso,
    isSubmitting,
    tempoBloqueio,
    submeter,
  };
}
