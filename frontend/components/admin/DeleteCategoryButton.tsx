"use client";

import { useRouter } from "next/navigation";

export default function DeleteCategoryButton({
  id,
}: {
  id: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      await fetch(
        `http://localhost:5000/api/categories/${id}`,
        {
          method: "DELETE",
        }
      );

      router.refresh();
    } catch (error) {
      alert("Failed to delete category");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
    >
      Delete
    </button>
  );
}