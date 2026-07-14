import ListaPrioridades from "./ListaPrioridades";
import GraficoCategorias from "./GraficoCategorias";
import { statCardClass } from "../../lib/constantes";
import { EstatisticaCategoria, EstatisticaPrioridade } from "../../types";

interface Props {
  prioridades: EstatisticaPrioridade[];
  categorias: EstatisticaCategoria[];
}

// Card 5 (largura dupla): compõe a lista de prioridades e o gráfico de categorias.
export default function CardPrioridadesCategorias({ prioridades, categorias }: Props) {
  return (
    <div className={`${statCardClass} md:col-span-2 min-h-0`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <ListaPrioridades prioridades={prioridades} />
        <GraficoCategorias categorias={categorias} />
      </div>
    </div>
  );
}
