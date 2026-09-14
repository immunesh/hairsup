import { API_URL } from "./config";

export const getAllStores = async () => {
  try {
    const response = await fetch(
      `${API_URL}/stores`,
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
    console.error("Store fetch error:", error);
    return [];
  }
};

export const getStoreById = async (
  id: string
) => {
  try {
    const response = await fetch(
      `${API_URL}/stores/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error("Store fetch error:", error);
    return null;
  }
};