import { API_URL } from "./config";

export async function getAllBlogs() {
  try {
    const response = await fetch(
      `${API_URL}/blogs/published`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    return data.data || [];
  } catch (error) {
    console.error("Blog fetch error:", error);
    return [];
  }
}