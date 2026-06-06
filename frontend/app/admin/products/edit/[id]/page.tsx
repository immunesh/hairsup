"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {
const params = useParams();
const router = useRouter();

const [loading, setLoading] = useState(true);
const [categories, setCategories] = useState<any[]>([]);

const [form, setForm] = useState({
name: "",
slug: "",
categoryId: "",
basePrice: "",
salePrice: "",
stock: "",
sku: "",
brand: "",
gender: "MEN",
shortDesc: "",
description: "",
tags: "",
});

useEffect(() => {
fetchProduct();
fetchCategories();
}, []);

async function fetchCategories() {
try {
const res = await fetch(
"http://localhost:5000/api/categories"
);


  const data = await res.json();

  setCategories(data.data || []);
} catch (error) {
  console.error(error);
}


}

async function fetchProduct() {
try {
const res = await fetch(
`http://localhost:5000/api/products/${params.id}`
);


  const data = await res.json();
  const product = data.data;

  setForm({
    name: product.name || "",
    slug: product.slug || "",
    categoryId: product.categoryId || "",
    basePrice: String(product.basePrice || ""),
    salePrice: String(product.salePrice || ""),
    stock: String(product.stock || ""),
    sku: product.sku || "",
    brand: product.brand || "",
    gender: product.gender || "MEN",
    shortDesc: product.shortDesc || "",
    description: product.description || "",
    tags: Array.isArray(product.tags)
      ? product.tags.join(", ")
      : "",
  });
} catch (error) {
  console.error(error);
  alert("Failed to load product");
} finally {
  setLoading(false);
}


}

async function handleUpdate(
e: React.FormEvent
) {
e.preventDefault();


try {
  const res = await fetch(
    `http://localhost:5000/api/products/${params.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        ...form,
        basePrice: Number(form.basePrice),
        salePrice: form.salePrice
          ? Number(form.salePrice)
          : null,
        stock: Number(form.stock),
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    alert(
      data.message ||
        "Failed to update product"
    );
    return;
  }

  alert("Product updated successfully");

  router.push("/admin/products");
  router.refresh();
} catch (error) {
  console.error(error);
  alert("Failed to update product");
}


}

if (loading) {
  return (
    <div className="flex items-center justify-center h-full text-white text-lg">
      Loading Product...
    </div>
  );
}

return (
  <div className="p-8">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold text-white">
          Edit Product
        </h1>

        <p className="text-slate-400 mt-2">
          Update product information
        </p>
      </div>

      <Link
        href="/admin/products"
        className="
        px-5 py-3
        rounded-2xl
        bg-white/5
        border border-white/10
        text-slate-300
        hover:bg-white/10
        hover:text-white
        transition-all
        "
      >
        ← Back
      </Link>
    </div>

    <form
      onSubmit={handleUpdate}
      className="
      rounded-3xl
      bg-white/5
      backdrop-blur-xl
      border border-white/10
      p-8
      "
    >
      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <label className="block mb-2 text-sm font-medium text-slate-300">
            Product Name
          </label>

          <input
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-slate-300">
            Slug
          </label>

          <input
            value={form.slug}
            onChange={(e) =>
              setForm({
                ...form,
                slug: e.target.value,
              })
            }
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-slate-300">
            Category
          </label>

          <select
            value={form.categoryId}
            onChange={(e) =>
              setForm({
                ...form,
                categoryId: e.target.value,
              })
            }
            className="w-full px-4 py-3 rounded-2xl bg-[#131827] border border-white/10 text-white focus:outline-none focus:border-cyan-500/50"
          >
            <option value="">
              Select Category
            </option>

            {categories.map((category: any) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-slate-300">
            Gender
          </label>

          <select
            value={form.gender}
            onChange={(e) =>
              setForm({
                ...form,
                gender: e.target.value,
              })
            }
            className="w-full px-4 py-3 rounded-2xl bg-[#131827] border border-white/10 text-white focus:outline-none focus:border-cyan-500/50"
          >
            <option value="MEN">MEN</option>
            <option value="WOMEN">WOMEN</option>
            <option value="UNISEX">UNISEX</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-slate-300">
            SKU
          </label>

          <input
            value={form.sku}
            onChange={(e) =>
              setForm({
                ...form,
                sku: e.target.value,
              })
            }
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-slate-300">
            Brand
          </label>

          <input
            value={form.brand}
            onChange={(e) =>
              setForm({
                ...form,
                brand: e.target.value,
              })
            }
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-slate-300">
            Base Price
          </label>

          <input
            type="number"
            value={form.basePrice}
            onChange={(e) =>
              setForm({
                ...form,
                basePrice: e.target.value,
              })
            }
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-slate-300">
            Sale Price
          </label>

          <input
            type="number"
            value={form.salePrice}
            onChange={(e) =>
              setForm({
                ...form,
                salePrice: e.target.value,
              })
            }
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-slate-300">
            Stock
          </label>

          <input
            type="number"
            value={form.stock}
            onChange={(e) =>
              setForm({
                ...form,
                stock: e.target.value,
              })
            }
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block mb-2 text-sm font-medium text-slate-300">
          Short Description
        </label>

        <textarea
          rows={3}
          value={form.shortDesc}
          onChange={(e) =>
            setForm({
              ...form,
              shortDesc: e.target.value,
            })
          }
          className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50"
        />
      </div>

      <div className="mt-6">
        <label className="block mb-2 text-sm font-medium text-slate-300">
          Full Description
        </label>

        <textarea
          rows={6}
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50"
        />
      </div>

      <div className="mt-6">
        <label className="block mb-2 text-sm font-medium text-slate-300">
          Tags
        </label>

        <input
          value={form.tags}
          onChange={(e) =>
            setForm({
              ...form,
              tags: e.target.value,
            })
          }
          placeholder="hair, wig, premium"
          className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
        />
      </div>

      <button
        type="submit"
        className="
        mt-8
        px-8
        py-3
        rounded-2xl
        bg-gradient-to-r
        from-cyan-500
        to-purple-600
        text-white
        font-medium
        transition-all
        duration-300
        hover:scale-105
        shadow-[0_0_25px_rgba(56,189,248,0.35)]
        "
      >
        Update Product
      </button>
    </form>
  </div>
);}