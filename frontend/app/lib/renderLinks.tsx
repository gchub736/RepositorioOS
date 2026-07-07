import React from "react";

// Transforma URLs dentro de um texto em links clicáveis, preservando o restante como
// texto puro. Usado na renderização de comentários.
export const renderLinks = (text: string): React.ReactNode => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, i) =>
    urlRegex.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-300 hover:underline break-all font-semibold"
        onClick={(e) => e.stopPropagation()}
      >
        {part}
      </a>
    ) : (
      part
    )
  );
};
