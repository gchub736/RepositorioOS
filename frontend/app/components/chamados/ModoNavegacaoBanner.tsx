// Banner flutuante indicando o modo de navegação por teclado ativo.
export default function ModoNavegacaoBanner() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl z-40 flex items-center gap-4 animate-in slide-in-from-bottom-5 fade-in border border-slate-700/50">
      <span className="flex items-center justify-center w-6 h-6 bg-slate-700 rounded text-xs font-black">M</span>
      <span className="text-xs font-bold tracking-widest uppercase text-blue-400">Modo Navegação</span>
      <div className="h-4 w-px bg-slate-700 mx-1"></div>
      <span className="text-[10px] text-slate-300 uppercase tracking-widest font-bold">
        Use <kbd className="font-mono text-white ml-1">↑</kbd>{" "}
        <kbd className="font-mono text-white mr-1">↓</kbd> /{" "}
        <kbd className="font-mono text-white ml-1">W</kbd>{" "}
        <kbd className="font-mono text-white mr-1">S</kbd> e{" "}
        <kbd className="font-mono text-white mx-1">ENTER</kbd> para abrir.{" "}
        <kbd className="font-mono text-white ml-1">ESC</kbd> para sair.
      </span>
    </div>
  );
}
