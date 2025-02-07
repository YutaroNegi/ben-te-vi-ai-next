import React, { useState, useRef, useEffect } from 'react';
import { FaEllipsisV, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export interface Option {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  label?: string;
  options: Option[];
  onSelectOption?: (option: Option) => void;
  onAdd?: () => void;
  onEdit?: (option: Option) => void;
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
  placeholder = 'Selecione...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectOption = (option: Option) => {
    setSelected(option);
    setIsOpen(false);
    if (onSelectOption) onSelectOption(option);
  };

  const handleAddClick = () => {
    if (onAdd) onAdd();
    setIsOpen(false);
  };

  const handleEditClick = (option: Option) => {
    if (onEdit) onEdit(option);
  };

  const handleDeleteClick = (option: Option) => {
    if (onDelete) onDelete(option);
  };

  return (
    <div className="flex flex-col space-y-1 w-64" ref={dropdownRef}>
      {label && <label className="font-medium text-gray-700">{label}</label>}

      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="cursor-pointer relative flex justify-between items-center px-4 py-2 border border-gray-300 rounded-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {selected ? selected.label : placeholder}
        <span className="ml-2 text-gray-500">▼</span>
      </div>

      {isOpen && (
        <div className="relative">
          <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1">
            <div
              className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={handleAddClick}
            >
              <span className="text-gray-700 font-medium">Adicionar novo</span>
              <FaPlus className="text-gray-600 ml-2" />
            </div>

            <hr className="my-1" />

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
                <div className="relative">
                  <div className="cursor-pointer p-1 ml-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                    <FaEllipsisV />
                  </div>
                  <div className="hidden group-hover:block absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg">
                    <div
                      className="cursor-pointer flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                      onClick={() => handleEditClick(option)}
                    >
                      <FaEdit className="mr-2" />
                      Editar
                    </div>
                    <div
                      className="cursor-pointer flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                      onClick={() => handleDeleteClick(option)}
                    >
                      <FaTrash className="mr-2" />
                      Deletar
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
