"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
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
      <div className="h-[200px] md:h-auto md:flex-1 md:min-h-[120px] w-full text-slate-700 dark:text-slate-400">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dados} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: "currentColor", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: "currentColor", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(51, 65, 85, 0.5)",
                borderRadius: "12px",
                color: "#f8fafc",
                fontSize: "11px",
              }}
              itemStyle={{ color: "#f8fafc" }}
            />
            <Legend verticalAlign="top" height={32} iconType="circle" iconSize={6} wrapperStyle={{ fontSize: "10px" }} />
            <Bar dataKey="Em Aberto" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Em Aberto" />
            <Bar dataKey="Resolvidos" fill="#10b981" radius={[4, 4, 0, 0]} name="Resolvidos" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
