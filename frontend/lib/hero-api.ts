import { api } from "./api";
import { API_URL } from './config';

export async function getHeroSlides(activeOnly = false) {
  const res = await api.get("/hero-slides", {
    params: activeOnly ? { active: "true" } : undefined,
  });
  return res.data;
}

export async function deleteHeroSlide(id: string) {
  const res = await fetch(
    `${API_URL}/hero-slides/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to delete hero slide");
  }

  return res.json();
}
