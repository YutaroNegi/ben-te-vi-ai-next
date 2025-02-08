"use client";

import React from "react";

interface TableProps {
  title: string;
  headers: React.ReactNode[];
  rows: React.ReactNode[][];
}

const Table: React.FC<TableProps> = ({ title, headers, rows }) => {
  return (
    <div className="my-4 shadow-lg rounded">
      <h2 className="bg-matcha-900 text-white text-base font-bold p-2">
        {title}
      </h2>
      <table className="min-w-full border-collapse">
        <thead className="bg-matcha-800">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="border p-1 text-white text-sm">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-almond-900">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border p-1 text-black text-sm">
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