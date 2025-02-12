import React from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
}

const Select: React.FC<SelectProps> = ({ label, options, ...props }) => {
  return (
    <div className="flex flex-col space-y-1">
      {label && <label className="font-medium text-gray-700">{label}</label>}
      <select
        className="rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 rounded-full"
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
