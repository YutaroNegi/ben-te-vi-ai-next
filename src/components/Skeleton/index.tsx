// components/Skeleton.jsx
import React from "react";
import "./Skeleton.css"; // Import your CSS styles for the skeleton

/**
 * Exibe placeholders animados em tons de cinza enquanto
 * o conteúdo real não é carregado.
 *
 * @param {number} lines  Quantas linhas (barras) exibir.
 * @param {boolean} circle Se true, mostra um avatar circular acima das linhas.
 */
export default function Skeleton({ lines = 3, circle = false }) {
  return (
    <div role="status" className="animate-pulse space-y-4">
      {circle && (
        <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-full" />
      )}

      {Array.from({ length: lines }).map((_, idx) => (
        <div
          key={idx}
          className="h-4 w-full rounded bg-gray-300 dark:bg-gray-700"
        />
      ))}
      <span className="sr-only">Carregando…</span>
    </div>
  );
}
