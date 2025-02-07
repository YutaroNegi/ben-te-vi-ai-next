import { useState, useEffect } from "react";
import { Button, Input, InputDate } from "@/components"; 
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/stores/authStore";
import {
  fetchCategories,
  registerExpense,
  editCategory,
  deleteCategory,
  registerCategory,
} from "@/utils";
import { CategoryOption } from "@/types";
import { ToastContainer, toast } from "react-toastify";

import CustomDropdown, {
  Option,
} from "@/components/CustomDropdown/CustomDropdown";

const ExpenseForm = () => {
  const userId = useAuthStore((state) => state.user?.id);
  const [options, setOptions] = useState<CategoryOption[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Option | null>(null);
  const [loading, setLoading] = useState(false);

  // Hook de traduções
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
        toast.error(t("errorFetchingCategories"));
      } finally {
        setLoading(false);
        setOptions(optionsData);
      }
    }

    if (userId) {
      getCategories();
    }
  }, [userId, t]);

  const refreshCategories = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const updatedOptions = await fetchCategories(userId);
      setOptions(updatedOptions);
    } catch (error) {
      console.error(error);
      toast.error(t("errorFetchingCategories"));
    } finally {
      setLoading(false);
    }
  };

  // Adicionar nova categoria
  const handleAddCategory = async (name: string) => {
    if (!name) return;

    if (!userId) {
      toast.error("User not found");
      return;
    }
    try {
      const payload = {
        user_id: userId,
        name,
        description: "",
      };
      await registerCategory(payload);
      toast.success("Categoria adicionada com sucesso!");
      refreshCategories();
    } catch (error) {
      console.error(error);
      toast.error("Falha ao adicionar categoria");
    }
  };

  // Editar categoria
  const handleEditCategory = async (option: Option, newName: string) => {
    if (!newName) return;

    try {
      await editCategory(option.value, {
        name: newName,
        description: "",
      });
      toast.success("Categoria editada com sucesso!");
      refreshCategories();
    } catch (error) {
      console.error(error);
      toast.error("Falha ao editar categoria");
    }
  };

  // Deletar categoria
  const handleDeleteCategory = async (option: Option) => {
    const id = option.value;
    try {
      await deleteCategory(id);
      toast.success("Categoria deletada com sucesso!");
      refreshCategories();
    } catch (error) {
      console.error(error);
      toast.error("Falha ao deletar categoria");
    }
  };

  // Selecionar uma categoria no dropdown
  const handleSelectCategory = (option: Option) => {
    setSelectedCategory(option);
  };

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

      const expenseData = {
        user_id: userId,
        name,
        amount,
        category_id: selectedCategory.value,
        description,
        date,
        installments,
      };

      await registerExpense(expenseData);
      toast.success("Despesa registrada com sucesso!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao registrar despesa");
    }
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
            options={options}
            onSelectOption={handleSelectCategory}
            onAdd={handleAddCategory}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            // Usamos a chave "placeholderCategory" ou "selectPlaceholder"
            // conforme definido no JSON de tradução
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