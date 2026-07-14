import { CheckCircle, AlertTriangle, Clock } from "lucide-react";

type Tipo = "erro" | "sucesso" | "bloqueio";

interface Props {
  tipo: Tipo;
  children: React.ReactNode;
}

const estilos: Record<Tipo, { classe: string; Icone: typeof CheckCircle }> = {
  erro: {
    classe:
      "bg-red-100 dark:bg-red-900/20 border-red-500 dark:border-red-800 text-red-800 dark:text-red-400",
    Icone: AlertTriangle,
  },
  sucesso: {
    classe:
      "bg-green-100 dark:bg-green-900/20 border-green-500 dark:border-green-800 text-green-800 dark:text-green-400",
    Icone: CheckCircle,
  },
  bloqueio: {
    classe:
      "bg-amber-100 dark:bg-amber-900/20 border-amber-500 dark:border-amber-700 text-amber-800 dark:text-amber-400",
    Icone: Clock,
  },
};

// Faixa de mensagem das telas de autenticação (erro, sucesso ou bloqueio).
export default function AlertaAuth({ tipo, children }: Props) {
  const { classe, Icone } = estilos[tipo];

  return (
    <div
      className={`mb-6 p-3.5 rounded-xl border flex items-start gap-2.5 text-xs font-medium animate-in fade-in zoom-in duration-200 ${classe}`}
    >
      <Icone size={16} className="flex-shrink-0 mt-0.5" />
      <div className="flex-1 leading-relaxed">{children}</div>
    </div>
  );
}
