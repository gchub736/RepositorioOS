import React from "react";

interface BadgeProps {
  cor: string; // classes de cor (Tailwind)
  className?: string; // classes extras (tamanho de fonte, truncate, w-max...)
  title?: string;
  children: React.ReactNode;
}

// Pílula colorida reutilizável usada para categoria, status, urgência e SLA.
export default function Badge({ cor, className = "", title, children }: BadgeProps) {
  return (
    <span
      title={title}
      className={`px-2 py-1 rounded-lg font-black uppercase ${cor} ${className}`}
    >
      {children}
    </span>
  );
}
