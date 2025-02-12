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

    const optionsData: CategoryOption[] = data.map(
      (cat: { id: string; name: string }) => ({
        value: cat.id,
        label: cat.name,
      }),
    );
    return optionsData;
  } catch {
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
  } catch {
    throw new Error("Failed to register expense");
  }
};

export const editExpense = async (id: string, body: ExpenseData) => {
  try {
    const res = await fetch(`/api/expenses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to update expense");
    }
  } catch {
    throw new Error("Failed to update expense");
  }
};

export const deleteExpense = async (id: string) => {
  try {
    const res = await fetch(`/api/expenses/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to delete expense");
    }
  } catch {
    throw new Error("Failed to delete expense");
  }
};

export const editInstallment = async (
  id: string,
  body: Partial<Installment>,
) => {
  try {
    const res = await fetch(`/api/installments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to update installment");
    }
    return data;
  } catch {
    throw new Error("Failed to update installment");
  }
};

export const deleteInstallment = async (id: string) => {
  try {
    const res = await fetch(`/api/installments/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to delete installment");
    }
    return data;
  } catch {
    throw new Error("Failed to delete installment");
  }
};

export async function fetchInstallmentsByUserAndDate(
  userId: string,
  startDate: string,
  endDate: string,
): Promise<Record<string, Installment[]>> {
  const response = await fetch(
    `/api/installments/user/${userId}?startDate=${encodeURIComponent(
      startDate,
    )}&endDate=${encodeURIComponent(endDate)}`,
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
  } catch {
    throw new Error("Failed to update category");
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
  } catch {
    throw new Error("Failed to register category");
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
  } catch {
    throw new Error("Failed to delete category");
  }
}
