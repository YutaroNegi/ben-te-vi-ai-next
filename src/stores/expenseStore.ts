// stores/useExpensesStore.ts
import { create } from "zustand";
import {
  fetchCategories,
  registerCategory,
  editCategory,
  deleteCategory,
  fetchInstallmentsByUserAndDate,
  editInstallment,
  deleteInstallment,
  // caso queira importar também registerExpense, etc.
} from "@/utils";
import {
  CategoryOption,
  CategoryBody,
  RegisterCategoryBody,
  Installment,
} from "@/types";

interface ExpensesState {
  // Loading/erro genéricos da store
  loading: boolean;
  error: string | null;

  // Estados relativos a categorias
  categories: CategoryOption[];
  fetchCategories: (userId: string) => Promise<void>;
  addCategory: (userId: string, name: string) => Promise<void>;
  updateCategory: (id: string, body: CategoryBody) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;

  // Estados relativos a installments
  installmentsByCategory: Record<string, Installment[]>;
  fetchInstallments: (
    userId: string,
    startDate: string,
    endDate: string
  ) => Promise<void>;
  editOneInstallment: (id: string, data: Partial<Installment>) => Promise<void>;
  deleteOneInstallment: (id: string) => Promise<void>;

  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export const useExpensesStore = create<ExpensesState>((set, get) => ({
  loading: false,
  error: null,

  // -----------------
  // CATEGORIES
  // -----------------
  categories: [],
  fetchCategories: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchCategories(userId);
      set({
        categories: data,
        loading: false,
      });
    } catch  {
      set({
        error: "Erro ao buscar categorias",
        loading: false,
      });
    }
  },
  addCategory: async (userId: string, name: string) => {
    set({ loading: true, error: null });
    try {
      const payload: RegisterCategoryBody = {
        user_id: userId,
        name,
        description: "",
      };
      await registerCategory(payload);
      // Depois de criar, buscamos novamente para atualizar a lista
      await get().fetchCategories(userId);
      set({ loading: false });
    } catch  {
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
      // Para atualizar a lista, podemos reler o userId de algum lugar
      // Normalmente pegamos do authStore, mas aqui, a store não sabe sozinha qual é.
      // Se você tiver esse userId guardado no store, basta usá-lo:
      // const userId = get().userId; // Exemplo se você salvasse userId aqui
      // await get().fetchCategories(userId);

      // Se não, pode ser que apenas “edite” localmente as categories:
      const updated = get().categories.map((cat) =>
        cat.value === id ? { value: id, label: body.name } : cat
      );
      set({ categories: updated, loading: false });
    } catch  {
      set({
        error: "Falha ao editar categoria",
        loading: false,
      });
    }
  },
  removeCategory: async (id: string) => {
    set({ loading: true, error: null });
    try {
      // 1. Deletar a categoria na API
      await deleteCategory(id);

      // 2. Remover a categoria localmente do array de categories
      const updatedCategories = get().categories.filter(
        (cat) => cat.value !== id
      );

      // 3. Remover também do installmentsByCategory (se existir) para não poluir memória
      const oldInstallments = get().installmentsByCategory;
      const newInstallments = { ...oldInstallments };
      delete newInstallments[id]; // remove só as parcelas daquela categoria

      set({
        categories: updatedCategories,
        installmentsByCategory: newInstallments,
        loading: false,
      });
    } catch  {
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
    startDate: string,
    endDate: string
  ) => {
    set({ loading: true, error: null });
    try {
      const grouped = await fetchInstallmentsByUserAndDate(
        userId,
        startDate,
        endDate
      );
      set({ installmentsByCategory: grouped, loading: false });
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
      // Atualiza localmente ou refaz fetchInstallments se preferir
      // Exemplo de atualização local (assumindo que a data do installment não muda a “category”)
      const installmentsByCat = get().installmentsByCategory;
      // Precisamos descobrir em qual category este installment está
      // Como installmentsByCategory é um Record<string, Installment[]>,
      // faremos a busca e substituiremos:
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
    } catch  {
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
          (i) => i.id !== id
        );
        set({
          installmentsByCategory: {
            ...installmentsByCat,
            [foundCategoryId]: filteredArr,
          },
        });
      }
    } catch  {
      set({ error: "Erro ao deletar parcela", loading: false });
    }
  },

  selectedDate: new Date(),
  setSelectedDate: (date: Date) => set({ selectedDate: date }),
}));
