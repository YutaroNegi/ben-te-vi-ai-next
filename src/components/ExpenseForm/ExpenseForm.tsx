import { useState, useEffect } from "react";
import { Button, Input, InputDate, Select } from "@/components";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/stores/authStore";
import { fetchCategories } from "@/utils";

interface CategoryOption {
  value: string;
  label: string;
}

const ExpenseForm = () => {
  const userId = useAuthStore((state) => state.user?.id);
  const [options, setOptions] = useState<CategoryOption[]>([]);
  const t = useTranslations("ExpenseForm");

  useEffect(() => {
    async function getCategories() {
      let optionsData: CategoryOption[] = [];
      try {
        if (!userId) {
          throw new Error("User not found");
        }
        optionsData = await fetchCategories(userId);
      } catch (error) {
        console.error(error);
      }finally{
        setOptions(optionsData);
      }
    }

    if (userId) {
      getCategories();
    }
  }, []);

  return (
    <form className="flex flex-col border-2 border-yellow-600 w-96 p-4 space-y-4 rounded-lg items-center">
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

      <Button type="submit" label={t("submit")} />
    </form>
  );
};

export default ExpenseForm;
