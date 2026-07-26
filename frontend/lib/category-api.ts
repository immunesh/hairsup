import { api } from "./api";
import { API_URL } from './config';

export async function getCategories() {
  const res = await api.get("/categories");
  return res.data;
}

export async function deleteCategory(id: string) {
  const res = await fetch(
    `${API_URL}/categories/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to delete category");
  }

  return res.json();
}