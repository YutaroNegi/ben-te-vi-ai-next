"use client";

import { useState, useEffect } from "react";
import { Button, Input, InputDate } from "@/components";
import CustomDropdown, {
  Option,
} from "@/components/CustomDropdown/CustomDropdown";
import { useAuthStore } from "@/stores/authStore";
import { useExpensesStore } from "@/stores/expenseStore"; // <--- Importamos a store
import { registerExpense } from "@/utils";
import { CategoryOption } from "@/types";
import { ToastContainer, toast } from "react-toastify";
import { useTranslations } from "next-intl";

const ExpenseForm = () => {
  const userId = useAuthStore((state) => state.user?.id);
  const t = useTranslations("ExpenseForm");

  // Store
  const {
    categories,
    fetchCategories,
    addCategory,
    updateCategory,
    removeCategory,

    // Precisamos também do selectedDate e do fetchInstallments
    selectedDate,
    fetchInstallments,
    loading,
  } = useExpensesStore();

  const [selectedCategory, setSelectedCategory] = useState<Option | null>(null);

  useEffect(() => {
    if (userId) {
      fetchCategories(userId).catch((err) => {
        console.error(err);
        toast.error(t("errorFetchingCategories"));
      });
    }
  }, [userId, fetchCategories, t]);

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      toast.error("User not found");
      return;
    }

    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const amount = parseFloat(formData.get("amount") as string);
      const description = (formData.get("description") as string) || null;
      const date = formData.get("date") as string;
      const installments = formData.get("installments")
        ? parseInt(formData.get("installments") as string, 10)
        : 1;

      if (!selectedCategory) {
        toast.error("Selecione uma categoria antes de enviar!");
        return;
      }

      // 1) Registrar despesa
      await registerExpense({
        user_id: userId,
        name,
        amount,
        category_id: selectedCategory.value,
        description,
        date,
        installments,
      });

      toast.success("Despesa registrada com sucesso!");

      // 2) Chamamos fetchInstallments p/ recarregar a listagem
      //    do mesmo mês que o ViewExpenses está mostrando:
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const startDate = new Date(year, month, 1).toISOString();
      const endDate = new Date(year, month + 1, 1).toISOString();

      await fetchInstallments(userId, startDate, endDate);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao registrar despesa");
    }
  };

  // Resto do formulário...
  const handleAddCategory = async (name: string) => {
    if (!name) return;
    if (!userId) {
      toast.error("User not found");
      return;
    }
    try {
      await addCategory(userId, name);
      toast.success("Categoria adicionada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Falha ao adicionar categoria");
    }
  };

  const handleEditCategory = async (option: Option, newName: string) => {
    if (!newName) return;
    try {
      await updateCategory(option.value, { name: newName, description: "" });
      toast.success("Categoria editada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Falha ao editar categoria");
    }
  };

  const handleDeleteCategory = async (option: Option) => {
    try {
      await removeCategory(option.value);
      toast.success("Categoria deletada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Falha ao deletar categoria");
    }
  };

  const handleSelectCategory = (option: Option) => {
    setSelectedCategory(option);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 border-2 border-yellow-600 rounded-lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coluna 1 */}
        <div className="flex flex-col space-y-4">
          <Input
            id="name"
            name="name"
            label={t("name")}
            type="text"
            placeholder={t("name")}
          />
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            label={t("amount")}
            placeholder={t("amount")}
          />

          <CustomDropdown
            label={t("category")}
            options={categories}
            onSelectOption={handleSelectCategory}
            onAdd={handleAddCategory}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            placeholder={t("placeholderCategory")}
          />
        </div>

        {/* Coluna 2 */}
        <div className="flex flex-col space-y-4">
          <Input
            id="description"
            name="description"
            label={t("description")}
            type="text"
            placeholder={t("description")}
          />
          <InputDate
            id="date"
            name="date"
            label={t("date")}
            type="date"
            placeholder={t("date")}
          />
          <Input
            id="installments"
            name="installments"
            label={t("installments")}
            type="number"
            placeholder={t("installments")}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Button type="submit" label={t("submit")} loading={loading} />
      </div>
      <ToastContainer />
    </form>
  );
};

export default ExpenseForm;
