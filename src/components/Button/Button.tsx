import React from "react";
import { LoadingSpinner } from "@/components";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = "button",
  className = "",
  loading = false,
}) => {
  return (
    <button
      type={type}
      onClick={!loading ? onClick : undefined}
      disabled={loading}
      className={`flex items-center justify-center px-4 py-2 bg-bentenavi-dark hover:bg-bentenavi-dark text-white font-medium rounded-full transition-colors duration-200 ${className} w-32`}
    >
      {loading ? <LoadingSpinner /> : label}
    </button>
  );
};

export default Button;
