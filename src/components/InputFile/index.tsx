import React, { useState } from "react";

interface InputFileProps {
  id: string;
  label: string;
  name?: string;
  /** Texto mostrado quando nenhum arquivo foi escolhido  */
  placeholder?: string;
  /** Aceita, por ex.: ".csv,.xlsx"  */
  accept?: string;
  /** Permite múltiplos arquivos  */
  multiple?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  labelTextClassName?: string;
}

const InputFile: React.FC<InputFileProps> = ({
  id,
  label,
  name,
  placeholder = "Escolher arquivo…",
  accept,
  multiple = false,
  onChange,
  className = "",
  inputClassName = "",
  labelClassName = "bg-matcha-dark",
  labelTextClassName = "text-white",
}) => {
  const [isShaking, setIsShaking] = useState(false);
  const [fileLabel, setFileLabel] = useState(placeholder);

  const handleFocus = () => setIsShaking(true);
  const handleAnimationEnd = () => setIsShaking(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const names = Array.from(e.target.files).map((f) => f.name);
      setFileLabel(names.join(", "));
    } else {
      setFileLabel(placeholder);
    }
    onChange?.(e);
  };

  return (
    <>
      <div
        className={`input-wrapper flex items-stretch w-64 rounded-full overflow-hidden border border-gray-300 ${className} text-xs transition-shadow duration-200 ${isShaking ? "shake" : ""}`}
        onAnimationEnd={handleAnimationEnd}
      >
        {/* Label fixa (45 %) */}
        <span
          className={`flex items-center justify-center ${labelClassName} ${labelTextClassName} px-4`}
          style={{ width: "45%" }}
        >
          {label}
        </span>

        {/* Área de seleção de arquivo (55 %) */}
        <label
          htmlFor={id}
          className={`px-4 py-2 flex items-center w-[70%] cursor-pointer ${inputClassName} text-black truncate`}
          onFocus={handleFocus}
        >
          {fileLabel}
        </label>

        {/* Input file invisível */}
        <input
          id={id}
          name={name}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleChange}
          onFocus={handleFocus}
        />
      </div>

      {/* estilos globais iguais ao Input base */}
      <style jsx global>{`
        @keyframes nudge {
          0% {
            transform: translateX(0);
          }
          40% {
            transform: translateX(2px);
          }
          80% {
            transform: translateX(-1px);
          }
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

export default InputFile;
