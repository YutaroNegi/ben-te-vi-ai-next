import React from "react";

interface InputDateProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const InputDate: React.FC<InputDateProps> = ({ label, ...props }) => {
  return (
    <div className="flex items-stretch w-64 rounded-full overflow-hidden border border-gray-300">
      {label && (
        <span
          className="flex items-center justify-center bg-matcha-900 text-white px-4"
          style={{ width: "30%" }}
        >
          {label}
        </span>
      )}
      <input
        type="date"
        className={`px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
          label ? "w-[70%]" : "w-full"
        }`}
        {...props}
      />
    </div>
  );
};

export default InputDate;