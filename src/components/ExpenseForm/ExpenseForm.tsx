"use client";

import { useState, useEffect } from "react";
import { Button, Input, InputDate } from "@/components";
import CustomDropdown, {
  Option,
} from "@/components/CustomDropdown/CustomDropdown";
import { useAuthStore } from "@/stores/authStore";
import { useExpensesStore } from "@/stores/expenseStore";
import { registerExpense } from "@/utils";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

const ExpenseForm = () => {
  const t = useTranslations("ExpenseForm");
  const tApi = useTranslations("Api");

  const userId = useAuthStore((state) => state.user?.id);
  const {
    categories,
    fetchCategories,
    addCategory,
    updateCategory,
    removeCategory,
    selectedDate,
    fetchInstallments,
  } = useExpensesStore();

  const [selectedCategory, setSelectedCategory] = useState<Option | null>(null);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchCategories(userId).catch((err) => {
        console.error(err);
        toast.error(t("errorFetchingCategories"));
      });
    }
  }, [userId, fetchCategories, t]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId) {
      toast.error(t("userNotFound"));
      return;
    }

    try {
      setLocalLoading(true);
      const formData = new FormData(e.currentTarget);

      const rawAmount = formData.get("amount") as string;

      const cleanedAmount = rawAmount.replace(/\./g, "").replace(",", ".");
      const amount = parseFloat(cleanedAmount);

      const name = formData.get("name") as string;
      const description = (formData.get("description") as string) || null;
      const date = formData.get("date") as string;
      const installments = formData.get("installments")
        ? parseInt(formData.get("installments") as string, 10)
        : 1;

      if (!selectedCategory) {
        toast.error(t("selectCategoryBeforeSubmit"));
        return;
      }

      await registerExpense({
        user_id: userId,
        name,
        amount,
        category_id: selectedCategory.value,
        description,
        date,
        installments,
      });

      toast.success(t("expenseRegisteredSuccess"));

      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const startDate = new Date(year, month, 1).toISOString();
      const endDate = new Date(year, month + 1, 1).toISOString();

      await fetchInstallments(userId, startDate, endDate);
    } catch (error) {
      console.error(error);
      toast.error(tApi("errorSavingExpense"));
    } finally {
      setLocalLoading(false);
    }
  };

  const handleAddCategory = async (name: string): Promise<Option | void> => {
    if (!name) return;
    if (!userId) {
      toast.error(t("userNotFound"));
      throw new Error(t("userNotFound"));
    }
    try {
      await addCategory(userId, name);
      const newOption = { value: userId, label: name };
      toast.success(t("categoryAddSuccess"));
      return newOption;
    } catch (error) {
      console.error(error);
      toast.error(t("categoryAddFail"));
      throw error;
    }
  };

  const handleEditCategory = async (option: Option, newName: string) => {
    if (!newName) return;
    try {
      await updateCategory(option.value, { name: newName, description: "" });
      toast.success(t("categoryEditSuccess"));
    } catch (error) {
      console.error(error);
      toast.error(t("categoryEditFail"));
    }
  };

  const handleDeleteCategory = async (option: Option) => {
    try {
      await removeCategory(option.value);
      toast.success(t("categoryDeleteSuccess"));
    } catch (error) {
      console.error(error);
      toast.error(t("categoryDeleteFail"));
    }
  };

  const handleSelectCategory = (option: Option) => {
    setSelectedCategory(option);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-2 rounded-lg text-sm flex flex-col gap-2 items-center w-80 mx-auto"
    >
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
        maskMilharBr={true}
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
      <Button type="submit" label={t("submit")} loading={localLoading} />
    </form>
  );
};

export default ExpenseForm;
