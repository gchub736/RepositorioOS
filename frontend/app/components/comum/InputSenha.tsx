"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { formInputClass } from "../../lib/constantes";

interface Props {
  value: string;
  onChange: (valor: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}

// Campo de senha com botão de "olho" para revelar/ocultar o que está sendo digitado.
// A visibilidade é estado local de apresentação; o valor da senha continua no hook.
export default function InputSenha({
  value,
  onChange,
  placeholder = "••••••••",
  required,
  autoComplete,
}: Props) {
  const [visivel, setVisivel] = useState(false);

  return (
    <div className="relative">
      <input
        type={visivel ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        // pr-11 reserva espaço para o botão não ficar por cima do texto.
        className={`${formInputClass} pr-11`}
      />
      <button
        type="button"
        onClick={() => setVisivel((v) => !v)}
        title={visivel ? "Ocultar senha" : "Mostrar senha"}
        aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
      >
        {visivel ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
