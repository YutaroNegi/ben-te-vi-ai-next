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
      className={`px-4 py-2 bg-indigo-800 hover:bg-indigo-900 text-white font-medium rounded transition-colors duration-200 ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;