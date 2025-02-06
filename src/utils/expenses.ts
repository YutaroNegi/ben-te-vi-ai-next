import { CategoryOption } from "@/types";

export async function fetchCategories(userId: string) {
  try {
    const res = await fetch(`/api/categories/user/${userId}`);
    if (!res.ok) {
      throw new Error("Error fetching categories");
    }
    const data = await res.json();

    const optionsData: CategoryOption[] = data.map((cat: any) => ({
      value: cat.id,
      label: cat.name,
    }));
    return optionsData;
  } catch (error) {
    const optionsData: CategoryOption[] = [];
    return optionsData;
  }
}

interface ExpenseData {
  user_id: string;
  name: string;
  amount: number;
  category_id: string
  description: string | null;
  date: string;
  installments: number;
}

export const registerExpense = async (expenseData: ExpenseData) => {
  try {
    const res = await fetch("/api/expenses/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expenseData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to register expense");
    }
  } catch (error: any) {
    throw error;
  }
};
