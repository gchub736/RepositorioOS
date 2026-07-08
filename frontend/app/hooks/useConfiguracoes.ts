"use client";
import { useEffect, useState, type FormEvent } from "react";
import { obterPerfil, atualizarPerfil } from "../services/perfilService";
import { obterConfiguracoes, atualizarConfiguracoes } from "../services/configuracoesService";
import { AbaConfig } from "../types";

// Orquestra a tela de configurações: perfil do usuário logado e (para Admin) as
// configurações gerais do sistema. Carrega os dados e salva cada aba.
export function useConfiguracoes() {
  const [abaAtiva, setAbaAtiva] = useState<AbaConfig>("perfil");

  // Identidade
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [cargo, setCargo] = useState("");

  // Perfil
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [sucessoPerfil, setSucessoPerfil] = useState(false);

  // Sistema
  const [nomeSistema, setNomeSistema] = useState("");
  const [slaAlta, setSlaAlta] = useState("4");
  const [slaMuito, setSlaMuito] = useState("2");
  const [slaMedia, setSlaMedia] = useState("8");
  const [slaBaixa, setSlaBaixa] = useState("24");
  const [sucessoSistema, setSucessoSistema] = useState(false);

  useEffect(() => {
    const carregarFallbacksLocais = () => {
      setNomeSistema(localStorage.getItem("cfg_nomeSistema") || "Central de Suporte Técnico");
      setSlaAlta(localStorage.getItem("cfg_slaAlta") || "4");
      setSlaMuito(localStorage.getItem("cfg_slaMuito") || "2");
      setSlaMedia(localStorage.getItem("cfg_slaMedia") || "8");
      setSlaBaixa(localStorage.getItem("cfg_slaBaixa") || "24");
    };

    obterPerfil()
      .then((res) => {
        const eu = res.data;
        setUsuarioId(eu.id);
        setNome(eu.nome);
        setEmail(eu.email);

        const perfilCargo = eu.cargo?.nome || eu.cargo || "";
        setCargo(perfilCargo);

        // Só Admin lê as configurações gerais do sistema.
        if (perfilCargo === "Admin") {
          obterConfiguracoes()
            .then((resCfg) => {
              const cfg = resCfg.data;
              setNomeSistema(cfg.nome_sistema || "Central de Suporte Técnico");
              setSlaAlta(String(cfg.sla_alta ?? "4"));
              setSlaMuito(String(cfg.sla_muito_alta ?? "2"));
              setSlaMedia(String(cfg.sla_media ?? "8"));
              setSlaBaixa(String(cfg.sla_baixa ?? "24"));
            })
            .catch((err) => {
              console.error("Erro ao carregar configurações do sistema", err);
              carregarFallbacksLocais();
            });
        } else {
          carregarFallbacksLocais();
        }
      })
      .catch((err) => console.error("Erro ao carregar perfil", err));
  }, []);

  const salvarPerfil = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await atualizarPerfil(usuarioId!, {
        nome,
        email,
        senha_atual: senhaAtual || undefined,
        nova_senha: novaSenha || undefined,
      });
      sessionStorage.setItem("usuarioNome", nome);
      setSucessoPerfil(true);
      setSenhaAtual("");
      setNovaSenha("");
      setTimeout(() => setSucessoPerfil(false), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao atualizar perfil.");
    }
  };

  const salvarSistema = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await atualizarConfiguracoes({
        nome_sistema: nomeSistema,
        sla_muito_alta: Number(slaMuito),
        sla_alta: Number(slaAlta),
        sla_media: Number(slaMedia),
        sla_baixa: Number(slaBaixa),
      });
      // Mantém o localStorage sincronizado (o nome do sistema aparece na sidebar).
      localStorage.setItem("cfg_nomeSistema", nomeSistema);
      setSucessoSistema(true);
      setTimeout(() => setSucessoSistema(false), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao salvar configurações.");
    }
  };

  return {
    abaAtiva,
    setAbaAtiva,
    cargo,
    // perfil
    nome,
    setNome,
    email,
    setEmail,
    senhaAtual,
    setSenhaAtual,
    novaSenha,
    setNovaSenha,
    sucessoPerfil,
    salvarPerfil,
    // sistema
    nomeSistema,
    setNomeSistema,
    slaAlta,
    setSlaAlta,
    slaMuito,
    setSlaMuito,
    slaMedia,
    setSlaMedia,
    slaBaixa,
    setSlaBaixa,
    sucessoSistema,
    salvarSistema,
  };
}
