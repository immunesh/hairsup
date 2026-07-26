"use client";

import { useRouter } from "next/navigation";
import { API_URL } from '@/lib/config';

export default function DeleteProductButton({
  id,
}: {
  id: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    const confirmDelete = confirm(
      "Delete this product?"
    );

    if (!confirmDelete) return;

    const res = await fetch(
      `${API_URL}/products/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      alert("Failed to delete");
      return;
    }

    alert("Deleted successfully");

    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
    >
      Delete
    </button>
  );
}