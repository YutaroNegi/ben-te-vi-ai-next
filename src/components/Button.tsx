import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = 'button',
  className = '',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 bg-sky-800 hover:bg-sky-950 text-white font-medium rounded transition-colors duration-200 ${className} w-64`}
    >
      {label}
    </button>
  );
};

export default Button;