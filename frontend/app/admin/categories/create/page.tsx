"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCategoryPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    gender: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:5000/api/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const error = await res.text();
        console.error(error);
        alert("Failed to create category");
        return;
      }

      alert("Category created successfully");

      router.push("/admin/categories");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Add Category
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow max-w-3xl"
      >
        <input
          placeholder="Category Name"
          className="w-full border p-3 mb-4 rounded"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          placeholder="Slug"
          className="w-full border p-3 mb-4 rounded"
          value={form.slug}
          onChange={(e) =>
            setForm({
              ...form,
              slug: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Description"
          className="w-full border p-3 mb-4 rounded"
          rows={4}
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        <select
          className="w-full border p-3 mb-4 rounded"
          value={form.gender}
          onChange={(e) =>
            setForm({
              ...form,
              gender: e.target.value,
            })
          }
        >
          <option value="">Select Gender</option>
          <option value="MEN">MEN</option>
          <option value="WOMEN">WOMEN</option>
          <option value="UNISEX">UNISEX</option>
        </select>

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl"
        >
          Save Category
        </button>
      </form>
    </div>
  );
}