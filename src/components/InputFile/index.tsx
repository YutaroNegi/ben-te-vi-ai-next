"use client";

import React, { useRef, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";

type Props = {
  id: string;
  label?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFiles?: (files: FileList) => void;
};

const InputFile: React.FC<Props> = ({
  id,
  label = "Selecione ou arraste o arquivo",
  accept,
  multiple = false,
  disabled = false,
  className = "",
  onChange,
  onFiles,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onFiles && e.target.files) onFiles(e.target.files);
    onChange?.(e);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length) {
      onFiles?.(files);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={openPicker}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openPicker()}
      onDragOver={(e) => {
        e.preventDefault();
        if (!dragOver) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={[
        "flex items-center gap-3 rounded-lg border-2 border-solid px-4 py-3 cursor-pointer select-none transition text-chocolate-950",
        dragOver
          ? "bg-matcha-800 border-matcha-dark"
          : "bg-almond-900 border-matcha-light",
        disabled ? "opacity-60 pointer-events-none" : "hover:bg-matcha-900",
        className,
      ].join(" ")}
      aria-disabled={disabled}
    >
      <FaCloudUploadAlt className="text-2xl" aria-hidden />
      <span className="text-sm font-medium">{label}</span>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
};

export default InputFile;
