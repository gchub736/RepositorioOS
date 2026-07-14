import { statCardClass } from "../../lib/constantes";

// Esqueleto exibido enquanto as métricas carregam (mantém o layout estável,
// evitando o "pulo" da tela quando os dados chegam).
export default function EstatisticasSkeleton() {
  const Barra = ({ className = "" }: { className?: string }) => (
    <div className={`bg-slate-200 dark:bg-slate-800 rounded animate-pulse ${className}`} />
  );

  const Card = ({ children }: { children: React.ReactNode }) => (
    <div className={statCardClass}>
      <Barra className="h-3 w-40 mb-4" />
      {children}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-[auto_auto_1fr] gap-3 flex-1 min-h-0 pb-2">
      <Card>
        <Barra className="h-3 w-full mb-2" />
        <Barra className="h-4 w-full mb-3" />
        <Barra className="h-3 w-full mb-2" />
        <Barra className="h-4 w-full" />
      </Card>
      <Card>
        <Barra className="h-4 w-full mb-3" />
        <Barra className="h-4 w-5/6 mb-3" />
        <Barra className="h-4 w-4/6" />
      </Card>
      <Card>
        <div className="grid grid-cols-3 gap-2 flex-1">
          <Barra className="h-16" />
          <Barra className="h-16" />
          <Barra className="h-16" />
        </div>
      </Card>
      <Card>
        <div className="flex items-center gap-5">
          <Barra className="w-[88px] h-[88px] rounded-full flex-shrink-0" />
          <div className="flex-1">
            <Barra className="h-3 w-32 mb-2" />
            <Barra className="h-6 w-24" />
          </div>
        </div>
      </Card>
      <div className={`${statCardClass} md:col-span-2`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
          <div>
            <Barra className="h-3 w-40 mb-4" />
            <Barra className="h-9 w-full mb-3" />
            <Barra className="h-9 w-full mb-3" />
            <Barra className="h-9 w-full" />
          </div>
          <div>
            <Barra className="h-3 w-40 mb-4" />
            <Barra className="h-32 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
