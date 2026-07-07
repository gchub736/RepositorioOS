"use client";
import { useEffect, useState } from "react";
import { Ordem } from "../types";

interface Params {
  ordens: Ordem[];
  bloqueado: boolean; // true quando um modal/preview está aberto
  onAbrir: (os: Ordem) => void;
  onEscape: () => void;
}

// Modo de navegação por teclado da tabela (tecla M para ligar; ↑/↓/W/S movem; Enter abre;
// Esc fecha modais/sai). Desativado enquanto um modal está aberto.
export function useNavegacaoTeclado({ ordens, bloqueado, onAbrir, onEscape }: Params) {
  const [navMode, setNavMode] = useState(false);
  const [navIndex, setNavIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;

      if (event.key === "Escape") {
        onEscape();
        setNavMode(false);
      }

      if ((event.key === "m" || event.key === "M") && !bloqueado) {
        if (navMode) {
          setNavMode(false);
        } else {
          setNavMode(true);
          setNavIndex(0);
        }
        event.preventDefault();
        return;
      }

      if (navMode && !bloqueado) {
        if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") {
          setNavIndex((prev) => Math.min(prev + 1, ordens.length - 1));
          event.preventDefault();
        } else if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
          setNavIndex((prev) => Math.max(prev - 1, 0));
          event.preventDefault();
        } else if (event.key === "Enter") {
          if (ordens[navIndex]) {
            onAbrir(ordens[navIndex]);
          }
          event.preventDefault();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [navMode, navIndex, ordens, bloqueado, onAbrir, onEscape]);

  return { navMode, navIndex, setNavMode };
}
