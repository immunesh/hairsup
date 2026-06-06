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
  <div className="p-8">
    {/* Header */}
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold text-white">
          Add Product
        </h1>

        <p className="text-slate-400 mt-2">
          Create a new product for your store
        </p>
      </div>
    </div>

    <form
      onSubmit={handleSubmit}
      className="
      rounded-3xl
      border
      border-white/10
      bg-white/5
      backdrop-blur-xl
      p-8
      space-y-6
      "
    >
      {/* Product Name */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-300">
          Product Name
        </label>

        <input
          type="text"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          className="
          w-full
          px-4
          py-3
          rounded-2xl
          bg-white/5
          border
          border-white/10
          text-white
          focus:outline-none
          focus:border-cyan-500/50
          "
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-300">
          Slug
        </label>

        <input
          type="text"
          placeholder="curly-human-hair-wig"
          value={form.slug}
          onChange={(e) =>
            setForm({
              ...form,
              slug: e.target.value,
            })
          }
          className="
          w-full
          px-4
          py-3
          rounded-2xl
          bg-white/5
          border
          border-white/10
          text-white
          placeholder:text-slate-500
          "
        />
      </div>

      {/* SKU */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-300">
          SKU
        </label>

        <input
          type="text"
          value={form.sku}
          onChange={(e) =>
            setForm({
              ...form,
              sku: e.target.value,
            })
          }
          className="
          w-full
          px-4
          py-3
          rounded-2xl
          bg-white/5
          border
          border-white/10
          text-white
          "
        />
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-4 gap-6">
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
            className="
            w-full
            px-4
            py-3
            rounded-2xl
            bg-[#131827]
            border
            border-white/10
            text-white
            "
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
            className="
            w-full
            px-4
            py-3
            rounded-2xl
            bg-white/5
            border
            border-white/10
            text-white
            "
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
            className="
            w-full
            px-4
            py-3
            rounded-2xl
            bg-white/5
            border
            border-white/10
            text-white
            "
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
            className="
            w-full
            px-4
            py-3
            rounded-2xl
            bg-white/5
            border
            border-white/10
            text-white
            "
          />
        </div>
      </div>

      {/* Short Description */}
      <div>
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
          className="
          w-full
          px-4
          py-3
          rounded-2xl
          bg-white/5
          border
          border-white/10
          text-white
          "
        />
      </div>

      {/* Full Description */}
      <div>
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
          className="
          w-full
          px-4
          py-3
          rounded-2xl
          bg-white/5
          border
          border-white/10
          text-white
          "
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-300">
          Tags
        </label>

        <input
          type="text"
          placeholder="human hair, lace front, curly"
          value={form.tags}
          onChange={(e) =>
            setForm({
              ...form,
              tags: e.target.value,
            })
          }
          className="
          w-full
          px-4
          py-3
          rounded-2xl
          bg-white/5
          border
          border-white/10
          text-white
          "
        />
      </div>

      {/* Main Image */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-300">
          Main Product Image
        </label>

        <input
          type="file"
          accept="image/*"
          className="
          w-full
          px-4
          py-3
          rounded-2xl
          bg-white/5
          border
          border-white/10
          text-slate-300
          "
          onChange={(e) => {
            const file = e.target.files?.[0];

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
            className="
            mt-4
            w-40
            h-40
            object-cover
            rounded-2xl
            border
            border-white/10
            "
          />
        )}
      </div>

      {/* Gallery Images */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-300">
          360 Product Images
        </label>

        <input
          type="file"
          multiple
          accept="image/*"
          className="
          w-full
          px-4
          py-3
          rounded-2xl
          bg-white/5
          border
          border-white/10
          text-slate-300
          "
          onChange={(e) => {
            const files = Array.from(
              e.target.files || []
            );

            setGalleryImages(files);

            setGalleryPreviews(
              files.map((file) =>
                URL.createObjectURL(file)
              )
            );
          }}
        />

        {galleryPreviews.length > 0 && (
          <div className="grid grid-cols-4 gap-4 mt-4">
            {galleryPreviews.map(
              (image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Preview ${index}`}
                  className="
                  w-28
                  h-28
                  object-cover
                  rounded-2xl
                  border
                  border-white/10
                  "
                />
              )
            )}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="
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
        disabled:opacity-50
        shadow-[0_0_25px_rgba(56,189,248,0.35)]
        "
      >
        {loading
          ? "Saving..."
          : "Save Product"}
      </button>
    </form>
  </div>
);
}