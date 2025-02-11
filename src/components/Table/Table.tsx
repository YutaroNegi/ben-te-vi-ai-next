"use client";

import React from "react";

interface TableProps {
  title: string;
  headers: React.ReactNode[];
  rows: React.ReactNode[][];
  columnWidths?: string[];
}

const Table: React.FC<TableProps> = ({
  title,
  headers,
  rows,
  columnWidths,
}) => {
  return (
    // Adicionamos overflow-hidden para garantir que os cantos arredondados não sejam “vazados”
    <div className="my-4 shadow-lg rounded overflow-hidden">
      <h2 className="bg-matcha-900 text-white text-sm font-bold p-2">
        {title}
      </h2>
      <table className="min-w-full border-separate border-spacing-0">
        <thead className="bg-matcha-800">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                style={{ width: columnWidths?.[index] }}
                className={`
                  p-2 text-white text-xs text-center
                `}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-almond-900">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  style={{ width: columnWidths?.[cellIndex] }}
                  className={`
                    border p-2 text-black text-xs text-clip
                    ${rowIndex === rows.length - 1 && cellIndex === 0 ? "rounded-bl-lg" : ""}
                    ${rowIndex === rows.length - 1 && cellIndex === row.length - 1 ? "rounded-br-lg" : ""}
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
  );
};

export default Table;