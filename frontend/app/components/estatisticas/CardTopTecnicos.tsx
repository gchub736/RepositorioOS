import { statCardClass, statTituloClass } from "../../lib/constantes";
import { TopTecnico } from "../../types";

// Card 2: ranking de técnicos por chamados finalizados, com barra proporcional ao líder.
export default function CardTopTecnicos({ tecnicos }: { tecnicos: TopTecnico[] }) {
  const maximo = tecnicos.reduce((max, t) => Math.max(max, t.resolvidos), 0);

  return (
    <div className={statCardClass}>
      <h3 className={statTituloClass}>Top Técnicos (Performance)</h3>
      <div className="space-y-2.5 overflow-y-auto flex-1 min-h-0 pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {tecnicos.map((tech, i) => {
          const perc = maximo > 0 ? (tech.resolvidos / maximo) * 100 : 0;
          return (
            <div key={tech.id} className="flex items-center gap-3">
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                  i === 0
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate">
                    {tech.nome}
                  </span>
                  <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 flex-shrink-0">
                    {tech.resolvidos}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${perc}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
        {tecnicos.length === 0 && (
          <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 italic">
            Nenhum chamado finalizado por um técnico ativo ainda.
          </p>
        )}
      </div>
    </div>
  );
}
