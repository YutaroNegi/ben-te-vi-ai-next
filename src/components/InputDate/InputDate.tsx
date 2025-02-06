import React from "react";

interface InputDateProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const InputDate: React.FC<InputDateProps> = ({ label, ...props }) => {
  return (
    <div className="flex flex-col space-y-1">
      {label && <label className="font-medium text-gray-700">{label}</label>}
      <input
        type="date"
        className="rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 rounded-full"
        {...props}
      />
    </div>
  );
};

export default InputDate;
