import {
  CategoryOption,
  ExpenseData,
  Installment,
  CategoryBody,
  RegisterCategoryBody,
} from "@/types";

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

export async function fetchInstallmentsByUserAndDate(
  userId: string,
  startDate: string,
  endDate: string
): Promise<Record<string, Installment[]>> {
  const response = await fetch(
    `/api/installments/user/${userId}?startDate=${encodeURIComponent(
      startDate
    )}&endDate=${encodeURIComponent(endDate)}`
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar parcelas.");
  }

  return response.json();
}

export async function editCategory(id: string, body: CategoryBody) {
  try {
    const res = await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to update category");
    }
  } catch (error: any) {
    throw error;
  }
}

export async function registerCategory(body: RegisterCategoryBody) {
  try {
    const res = await fetch(`/api/categories/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to register category");
    }

    return data;
  } catch (error: any) {
    throw error;
  }
}

export async function deleteCategory(id: string) {
  try {
    const res = await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to delete category");
    }
  } catch (error: any) {
    throw error;
  }
}
