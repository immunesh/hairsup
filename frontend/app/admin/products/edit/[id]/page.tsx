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
return <div>Loading...</div>;
}

return ( <div> <div className="flex justify-between items-center mb-6"> <h1 className="text-4xl font-bold">
Edit Product </h1>


    <Link
      href="/admin/products"
      className="bg-gray-200 px-4 py-2 rounded"
    >
      Back
    </Link>
  </div>

  <form
    onSubmit={handleUpdate}
    className="bg-white p-6 rounded-xl shadow"
  >
    <div className="grid grid-cols-2 gap-4">

      <div>
        <label className="block mb-2 font-medium">
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
          className="w-full border p-3 rounded"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
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
          className="w-full border p-3 rounded"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
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
          className="w-full border p-3 rounded"
        >
          <option value="">
            Select Category
          </option>

          {categories.map(
            (category: any) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            )
          )}
        </select>
      </div>

      <div>
        <label className="block mb-2 font-medium">
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
          className="w-full border p-3 rounded"
        >
          <option value="MEN">
            MEN
          </option>
          <option value="WOMEN">
            WOMEN
          </option>
          <option value="UNISEX">
            UNISEX
          </option>
        </select>
      </div>

      <div>
        <label className="block mb-2 font-medium">
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
          className="w-full border p-3 rounded"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
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
          className="w-full border p-3 rounded"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Base Price
        </label>

        <input
          type="number"
          value={form.basePrice}
          onChange={(e) =>
            setForm({
              ...form,
              basePrice:
                e.target.value,
            })
          }
          className="w-full border p-3 rounded"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Sale Price
        </label>

        <input
          type="number"
          value={form.salePrice}
          onChange={(e) =>
            setForm({
              ...form,
              salePrice:
                e.target.value,
            })
          }
          className="w-full border p-3 rounded"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
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
          className="w-full border p-3 rounded"
        />
      </div>
    </div>

    <div className="mt-4">
      <label className="block mb-2 font-medium">
        Short Description
      </label>

      <textarea
        rows={3}
        value={form.shortDesc}
        onChange={(e) =>
          setForm({
            ...form,
            shortDesc:
              e.target.value,
          })
        }
        className="w-full border p-3 rounded"
      />
    </div>

    <div className="mt-4">
      <label className="block mb-2 font-medium">
        Full Description
      </label>

      <textarea
        rows={6}
        value={form.description}
        onChange={(e) =>
          setForm({
            ...form,
            description:
              e.target.value,
          })
        }
        className="w-full border p-3 rounded"
      />
    </div>

    <div className="mt-4">
      <label className="block mb-2 font-medium">
        Tags
      </label>

      <input
        value={form.tags}
        onChange={(e) =>
          setForm({
            ...form,
            tags:
              e.target.value,
          })
        }
        placeholder="hair, wig, premium"
        className="w-full border p-3 rounded"
      />
    </div>

    <button
      type="submit"
      className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl"
    >
      Update Product
    </button>
  </form>
</div>


);
}
