import React from "react";

interface InputDateProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassName?: string;
  initialValue?: string;
}

const InputDate: React.FC<InputDateProps> = ({
  label,
  labelClassName = "bg-matcha-dark",
  initialValue,
  ...props
}) => {
  return (
    <div className="flex items-stretch w-64 rounded-full overflow-hidden border border-gray-300 text-xs">
      {label && (
        <span
          className={`flex items-center justify-center text-white px-4 ${labelClassName}`}
          style={{ width: "45%" }}
        >
          {label}
        </span>
      )}
      <input
        type="date"
        className={`px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
          label ? "w-[70%]" : "w-full"
        }`}
        defaultValue={initialValue}
        {...props}
      />
    </div>
  );
};

export default InputDate;
