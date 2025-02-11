import React from "react";
import { NumericFormat, NumberFormatValues } from "react-number-format";

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
  labelClassName?: string;
  labelTextClassName?: string;
  maskMilharBr?: boolean;
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
  labelClassName = "bg-matcha-900",
  labelTextClassName = "text-white",
  step,
  name,
  maskMilharBr = false,
}) => {
  return (
    <div
      className={`flex items-stretch w-64 rounded-full overflow-hidden border border-gray-300 ${className} text-xs`}
    >
      {/* Label ocupando 30% da largura */}
      <span
        className={`flex items-center justify-center ${labelClassName} ${labelTextClassName} px-5`}
        style={{ width: "30%" }}
      >
        {label}
      </span>
      {maskMilharBr ? (
        <NumericFormat
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          thousandSeparator="."
          decimalSeparator=","
          // onValueChange recebe um objeto com os valores formatados e brutos.
          // Aqui criamos um evento sintético para manter a assinatura do onChange.
          onValueChange={(values: NumberFormatValues) => {
            const syntheticEvent = {
              target: {
                id,
                name,
                value: values.formattedValue,
              },
            } as React.ChangeEvent<HTMLInputElement>;
            onChange && onChange(syntheticEvent);
          }}
          {...(step ? { step } : {})}
          className={`px-4 py-2 outline-none w-[70%] ${inputClassName} text-black`}
        />
      ) : (
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
      )}
    </div>
  );
};

export default Input;