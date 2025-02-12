// /stores/categoryStore.ts
import { create } from "zustand";
import { toast } from "react-toastify";
import {
  fetchCategories,
  registerCategory,
  editCategory,
  deleteCategory,
} from "@/utils";
import { CategoryOption } from "@/types";

interface CategoryStoreState {
  categories: CategoryOption[];
  loadingCategories: boolean;
  fetchCategoriesForUser: (userId: string) => Promise<void>;
  addCategory: (userId: string, name: string) => Promise<void>;
  updateCategory: (categoryId: string, newName: string) => Promise<void>;
  removeCategory: (categoryId: string) => Promise<void>;
  clearCategories: () => void;
}

export const useCategoryStore = create<CategoryStoreState>((set, get) => ({
  categories: [],
  loadingCategories: false,

  /**
   * Busca todas as categorias do usuário
   */
  fetchCategoriesForUser: async (userId: string) => {
    set({ loadingCategories: true });
    try {
      const categories = await fetchCategories(userId);
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
  addCategory: async (userId: string, name: string) => {
    if (!name) return;

    set({ loadingCategories: true });
    try {
      await registerCategory({ user_id: userId, name, description: "" });
      toast.success("Categoria adicionada com sucesso!");

      // Atualiza a lista de categorias após inserir
      await get().fetchCategoriesForUser(userId);
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
  updateCategory: async (categoryId: string, newName: string) => {
    if (!newName) return;

    set({ loadingCategories: true });
    try {
      await editCategory(categoryId, { name: newName, description: "" });
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
