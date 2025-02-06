import { useState, useEffect } from "react";
import { Button, Input, InputDate, Select } from "@/components";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/stores/authStore";
import { fetchCategories, registerExpense } from "@/utils";
import { CategoryOption } from "@/types";
import { ToastContainer, toast } from "react-toastify";

const ExpenseForm = () => {
  const userId = useAuthStore((state) => state.user?.id);
  const [options, setOptions] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("ExpenseForm");

  useEffect(() => {
    async function getCategories() {
      setLoading(true);
      let optionsData: CategoryOption[] = [];
      try {
        if (!userId) {
          throw new Error("User not found");
        }
        optionsData = await fetchCategories(userId);
      } catch (error) {
        console.error(error);
        toast.error(
          t("errorFetchingCategories") || "Erro ao buscar categorias"
        );
      } finally {
        setLoading(false);
        setOptions(optionsData);
      }
    }

    if (userId) {
      getCategories();
    }
  }, [userId, t]);

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
      const category = formData.get("category") as string;
      const description = (formData.get("description") as string) || null;
      const date = formData.get("date") as string;
      const installments = formData.get("installments")
        ? parseInt(formData.get("installments") as string, 10)
        : 1;

      const expenseData = {
        user_id: userId,
        name,
        amount,
        category_id: category,
        description,
        date,
        installments,
      };

      await registerExpense(expenseData);
      toast.success("Expense registered successfully");
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.message || "An error occurred while registering the expense"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 border-2 border-yellow-600 rounded-lg"
    >
      {/* Utilizando CSS Grid para dividir o formulário em duas colunas */}
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
            label={t("amount")}
            type="number"
            placeholder={t("amount")}
          />

          <Select name="category" label={t("category")} options={options} />
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

      {/* Botão de submissão centralizado */}
      <div className="mt-6 flex justify-center">
        <Button type="submit" label={t("submit")} loading={loading} />
      </div>
      <ToastContainer />
    </form>
  );
};

export default ExpenseForm;