import React from "react";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  inputClassName?: string;
  step?: string;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  inputClassName = "",
  step,
  name,
}) => {
  return (
    <div
      className={`flex items-stretch w-64 rounded-full overflow-hidden border border-gray-300 ${className}`}
    >
      {/* Label integrado ocupando 30% da largura */}
      <span
        className="flex items-center justify-center bg-matcha-900 text-white px-5"
        style={{ width: "30%" }}
      >
        {label}
      </span>
      {/* Input ocupando os 70% restantes */}
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        step={step}
        className={`px-4 py-2 outline-none w-[70%] ${inputClassName} text-black`}
      />
    </div>
  );
};

export default Input;