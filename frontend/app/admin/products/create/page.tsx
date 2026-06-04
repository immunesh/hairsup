"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProductPage() {
  const router = useRouter();
const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
const [mainImage, setMainImage] =
  useState<File | null>(null);

const [galleryImages, setGalleryImages] =
  useState<File[]>([]);

const [mainPreview, setMainPreview] =
  useState("");

const [galleryPreviews, setGalleryPreviews] =
  useState<string[]>([]);
 const [form, setForm] = useState({
  name: "",
  slug: "",
  categoryId: "",
  gender: "",
  basePrice: "",
  shortDesc: "",
  salePrice: "",
  stock: "",
  description: "",
  tags: "",
  sku: "",
  brand: "HairsUp",
});

  async function handleSubmit(
  e: React.FormEvent
) {
  e.preventDefault();

  try {
    setLoading(true);

    let mainImageUrl = "";

    // Upload main image first
    if (mainImage) {
      const imageFormData =
        new FormData();

      imageFormData.append(
        "image",
        mainImage
      );

      const uploadRes =
        await fetch(
          "http://localhost:5000/api/upload/image",
          {
            method: "POST",
            body: imageFormData,
          }
        );

      const uploadData =
        await uploadRes.json();
console.log(uploadData);
console.log(uploadRes.status);
      console.log(
        "UPLOAD RESPONSE:",
        uploadData
      );

      if (!uploadRes.ok) {
        alert(
          uploadData.message ||
            "Image upload failed"
        );
        return;
      }

      mainImageUrl =
        uploadData.url;
    }

    const imageUrls: string[] = [];

if (mainImageUrl) {
  imageUrls.push(mainImageUrl);
}

for (const image of galleryImages) {
  const formData = new FormData();

  formData.append(
    "image",
    image
  );

  const uploadRes = await fetch(
    "http://localhost:5000/api/upload/image",
    {
      method: "POST",
      body: formData,
    }
  );

  const uploadData =
    await uploadRes.json();

  if (uploadRes.ok) {
    imageUrls.push(
      uploadData.url
    );
  }
}

    // Create product
    const res = await fetch(
      "http://localhost:5000/api/products",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          description:
            form.description,
          categoryId:
            form.categoryId,
          gender:
            form.gender,
          basePrice: Number(
            form.basePrice
          ),
          salePrice:
            form.salePrice
              ? Number(
                  form.salePrice
                )
              : null,
          stock: Number(
            form.stock
          ),
          sku: form.sku,
          brand: form.brand,
 shortDesc: form.shortDesc,
          tags: form.tags
            .split(",")
            .map((tag) =>
              tag.trim()
            )
            .filter(Boolean),

        images: imageUrls,
        }),
      }
    );

    const data =
      await res.json();

    if (!res.ok) {
      alert(
        data.message ||
          "Failed to create product"
      );
      return;
    }

    alert(
      "✅ Product created successfully"
    );

    router.push(
      "/admin/products"
    );

    router.refresh();
  } catch (error) {
    console.error(error);

    alert(
      "❌ Server error"
    );
  } finally {
    setLoading(false);
  }
}
  useEffect(() => {
  async function loadCategories() {
    try {
      const res = await fetch(
        "http://localhost:5000/api/categories"
      );

      const data = await res.json();

      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  }

  loadCategories();
}, []);

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">
        Add Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow border space-y-6"
      >
        <div>
          <label className="block mb-2 font-medium">
            Product Name
          </label>

          <input
            type="text"
            className="w-full border rounded-lg p-3"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Slug
          </label>

          <input
            type="text"
            className="w-full border rounded-lg p-3"
            placeholder="curly-human-hair-wig"
            value={form.slug}
            onChange={(e) =>
              setForm({
                ...form,
                slug: e.target.value,
              })
            }
          />
        </div>
<div>
  <label className="block mb-2 font-medium">
    SKU
  </label>

  <input
    type="text"
    className="w-full border rounded-lg p-3"
    value={form.sku}
    onChange={(e) =>
      setForm({
        ...form,
        sku: e.target.value,
      })
    }
  />
</div>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
  <label className="block mb-2 font-medium">
    Category
  </label>

  <select
    className="w-full border rounded-lg p-3"
    value={form.categoryId}
    onChange={(e) =>
      setForm({
        ...form,
        categoryId: e.target.value,
      })
    }
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
            <label className="block mb-2 font-medium">
              Base Price
            </label>

            <input
              type="number"
              className="w-full border rounded-lg p-3"
              value={form.basePrice}
              onChange={(e) =>
                setForm({
                  ...form,
                  basePrice: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Sale Price
            </label>

            <input
              type="number"
              className="w-full border rounded-lg p-3"
              value={form.salePrice}
              onChange={(e) =>
                setForm({
                  ...form,
                  salePrice: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Stock
          </label>

          <input
            type="number"
            className="w-full border rounded-lg p-3"
            value={form.stock}
            onChange={(e) =>
              setForm({
                ...form,
                stock: e.target.value,
              })
            }
          />
        </div>
<div>
  <label className="block mb-2 font-medium">
    Short Description
  </label>

  <textarea
    rows={3}
    className="w-full border rounded-lg p-3"
    value={form.shortDesc}
    onChange={(e) =>
      setForm({
        ...form,
        shortDesc: e.target.value,
      })
    }
  />
</div>
        <div>
          <label className="block mb-2 font-medium">
            Full Description
          </label>

          <textarea
            rows={6}
            className="w-full border rounded-lg p-3"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Tags
          </label>

          <input
            type="text"
            className="w-full border rounded-lg p-3"
            placeholder="human hair, lace front, curly"
            value={form.tags}
            onChange={(e) =>
              setForm({
                ...form,
                tags: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Main Product Image
          </label>

       <input
  type="file"
  accept="image/*"
  className="w-full border rounded-lg p-3"
  onChange={(e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setMainImage(file);

    setMainPreview(
      URL.createObjectURL(file)
    );
  }}
/>

{mainPreview && (
  <img
    src={mainPreview}
    alt="Preview"
    className="mt-3 w-40 h-40 object-cover border rounded-lg"
  />
)}
        </div>

        <div>
          <label className="block mb-2 font-medium">
            360 Product Images (8 Images)
          </label>

         <input
  type="file"
  multiple
  accept="image/*"
  className="w-full border rounded-lg p-3"
  onChange={(e) => {
    const files = Array.from(
      e.target.files || []
    );

    setGalleryImages(
      files
    );

    setGalleryPreviews(
      files.map((file) =>
        URL.createObjectURL(
          file
        )
      )
    );
  }}
/>

{galleryPreviews.length >
  0 && (
  <div className="grid grid-cols-4 gap-3 mt-4">
    {galleryPreviews.map(
      (
        image,
        index
      ) => (
        <img
          key={index}
          src={image}
          alt={`Preview ${index}`}
          className="w-28 h-28 object-cover border rounded-lg"
        />
      )
    )}
  </div>
)}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
        >
          {loading
            ? "Saving..."
            : "Save Product"}
        </button>
      </form>
    </div>
  );
}