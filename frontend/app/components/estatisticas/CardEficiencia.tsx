import { statCardClass, statTituloClass } from "../../lib/constantes";
import { EstatisticasGeral, TempoMedioResolucao } from "../../types";
import { formatarDuracaoHoras } from "../../lib/formatters";

interface Props {
  geral: EstatisticasGeral;
  tempoMedio: TempoMedioResolucao;
}

// Card 4: taxa de resolução (anel de progresso) + tempo médio de resolução.
export default function CardEficiencia({ geral, tempoMedio }: Props) {
  const perc = Math.max(0, Math.min(100, Number(geral.perc_resolvidos) || 0));

  // Anel de progresso via SVG (circunferência = 2πr).
  const raio = 34;
  const circunferencia = 2 * Math.PI * raio;
  const preenchido = (perc / 100) * circunferencia;

  return (
    <div className={statCardClass}>
      <h3 className={statTituloClass}>Taxa de Eficiência</h3>

      <div className="flex items-center gap-5 flex-1">
        <div className="relative flex-shrink-0">
          <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
            <circle
              cx="44"
              cy="44"
              r={raio}
              fill="none"
              strokeWidth="9"
              className="stroke-slate-150 dark:stroke-slate-800"
              stroke="currentColor"
              style={{ color: "rgb(226 232 240)" }}
            />
            <circle
              cx="44"
              cy="44"
              r={raio}
              fill="none"
              strokeWidth="9"
              strokeLinecap="round"
              stroke="#10b981"
              strokeDasharray={`${preenchido} ${circunferencia}`}
              className="transition-all duration-1000"
            />
          </svg>
          {/* Texto menor para não encostar na borda interna do anel. */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[13px] font-black text-slate-800 dark:text-white leading-none">
              {perc}%
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Tempo médio de resolução
          </p>
          <p className="text-2xl font-black text-slate-800 dark:text-white leading-tight mt-0.5">
            {formatarDuracaoHoras(tempoMedio.horas)}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            {tempoMedio.amostra > 0
              ? `Média de ${tempoMedio.amostra} chamado${tempoMedio.amostra > 1 ? "s" : ""} fechado${
                  tempoMedio.amostra > 1 ? "s" : ""
                }, descontando pausas.`
              : "Nenhum chamado fechado no período."}
          </p>
        </div>
      </div>
    </div>
  );
}
