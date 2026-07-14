"use client";
import { Home } from "lucide-react";
import { useEstatisticas } from "../hooks";
import {
  CardStatusChamados,
  CardTopTecnicos,
  CardSaudeSla,
  CardEficiencia,
  CardPrioridadesCategorias,
  ControlesEstatisticas,
  EstatisticasSkeleton,
} from "../components/estatisticas";

// Orquestrador da tela de estatísticas: conecta o hook de métricas aos cards de
// apresentação. Mesmo layout/padrão das demais telas.
export default function Estatisticas() {
  const { dados, erro, carregando, periodo, setPeriodo, atualizadoEm, recarregar } =
    useEstatisticas();

  return (
    <div className="p-6 pb-0 max-w-full overflow-hidden h-full flex flex-col">
      <div className="flex items-center gap-1.5 mb-2 text-xs">
        <Home size={14} className="text-slate-400 dark:text-slate-500" />
        <span className="text-slate-400 dark:text-slate-500 font-medium">Início</span>
        <span className="text-slate-400 dark:text-slate-500">&gt;</span>
        <span className="text-slate-600 dark:text-slate-300 font-semibold">Estatísticas</span>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
            Estatísticas
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Acompanhe os indicadores e o desempenho do sistema.
          </p>
        </div>

        {!erro && (
          <ControlesEstatisticas
            periodo={periodo}
            setPeriodo={setPeriodo}
            atualizadoEm={atualizadoEm}
            carregando={carregando}
            onRecarregar={recarregar}
          />
        )}
      </div>

      {erro && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg font-bold text-sm">
          {erro}
        </div>
      )}

      {!erro && carregando && <EstatisticasSkeleton />}

      {!erro && !carregando && dados && (
        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-[auto_auto_1fr] gap-3 flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-2">
          <CardStatusChamados geral={dados.geral} />
          <CardTopTecnicos tecnicos={dados.top_tecnicos} />
          <CardSaudeSla sla={dados.sla} />
          <CardEficiencia geral={dados.geral} tempoMedio={dados.tempo_medio_resolucao} />
          <CardPrioridadesCategorias
            prioridades={dados.prioridades}
            categorias={dados.categorias}
          />
        </div>
      )}
    </div>
  );
}
