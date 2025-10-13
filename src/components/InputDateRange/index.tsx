import React, { useRef } from "react";

interface InputDateRangeProps {
  label?: string;
  labelClassName?: string;
  startValue?: string;
  endValue?: string;
  initialStartValue?: string;
  initialEndValue?: string;
  onChangeRange?: (range: { start?: string; end?: string }) => void;
  startProps?: React.InputHTMLAttributes<HTMLInputElement>;
  endProps?: React.InputHTMLAttributes<HTMLInputElement>;
  className?: string;
}

const InputDateRange: React.FC<InputDateRangeProps> = ({
  label,
  labelClassName = "bg-matcha-dark",
  startValue,
  endValue,
  initialStartValue,
  initialEndValue,
  onChangeRange,
  startProps,
  endProps,
  className = "min-w-[26rem]", // dá folga padrão: ~416px
}) => {
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  const notify = () => {
    onChangeRange?.({
      start: startRef.current?.value,
      end: endRef.current?.value,
    });
  };

  return (
    <div
      className={`flex items-stretch rounded-full overflow-hidden border border-gray-300 text-xs ${className}`}
    >
      {label && (
        <span
          className={`flex items-center justify-center text-white px-4 whitespace-nowrap flex-shrink-0 ${labelClassName}`}
        >
          {label}
        </span>
      )}

      <input
        ref={startRef}
        type="date"
        className={[
          "px-4 py-2 border-l focus:outline-none focus:ring-2 focus:ring-blue-500 text-black",
          "flex-1 min-w-[12ch] pr-8 text-sm", // 12ch garante espaço para YYYY-MM-DD + ícone
        ].join(" ")}
        {...(startValue !== undefined
          ? { value: startValue }
          : { defaultValue: initialStartValue })}
        onChange={(e) => {
          startProps?.onChange?.(e);
          notify();
        }}
        {...startProps}
      />

      <input
        ref={endRef}
        type="date"
        className={[
          "px-4 py-2 border-l focus:outline-none focus:ring-2 focus:ring-blue-500 text-black",
          "flex-1 min-w-[12ch] pr-8 text-sm",
        ].join(" ")}
        {...(endValue !== undefined
          ? { value: endValue }
          : { defaultValue: initialEndValue })}
        onChange={(e) => {
          endProps?.onChange?.(e);
          notify();
        }}
        {...endProps}
      />
    </div>
  );
};

export default InputDateRange;
