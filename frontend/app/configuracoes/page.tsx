"use client";
import { Home } from "lucide-react";
import { useConfiguracoes } from "../hooks";
import { ConfiguracoesTabs, FormPerfil, FormSistema } from "../components/configuracoes";

// Orquestrador da tela de configurações: conecta o hook (perfil + sistema) aos
// componentes de apresentação. Mesmo layout/padrão das demais telas.
export default function Configuracoes() {
  const cfg = useConfiguracoes();

  return (
    // Mobile: a página cresce e rola (o <main> do layout já tem overflow-y-auto).
    // Desktop (md+): altura fixa e sem rolagem, com o card rolando por dentro.
    <div className="p-6 pb-6 md:pb-0 max-w-full flex flex-col md:h-full md:overflow-hidden">
      <div className="flex items-center gap-1.5 mb-2 text-xs">
        <Home size={14} className="text-slate-400 dark:text-slate-500" />
        <span className="text-slate-400 dark:text-slate-500 font-medium">Início</span>
        <span className="text-slate-400 dark:text-slate-500">&gt;</span>
        <span className="text-slate-600 dark:text-slate-300 font-semibold">Configurações</span>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
          Configurações
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Gerencie suas preferências e configurações do sistema.
        </p>
      </div>

      <ConfiguracoesTabs
        abaAtiva={cfg.abaAtiva}
        setAbaAtiva={cfg.setAbaAtiva}
        mostrarSistema={cfg.cargo === "Admin"}
      />

      {cfg.abaAtiva === "perfil" && (
        <FormPerfil
          nome={cfg.nome}
          setNome={cfg.setNome}
          email={cfg.email}
          setEmail={cfg.setEmail}
          senhaAtual={cfg.senhaAtual}
          setSenhaAtual={cfg.setSenhaAtual}
          novaSenha={cfg.novaSenha}
          setNovaSenha={cfg.setNovaSenha}
          sucesso={cfg.sucessoPerfil}
          onSubmit={cfg.salvarPerfil}
        />
      )}

      {cfg.abaAtiva === "sistema" && cfg.cargo === "Admin" && (
        <FormSistema
          nomeSistema={cfg.nomeSistema}
          setNomeSistema={cfg.setNomeSistema}
          slaMuito={cfg.slaMuito}
          setSlaMuito={cfg.setSlaMuito}
          slaAlta={cfg.slaAlta}
          setSlaAlta={cfg.setSlaAlta}
          slaMedia={cfg.slaMedia}
          setSlaMedia={cfg.setSlaMedia}
          slaBaixa={cfg.slaBaixa}
          setSlaBaixa={cfg.setSlaBaixa}
          sucesso={cfg.sucessoSistema}
          onSubmit={cfg.salvarSistema}
        />
      )}
    </div>
  );
}
