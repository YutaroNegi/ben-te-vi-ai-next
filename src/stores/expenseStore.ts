import { create } from "zustand";
import {
  fetchCategories,
  registerCategory,
  editCategory,
  deleteCategory,
  fetchInstallmentsByUserAndDate,
  editInstallment,
  deleteInstallment,
  deleteExpense,
} from "@/utils";
import {
  CategoryOption,
  CategoryBody,
  RegisterCategoryBody,
  Installment,
  ExpenseType,
  FetchInstallments,
} from "@/types";

interface ExpensesState {
  loading: boolean;
  error: string | null;

  categories: CategoryOption[];
  fetchCategories: (userId: string, type: ExpenseType) => Promise<void>;
  addCategory: (
    userId: string,
    name: string,
    type: ExpenseType,
  ) => Promise<void>;
  updateCategory: (id: string, body: CategoryBody) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;

  installmentsByCategory: Record<string, Installment[]>;
  fetchInstallments: FetchInstallments;
  editOneInstallment: (id: string, data: Partial<Installment>) => Promise<void>;
  deleteOneInstallment: (id: string) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;

  monthTotal: number;
  latestInstallment: Installment | null;
  last10Installments: Installment[] | null;

  selectedType: ExpenseType;
  setSelectedType: (type: ExpenseType) => void;
}

export const useExpensesStore = create<ExpensesState>((set, get) => ({
  loading: false,
  error: null,

  // -----------------
  // CATEGORIES
  // -----------------
  categories: [],
  fetchCategories: async (userId: string, type: ExpenseType) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchCategories(userId, type);
      set({
        categories: data,
        loading: false,
      });
    } catch {
      set({
        error: "Erro ao buscar categorias",
        loading: false,
      });
    }
  },
  addCategory: async (userId: string, name: string, type: ExpenseType) => {
    set({ loading: true, error: null });
    try {
      const payload: RegisterCategoryBody = {
        user_id: userId,
        name,
        description: "",
        type,
      };
      await registerCategory(payload);
      // Depois de criar, buscamos novamente para atualizar a lista
      await get().fetchCategories(userId, type);
      set({ loading: false });
    } catch {
      set({
        error: "Falha ao adicionar categoria",
        loading: false,
      });
    }
  },
  updateCategory: async (id: string, body: CategoryBody) => {
    set({ loading: true, error: null });
    try {
      await editCategory(id, body);
      const updated = get().categories.map((cat) =>
        cat.value === id ? { value: id, label: body.name } : cat,
      );
      set({ categories: updated, loading: false });
    } catch {
      set({
        error: "Falha ao editar categoria",
        loading: false,
      });
    }
  },
  removeCategory: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteCategory(id);

      const updatedCategories = get().categories.filter(
        (cat) => cat.value !== id,
      );

      const oldInstallments = get().installmentsByCategory;
      const newInstallments = { ...oldInstallments };
      delete newInstallments[id]; // remove só as parcelas daquela categoria

      set({
        categories: updatedCategories,
        installmentsByCategory: newInstallments,
        loading: false,
      });
    } catch {
      set({
        error: "Falha ao deletar categoria",
        loading: false,
      });
    }
  },

  // -----------------
  // INSTALLMENTS
  // -----------------
  installmentsByCategory: {},
  fetchInstallments: async (
    userId: string,
    type: ExpenseType,
    startDate?: string,
    endDate?: string,
    opts?: { categoryId?: string; searchTerm?: string },
  ) => {
    set({ loading: true, error: null });
    try {
      const grouped = await fetchInstallmentsByUserAndDate(
        userId,
        type,
        opts?.categoryId,
        opts?.searchTerm,
        startDate,
        endDate,
      );
      set({ installmentsByCategory: grouped, loading: false });
      const monthTotal = Object.values(grouped).reduce(
        (acc, installments) =>
          acc +
          installments.reduce(
            (acc, installment) => acc + installment.amount,
            0,
          ),
        0,
      );
      const latestInstallment = Object.values(grouped)
        .flat()
        .sort(
          (a, b) =>
            new Date(b.expense.created_at).getTime() -
            new Date(a.expense.created_at).getTime(),
        )[0];
      const last10Installments = Object.values(grouped)
        .flat()
        .sort(
          (a, b) =>
            new Date(b.expense.created_at).getTime() -
            new Date(a.expense.created_at).getTime(),
        )
        .slice(0, 10);
      set({ monthTotal, latestInstallment, last10Installments });
    } catch {
      set({
        error: "Erro ao buscar parcelas",
        loading: false,
      });
    }
  },
  editOneInstallment: async (id: string, data: Partial<Installment>) => {
    set({ loading: true, error: null });
    try {
      await editInstallment(id, data);
      set({ loading: false });
      const installmentsByCat = get().installmentsByCategory;
      let foundCategoryId: string | null = null;
      for (const catId of Object.keys(installmentsByCat)) {
        const index = installmentsByCat[catId].findIndex((i) => i.id === id);
        if (index !== -1) {
          foundCategoryId = catId;
          break;
        }
      }
      if (foundCategoryId) {
        const newArray = [...installmentsByCat[foundCategoryId]];
        const index = newArray.findIndex((i) => i.id === id);
        newArray[index] = { ...newArray[index], ...data } as Installment;
        set({
          installmentsByCategory: {
            ...installmentsByCat,
            [foundCategoryId]: newArray,
          },
        });
      }
    } catch {
      set({ error: "Erro ao editar parcela", loading: false });
    }
  },
  deleteOneInstallment: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteInstallment(id);
      set({ loading: false });
      // Remove localmente:
      const installmentsByCat = get().installmentsByCategory;
      let foundCategoryId: string | null = null;
      for (const catId of Object.keys(installmentsByCat)) {
        const index = installmentsByCat[catId].findIndex((i) => i.id === id);
        if (index !== -1) {
          foundCategoryId = catId;
          break;
        }
      }
      if (foundCategoryId) {
        const filteredArr = installmentsByCat[foundCategoryId].filter(
          (i) => i.id !== id,
        );
        set({
          installmentsByCategory: {
            ...installmentsByCat,
            [foundCategoryId]: filteredArr,
          },
        });
      }
    } catch {
      set({ error: "Erro ao deletar parcela", loading: false });
    }
  },
  deleteExpense: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteExpense(id);
      set({ loading: false });
      // Remove localmente:
      const installmentsByCat = get().installmentsByCategory;
      let foundCategoryId: string | null = null;
      for (const catId of Object.keys(installmentsByCat)) {
        const index = installmentsByCat[catId].findIndex((i) => i.id === id);
        if (index !== -1) {
          foundCategoryId = catId;
          break;
        }
      }
      if (foundCategoryId) {
        const filteredArr = installmentsByCat[foundCategoryId].filter(
          (i) => i.id !== id,
        );
        set({
          installmentsByCategory: {
            ...installmentsByCat,
            [foundCategoryId]: filteredArr,
          },
        });
      }
    } catch {
      set({ error: "Erro ao deletar parcela", loading: false });
    }
  },
  selectedDate: new Date(),
  setSelectedDate: (date: Date) => set({ selectedDate: date }),
  monthTotal: 0,
  latestInstallment: null,
  last10Installments: null,
  selectedType: "expense",
  setSelectedType: (type: ExpenseType) => set({ selectedType: type }),
}));
