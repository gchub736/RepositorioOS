"use client";
import { useLogin } from "../hooks";
import { AuthCard, LoginForm } from "../components/auth";

// Orquestrador da tela de entrada: conecta o hook (login/cadastro) aos componentes.
export default function Login() {
  const {
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
  } = useLogin();

  return (
    <AuthCard
      titulo={isCadastro ? "Novo Usuário" : "Central de Suporte Técnico"}
      subtitulo={isCadastro ? "Crie sua credencial de acesso" : "Identifique-se para continuar"}
      rodape={
        <button
          type="button"
          onClick={alternarModo}
          className="text-[11px] font-bold text-slate-600 hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-400 uppercase tracking-widest transition-colors"
        >
          {isCadastro ? "Já tenho conta. Fazer login." : "Não possui acesso? Cadastre-se."}
        </button>
      }
    >
      <LoginForm
        isCadastro={isCadastro}
        nome={nome}
        setNome={setNome}
        cpf={cpf}
        setCpf={setCpf}
        email={email}
        setEmail={setEmail}
        senha={senha}
        setSenha={setSenha}
        erro={erro}
        sucesso={sucesso}
        isSubmitting={isSubmitting}
        tempoBloqueio={tempoBloqueio}
        onSubmit={submeter}
      />
    </AuthCard>
  );
}
