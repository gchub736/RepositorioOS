"use client";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import { useNovoChamado } from "../hooks";
import { NovoChamadoForm, SucessoModal } from "../components/novo";

// Orquestrador da tela de novo chamado: conecta o hook (estado + envio) aos componentes
// de apresentação. Mesmo layout/padrão das telas de listagem.
export default function NovoChamado() {
  const router = useRouter();
  const {
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
  } = useNovoChamado();

  return (
    <div className="p-6 pb-0 max-w-full overflow-hidden h-full flex flex-col">
      <div className="flex items-center gap-1.5 mb-2 text-xs">
        <Home size={14} className="text-slate-400 dark:text-slate-500" />
        <span className="text-slate-400 dark:text-slate-500 font-medium">Início</span>
        <span className="text-slate-400 dark:text-slate-500">&gt;</span>
        <span className="text-slate-600 dark:text-slate-300 font-semibold">Novo Chamado</span>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
          Novo Chamado
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Preencha os dados para abrir uma nova ordem de serviço.
        </p>
      </div>

      <NovoChamadoForm
        titulo={titulo}
        setTitulo={setTitulo}
        descricao={descricao}
        setDescricao={setDescricao}
        categoria={categoria}
        setCategoria={setCategoria}
        localizacao={localizacao}
        setLocalizacao={setLocalizacao}
        anexo={anexo}
        setAnexo={setAnexo}
        categorias={categorias}
        isSubmitting={isSubmitting}
        onSubmit={salvarOrdem}
        onCancelar={() => router.push("/")}
      />

      {sucesso && <SucessoModal onFechar={resetarFormulario} />}
    </div>
  );
}
