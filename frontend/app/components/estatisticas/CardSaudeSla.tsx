"use client";
import { useRouter } from "next/navigation";
import { statCardClass, statTituloClass } from "../../lib/constantes";
import { EstatisticaSla } from "../../types";

interface Props {
  sla?: EstatisticaSla;
}

// Card 3: chamados ativos por situação de SLA.
// Cada bloco é clicável e abre a listagem já filtrada (drill-down).
export default function CardSaudeSla({ sla }: Props) {
  const router = useRouter();

  const blocos = [
    {
      chave: "ok",
      label: "No Prazo",
      valor: sla?.ok || 0,
      classes:
        "bg-green-100 dark:bg-green-900/20 border-green-500 dark:border-green-800 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40",
      valorClasses: "text-green-800 dark:text-green-300",
    },
    {
      chave: "alerta",
      label: "Alerta",
      valor: sla?.alerta || 0,
      classes:
        "bg-orange-100 dark:bg-orange-900/20 border-orange-500 dark:border-orange-800 text-orange-800 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/40",
      valorClasses: "text-orange-800 dark:text-orange-300",
    },
    {
      chave: "vencido",
      label: "Vencido",
      valor: sla?.vencido || 0,
      classes:
        "bg-red-100 dark:bg-red-900/20 border-red-500 dark:border-red-800 text-red-800 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40",
      valorClasses: "text-red-800 dark:text-red-300",
    },
  ];

  return (
    <div className={statCardClass}>
      <h3 className={statTituloClass}>Saúde do SLA (Ativos)</h3>
      <div className="grid grid-cols-3 gap-2 flex-1">
        {blocos.map((b) => (
          <button
            key={b.chave}
            type="button"
            onClick={() => router.push(`/?sla=${b.chave}`)}
            title={`Ver chamados com SLA ${b.label.toLowerCase()}`}
            className={`border rounded-lg p-2 flex flex-col justify-center items-center text-center shadow-sm transition-colors cursor-pointer ${b.classes}`}
          >
            <span className="text-[9px] font-bold uppercase mb-1">{b.label}</span>
            <span className={`text-2xl md:text-3xl font-black ${b.valorClasses}`}>{b.valor}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
