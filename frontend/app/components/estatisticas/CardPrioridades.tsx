import ListaPrioridades from "./ListaPrioridades";
import { statCardClass } from "../../lib/constantes";
import { EstatisticaPrioridade } from "../../types";

// Card: chamados em aberto por prioridade. No desktop divide o último row com o
// card de categorias; no mobile é um card branco independente que envolve a lista.
export default function CardPrioridades({ prioridades }: { prioridades: EstatisticaPrioridade[] }) {
  return (
    <div className={`${statCardClass} md:min-h-0`}>
      <ListaPrioridades prioridades={prioridades} />
    </div>
  );
}
