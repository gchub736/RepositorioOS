import GraficoCategorias from "./GraficoCategorias";
import { statCardClass } from "../../lib/constantes";
import { EstatisticaCategoria } from "../../types";

// Card: gráfico de chamados por categoria (aberto x resolvido). Card branco
// independente, garantindo fundo próprio também no mobile.
export default function CardCategorias({ categorias }: { categorias: EstatisticaCategoria[] }) {
  return (
    <div className={`${statCardClass} md:min-h-0`}>
      <GraficoCategorias categorias={categorias} />
    </div>
  );
}
