import React from "react";
import Image from "next/image";

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
      className={`flex items-center justify-center px-4 py-2 bg-sky-800 hover:bg-sky-950 text-white font-medium rounded transition-colors duration-200 ${className} w-64`}
    >
      {loading ? (
        <Image
          src="/loading.svg"
          alt="Loading"
          width={20}
          height={20}
          className="h-5 w-5 animate-spin"
        />
      ) : (
        label
      )}
    </button>
  );
};

export default Button;