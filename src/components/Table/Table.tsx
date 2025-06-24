"use client";

import React, { useEffect } from "react";
import "./Table.css";

interface TableProps {
  title: string;
  headers: React.ReactNode[];
  rows: React.ReactNode[][];
  columnWidths?: string[];
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  className?: string;
  rowClasses?: string[];
  scrollable?: boolean;
  maxHeight?: string;
}

const Table: React.FC<TableProps> = ({
  title,
  headers,
  rows,
  columnWidths,
  openMenuId,
  setOpenMenuId,
  className = "",
  rowClasses,
  scrollable = false,
  maxHeight = "",
}) => {
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      // If a menu is open and the click is outside the button or menu for that openMenuId, close the menu
      if (
        openMenuId &&
        !target.closest(`#menu-container-${openMenuId}`) &&
        !target.closest(`#toggle-button-${openMenuId}`)
      ) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [openMenuId, setOpenMenuId]);

  return (
    // Adicionamos overflow-hidden para garantir que os cantos arredondados não sejam “vazados”
    <div
      className={`my-4 shadow-lg rounded mb-[50px] bg-almond-900 ${className}`}
    >
      <h2 className="bg-matcha-light text-white text-sm font-bold p-2 text-center rounded-tl-lg rounded-tr-lg">
        {title}
      </h2>

      {/* Área de scroll */}
      <div
        className={`${scrollable ? `scrollbar-custom overflow-y-auto ${maxHeight}` : ""}`}
      >
        <table className="min-w-full border-separate border-spacing-0">
          <thead className="bg-matcha-lighter sticky top-0 z-10">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  style={{ width: columnWidths?.[index] }}
                  className="p-2 text-white text-xs text-center bg-matcha-lighter"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-almond-900">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowClasses?.[rowIndex] ?? ""}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    style={{ width: columnWidths?.[cellIndex] }}
                    className={`
                  border p-2 text-black text-xs text-clip
                  ${
                    rowIndex === rows.length - 1 && cellIndex === 0
                      ? "rounded-bl-lg"
                      : ""
                  }
                  ${
                    rowIndex === rows.length - 1 && cellIndex === row.length - 1
                      ? "rounded-br-lg"
                      : ""
                  }
                `}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
