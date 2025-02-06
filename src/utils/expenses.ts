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