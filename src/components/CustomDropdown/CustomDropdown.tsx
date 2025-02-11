import React, { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  FaEllipsisV,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

export interface Option {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  label?: string;
  options: Option[];
  onSelectOption?: (option: Option) => void;
  onAdd?: (newName: string) => Promise<Option | void>;
  onEdit?: (option: Option, newName: string) => void;
  onDelete?: (option: Option) => void;
  placeholder?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  options,
  onSelectOption,
  onAdd,
  onEdit,
  onDelete,
  placeholder = "Selecione...",
}) => {
  const t = useTranslations("ExpenseForm");

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editOption, setEditOption] = useState<Option | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsAdding(false);
        setIsEditing(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectOption = (option: Option) => {
    setSelected(option);
    setIsOpen(false);
    if (onSelectOption) onSelectOption(option);
  };

  // Inicia o fluxo para adicionar nova categoria
  const handleStartAdd = () => {
    setIsAdding(true);
    setIsEditing(false);
    setNewCategoryName("");
  };

  // Confirma a adição
  const handleConfirmAdd = async () => {
    if (onAdd && newCategoryName.trim() !== "") {
      const newOption = await onAdd(newCategoryName.trim());
      if (newOption) {
        setSelected(newOption);
        if (onSelectOption) onSelectOption(newOption);
      }
    }
    setNewCategoryName("");
    setIsAdding(false);
    setIsOpen(false);
  };

  const handleCancelAdd = () => {
    setNewCategoryName("");
    setIsAdding(false);
  };

  // Inicia o fluxo para editar uma categoria
  const handleStartEdit = (option: Option) => {
    setIsEditing(true);
    setIsAdding(false);
    setEditOption(option);
    setEditCategoryName(option.label);
  };

  // Confirma edição
  const handleConfirmEdit = () => {
    if (onEdit && editOption && editCategoryName.trim() !== "") {
      onEdit(editOption, editCategoryName.trim());
    }
    setIsEditing(false);
    setIsOpen(false);
    setEditCategoryName("");
    setEditOption(null);
  };

  // Cancela edição
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditCategoryName("");
    setEditOption(null);
  };

  const handleDeleteClick = (option: Option) => {
    if (onDelete) onDelete(option);
    setIsOpen(false);
  };

  return (
    <div className="w-64 relative text-xs" ref={dropdownRef}>
      {/* Dropdown integrado com label */}
      <div
        onClick={() => {
          if (!isAdding && !isEditing) {
            setIsOpen((prev) => !prev);
          }
        }}
        className="cursor-pointer relative flex items-center border border-gray-300 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 bg-matcha-900"
      >
        {label && (
          <span
            className="flex items-center justify-center text-white px-4"
            style={{ width: "30%" }}
          >
            {label}
          </span>
        )}
        <div
          className={`flex items-center justify-between px-4 py-2 bg-white ${
            label ? "w-[70%]" : "w-full"
          } text-left`}
        >
          <span>{selected ? selected.label : placeholder}</span>
          <span className="ml-2 text-gray-500">▼</span>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1">
          {/* Se estamos adicionando */}
          {isAdding ? (
            <div className="flex items-center px-4 py-2 border-b border-gray-200">
              <input
                type="text"
                className="flex-grow border rounded px-2 py-1 mr-2"
                placeholder={t("newCategoryNamePlaceholder")}
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Impede o submit do formulário
                    handleConfirmAdd();
                  }
                }}
              />
              <button
                type="button"
                className="text-green-600 mr-2"
                onClick={handleConfirmAdd}
              >
                <FaCheck />
              </button>
              <button
                type="button"
                className="text-red-600"
                onClick={handleCancelAdd}
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <div
              className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={handleStartAdd}
            >
              <span className="text-gray-700 font-medium">{t("addNew")}</span>
              <FaPlus className="text-gray-600 ml-2" />
            </div>
          )}

          <hr className="my-1" />

          {/* Se estamos editando */}
          {isEditing && editOption && (
            <div className="flex items-center px-4 py-2 border-b border-gray-200 bg-gray-50">
              <input
                type="text"
                className="flex-grow border rounded px-2 py-1 mr-2"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Impede o submit do formulário
                    handleConfirmEdit();
                  }
                }}
              />
              <button
                type="button"
                className="text-green-600 mr-2"
                onClick={handleConfirmEdit}
              >
                <FaCheck />
              </button>
              <button
                type="button"
                className="text-red-600"
                onClick={handleCancelEdit}
              >
                <FaTimes />
              </button>
            </div>
          )}

          {/* Lista de opções */}
          {options.map((option) => (
            <div
              key={option.value}
              className="group flex items-center justify-between px-4 py-2 hover:bg-gray-100"
            >
              <div
                className="cursor-pointer text-gray-700 text-left w-full"
                onClick={() => handleSelectOption(option)}
              >
                {option.label}
              </div>

              {/* Ícone de menu (3 pontinhos) */}
              <div className="relative flex items-center">
                <div className="cursor-pointer p-1 ml-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                  <FaEllipsisV />
                </div>

                <div className="hidden group-hover:flex flex-col absolute top-0 left-full ml-2 bg-white border border-gray-200 rounded shadow-lg z-20">
                  <div
                    className="cursor-pointer flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                    onClick={() => handleStartEdit(option)}
                  >
                    <FaEdit className="mr-2" />
                    {t("edit")}
                  </div>
                  <div
                    className="cursor-pointer flex items-center px-4 py-2 text-xs text-red-600 hover:bg-gray-100"
                    onClick={() => handleDeleteClick(option)}
                  >
                    <FaTrash className="mr-2" />
                    {t("delete")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
