'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Table } from '@/components';
import { fetchInstallmentsByUserAndDate } from '@/utils';
import { Category, Installment } from '@/types'

const InstallmentTable = ({
  category,
  installments,
}: {
  category: Category;
  installments: Installment[];
}) => {
  const headers = ['Despesa', 'Parcela', 'Valor', 'Vencimento'];
  const rows = installments.map((inst) => [
    inst.expense?.name || '',
    inst.installment_number.toString(),
    inst.amount.toFixed(2),
    new Date(inst.due_date).toLocaleDateString(),
  ]);

  return <Table title={category.name} headers={headers} rows={rows} />;
};

const ViewExpenses = () => {
  const userId = useAuthStore((state) => state.user?.id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [installmentsByCategory, setInstallmentsByCategory] = useState<Record<string, Installment[]>>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/categories/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao buscar categorias:', error);
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth(); // mês (0-indexado)
    const startDate = new Date(year, month, 1).toISOString();
    const endDate = new Date(year, month + 1, 1).toISOString();

    setLoading(true);
    fetchInstallmentsByUserAndDate(userId, startDate, endDate)
      .then((grouped) => {
        setInstallmentsByCategory(grouped);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [userId, selectedDate]);

  const handlePrevMonth = () => {
    setSelectedDate((prevDate) => {
      const year = prevDate.getFullYear();
      const month = prevDate.getMonth();
      return new Date(year, month - 1, 1);
    });
  };

  const handleNextMonth = () => {
    setSelectedDate((prevDate) => {
      const year = prevDate.getFullYear();
      const month = prevDate.getMonth();
      return new Date(year, month + 1, 1);
    });
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 bg-gray-300 rounded-l hover:bg-gray-400 transition-colors"
        >
          &#8592;
        </button>
        <div className="px-4 py-2 bg-gray-200">
          {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </div>
        <button
          onClick={handleNextMonth}
          className="p-2 bg-gray-300 rounded-r hover:bg-gray-400 transition-colors"
        >
          &#8594;
        </button>
      </div>

      {loading && <p className="text-center">Carregando...</p>}

      <div className="flex space-x-4 overflow-x-auto">
        {categories.map((category) => (
          <InstallmentTable
            key={category.id}
            category={category}
            installments={installmentsByCategory[category.id] || []}
          />
        ))}
      </div>
    </div>
  );
};

export default ViewExpenses;