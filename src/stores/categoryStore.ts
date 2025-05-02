// /stores/categoryStore.ts
import { create } from "zustand";
import { toast } from "react-toastify";
import {
  fetchCategories,
  registerCategory,
  editCategory,
  deleteCategory,
} from "@/utils";
import { CategoryOption, ExpenseType } from "@/types";

interface CategoryStoreState {
  categories: CategoryOption[];
  loadingCategories: boolean;
  fetchCategoriesForUser: (userId: string, type: ExpenseType) => Promise<void>;
  addCategory: (
    userId: string,
    name: string,
    type: ExpenseType,
  ) => Promise<void>;
  updateCategory: (
    categoryId: string,
    newName: string,
    type: ExpenseType,
  ) => Promise<void>;
  removeCategory: (categoryId: string) => Promise<void>;
  clearCategories: () => void;
}

export const useCategoryStore = create<CategoryStoreState>((set, get) => ({
  categories: [],
  loadingCategories: false,

  /**
   * Busca todas as categorias do usuário
   */
  fetchCategoriesForUser: async (userId: string, type: ExpenseType) => {
    set({ loadingCategories: true });
    try {
      const categories = await fetchCategories(userId, type);
      set({ categories });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao buscar categorias");
    } finally {
      set({ loadingCategories: false });
    }
  },

  /**
   * Adiciona nova categoria e refaz o fetch
   */
  addCategory: async (userId: string, name: string, type: ExpenseType) => {
    if (!name) return;

    set({ loadingCategories: true });
    try {
      await registerCategory({ user_id: userId, name, description: "", type });
      toast.success("Categoria adicionada com sucesso!");

      // Atualiza a lista de categorias após inserir
      await get().fetchCategoriesForUser(userId, type);
    } catch (error) {
      console.error(error);
      toast.error("Falha ao adicionar categoria");
    } finally {
      set({ loadingCategories: false });
    }
  },

  /**
   * Edita uma categoria e refaz o fetch
   */
  updateCategory: async (
    categoryId: string,
    newName: string,
    type: ExpenseType,
  ) => {
    if (!newName) return;

    set({ loadingCategories: true });
    try {
      await editCategory(categoryId, { name: newName, description: "", type });
      toast.success("Category successfully edited!");
    } catch (error) {
      console.error(error);
      toast.error("Falha ao editar categoria");
    } finally {
      set({ loadingCategories: false });
    }
  },

  /**
   * Deleta uma categoria e refaz o fetch
   */
  removeCategory: async (categoryId: string) => {
    set({ loadingCategories: true });
    try {
      await deleteCategory(categoryId);
      toast.success("Categoria deletada com sucesso!");

      // Novamente, refaz o fetch se necessário
      // await get().fetchCategoriesForUser(userId);
    } catch {
      toast.error("Falha ao deletar categoria");
    } finally {
      set({ loadingCategories: false });
    }
  },

  /**
   * Limpa a lista de categorias (opcional)
   */
  clearCategories: () => {
    set({ categories: [] });
  },
}));
