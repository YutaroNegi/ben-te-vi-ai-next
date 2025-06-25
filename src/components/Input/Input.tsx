import React, { useState } from "react";
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
  const [isShaking, setIsShaking] = useState(false);

  const handleFocus = () => setIsShaking(true);
  const handleAnimationEnd = () => setIsShaking(false);

  return (
    <>
      <div
        className={`input-wrapper flex items-stretch w-64 rounded-full overflow-hidden border border-gray-300 ${className} text-xs transition-shadow duration-200 ${isShaking ? "shake" : ""}`}
        onAnimationEnd={handleAnimationEnd}
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
            onFocus={handleFocus}
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
            onFocus={handleFocus}
          />
        )}
      </div>
      <style jsx global>{`
        @keyframes nudge {
          0% {
            transform: translateX(0);
          }
          40% {
            transform: translateX(2px);
          } /* suave para a direita */
          80% {
            transform: translateX(-1px);
          } /* leve compensação para a esquerda */
          100% {
            transform: translateX(0);
          }
        }
        .shake {
          animation: nudge 0.18s ease-out both;
        }
        .input-wrapper:focus-within {
          box-shadow: 0 0 18px rgba(129, 149, 112, 0.45);
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }
      `}</style>
    </>
  );
};

export default Input;
