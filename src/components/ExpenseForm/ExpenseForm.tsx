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
      toast.error(t("userNotFound")); // New translation key: "userNotFound"
      return;
    }

    try {
      setLocalLoading(true);
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const amount = parseFloat(formData.get("amount") as string);
      const description = (formData.get("description") as string) || null;
      const date = formData.get("date") as string;
      const installments = formData.get("installments")
        ? parseInt(formData.get("installments") as string, 10)
        : 1;

      if (!selectedCategory) {
        toast.error(t("selectCategoryBeforeSubmit")); // New key
        return;
      }

      // 1) Register the expense
      await registerExpense({
        user_id: userId,
        name,
        amount,
        category_id: selectedCategory.value,
        description,
        date,
        installments,
      });

      toast.success(t("expenseRegisteredSuccess")); // New key

      // 2) Fetch installments for the current month
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const startDate = new Date(year, month, 1).toISOString();
      const endDate = new Date(year, month + 1, 1).toISOString();

      await fetchInstallments(userId, startDate, endDate);
    } catch (error) {
      console.error(error);
      toast.error(tApi("errorSavingExpense")); // From the "Api" namespace
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
      toast.success(t("categoryAddSuccess")); // New key
      return newOption;
    } catch (error) {
      console.error(error);
      toast.error(t("categoryAddFail")); // New key
      throw error;
    }
  };

  const handleEditCategory = async (option: Option, newName: string) => {
    if (!newName) return;
    try {
      await updateCategory(option.value, { name: newName, description: "" });
      toast.success(t("categoryEditSuccess")); // New key
    } catch (error) {
      console.error(error);
      toast.error(t("categoryEditFail")); // New key
    }
  };

  const handleDeleteCategory = async (option: Option) => {
    try {
      await removeCategory(option.value);
      toast.success(t("categoryDeleteSuccess")); // New key
    } catch (error) {
      console.error(error);
      toast.error(t("categoryDeleteFail")); // New key
    }
  };

  const handleSelectCategory = (option: Option) => {
    setSelectedCategory(option);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl m-0 p-5 border-2 border-chocolate-800 rounded-lg text-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Column 1 */}
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

        {/* Column 2 */}
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

      <div className="mt-4 flex justify-center">
        <Button type="submit" label={t("submit")} loading={localLoading} />
      </div>
    </form>
  );
};

export default ExpenseForm;
