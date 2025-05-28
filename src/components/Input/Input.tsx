import React from "react";
import { NumericFormat, NumberFormatValues } from "react-number-format";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  /** Valor inicial não controlado */
  initialValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  inputClassName?: string;
  step?: string;
  labelClassName?: string;
  labelTextClassName?: string;
  /** Ativa máscara de milhar no padrão brasileiro */
  maskMilharBr?: boolean;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  initialValue,
  onChange,
  className = "",
  inputClassName = "",
  labelClassName = "bg-matcha-dark",
  labelTextClassName = "text-white",
  step,
  name,
  maskMilharBr = false,
}) => {
  return (
    <div
      className={`flex items-stretch w-64 rounded-full overflow-hidden border border-gray-300 ${className} text-xs`}
    >
      <span
        className={`flex items-center justify-center ${labelClassName} ${labelTextClassName} px-4`}
        style={{ width: "45%" }}
      >
        {label}
      </span>
      {maskMilharBr ? (
        <NumericFormat
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          defaultValue={initialValue}
          thousandSeparator="."
          decimalSeparator=","
          onValueChange={(values: NumberFormatValues) => {
            const syntheticEvent = {
              target: {
                id,
                name,
                value: values.floatValue,
              },
            };
            if (onChange) {
              onChange(
                syntheticEvent as unknown as React.ChangeEvent<HTMLInputElement>,
              );
            }
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
          defaultValue={initialValue}
          onChange={onChange}
          step={step}
          className={`px-4 py-2 outline-none w-[70%] ${inputClassName} text-black`}
        />
      )}
    </div>
  );
};

export default Input;
