"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { statTituloClass } from "../../lib/constantes";
import { EstatisticaCategoria } from "../../types";

// Gráfico de barras: chamados em aberto x resolvidos, por categoria.
export default function GraficoCategorias({ categorias }: { categorias: EstatisticaCategoria[] }) {
  const dados = (categorias || []).map((cat) => ({
    name: cat.categoria,
    "Em Aberto": cat.abertos,
    Resolvidos: cat.resolvidos,
  }));

  return (
    <div className="flex flex-col h-full w-full min-h-0">
      <h3 className={statTituloClass}>Chamados por Categoria</h3>
      {/* Mobile: altura fixa confortável (200px). Desktop: ocupa o espaço que sobra
          no card, evitando estourar a tela. A cor do texto dos eixos vem de
          currentColor, então acompanha o tema (o Recharts não entende dark:). */}
      {/* Legenda própria (HTML), sempre alinhada — evita o desalinho da legenda do Recharts. */}
      <div className="flex items-center justify-center gap-4 mt-1 mb-2">
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" /> Em Aberto
        </span>
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" /> Resolvidos
        </span>
      </div>
      <div className="h-[220px] md:h-auto md:flex-1 md:min-h-[140px] w-full text-slate-500 dark:text-slate-400">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dados} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barGap={2} barCategoryGap="25%">
            <XAxis
              dataKey="name"
              tick={{ fill: "currentColor", fontSize: 9 }}
              tickLine={false}
              axisLine={false}
              interval={0}
              height={28}
              tickMargin={6}
              tickFormatter={(v: string) => (v.length > 6 ? `${v.slice(0, 5)}…` : v)}
            />
            <YAxis
              tick={{ fill: "currentColor", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              width={22}
            />
            <Tooltip
              cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(51, 65, 85, 0.5)",
                borderRadius: "12px",
                color: "#f8fafc",
                fontSize: "11px",
              }}
              itemStyle={{ color: "#f8fafc" }}
            />
            <Bar dataKey="Em Aberto" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Em Aberto" maxBarSize={38} />
            <Bar dataKey="Resolvidos" fill="#10b981" radius={[3, 3, 0, 0]} name="Resolvidos" maxBarSize={38} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
