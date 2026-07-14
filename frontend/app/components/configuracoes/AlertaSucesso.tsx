import { CheckCircle } from "lucide-react";

// Faixa verde de confirmação exibida após salvar (perfil ou sistema).
export default function AlertaSucesso({ mensagem }: { mensagem: string }) {
  return (
    <div className="flex items-center gap-3 bg-green-100 dark:bg-green-900/20 border border-green-500 dark:border-green-800 text-green-800 dark:text-green-400 px-4 py-3 rounded-xl mb-4">
      <CheckCircle size={18} />
      <span className="font-bold text-sm">{mensagem}</span>
    </div>
  );
}
