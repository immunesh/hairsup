"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from '@/lib/config';

// Head angles a try-on asset can be shot at, in degrees clockwise from front-on.
// The try-on renderer cross-fades between the two angles nearest the viewer's
// current head yaw, so a front (0) plus both profiles (45 / 315) is the useful
// minimum. Back (180) and top (90) views belong to the 360 gallery, not try-on.
const ANGLE_OPTIONS = [0, 45, 90, 135, 180, 225, 270, 315];

interface ImageMeta {
  angle: number;
  isTryOn: boolean;
}

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

// Per-image try-on metadata. Virtual try-on only ever loads images flagged
// isTryOn, and keys them by angle - an image saved without these is invisible
// to it no matter how good the cutout is.
const [mainMeta, setMainMeta] =
  useState<ImageMeta>({ angle: 0, isTryOn: false });

const [galleryMeta, setGalleryMeta] =
  useState<ImageMeta[]>([]);
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

  material: "",
  capSize: "",
  length: "",
  density: "",
  texture: "",
  color: "",

  rating: "0",

  isFeatured: false,
  isBestSeller: false,
  isNewArrival: false,
});

const [features, setFeatures] = useState([
  {
    title: "",
    subtitle: "",
  },
]);

const [faqs, setFaqs] = useState([
  {
    question: "",
    answer: "",
  },
]);

const [careGuides, setCareGuides] = useState([
  {
    icon: "",
    title: "",
    steps: "",
  },
]);

const [includedItems, setIncludedItems] = useState([
  {
    text: "",
  },
]);

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
          `${API_URL}/upload/image`,
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

    const productImages: {
      url: string;
      angle: number;
      isPrimary: boolean;
      isTryOn: boolean;
    }[] = [];

if (mainImageUrl) {
  productImages.push({
    url: mainImageUrl,
    angle: mainMeta.angle,
    isPrimary: true,
    isTryOn: mainMeta.isTryOn,
  });
}

for (
  let index = 0;
  index < galleryImages.length;
  index++
) {
  const image = galleryImages[index];

  const formData = new FormData();

  formData.append(
    "image",
    image
  );

  const uploadRes = await fetch(
    `${API_URL}/upload/image`,
    {
      method: "POST",
      body: formData,
    }
  );

  const uploadData =
    await uploadRes.json();

  if (uploadRes.ok) {
    const meta = galleryMeta[index] ?? {
      angle: 0,
      isTryOn: false,
    };

    productImages.push({
      url: uploadData.url,
      angle: meta.angle,
      isPrimary: productImages.length === 0,
      isTryOn: meta.isTryOn,
    });
  }
}

    // Create product
    const res = await fetch(
      `${API_URL}/products`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },

body: JSON.stringify({
  name: form.name,
  slug: form.slug,
  description: form.description,
  categoryId: form.categoryId,
  gender: form.gender,

  basePrice: Number(form.basePrice),

  salePrice: form.salePrice
    ? Number(form.salePrice)
    : null,

  stock: Number(form.stock),

  sku: form.sku,
  brand: form.brand,
  shortDesc: form.shortDesc,

  tags: form.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean),

  material: form.material,
  capSize: form.capSize,
  length: form.length,
  density: form.density,
  texture: form.texture,
  color: form.color,

  rating: Number(form.rating),

  isFeatured: form.isFeatured,
  isBestSeller: form.isBestSeller,
  isNewArrival: form.isNewArrival,

images: productImages,

features,
faqs,
careGuides,
includedItems,
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
        `${API_URL}/categories`
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
    <div className="grid md:grid-cols-5 gap-6">
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
    <option value="">Select Gender</option>
    <option value="Men">Men</option>
    <option value="Women">Women</option>
    <option value="Unisex">Unisex</option>
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
<div className="grid md:grid-cols-3 gap-6">

  <div>
    <label className="block mb-2 text-sm text-slate-300">
      Material
    </label>

    <input
      type="text"
      value={form.material}
      onChange={(e) =>
        setForm({
          ...form,
          material: e.target.value,
        })
      }
      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white"
    />
  </div>

  <div>
    <label className="block mb-2 text-sm text-slate-300">
      Length
    </label>

    <input
      type="text"
      placeholder="22 inches"
      value={form.length}
      onChange={(e) =>
        setForm({
          ...form,
          length: e.target.value,
        })
      }
      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white"
    />
  </div>

  <div>
    <label className="block mb-2 text-sm text-slate-300">
      Density
    </label>

    <input
      type="text"
      placeholder="180%"
      value={form.density}
      onChange={(e) =>
        setForm({
          ...form,
          density: e.target.value,
        })
      }
      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white"
    />
  </div>

  <div>
    <label className="block mb-2 text-sm text-slate-300">
      Texture
    </label>

    <input
      type="text"
      value={form.texture}
      onChange={(e) =>
        setForm({
          ...form,
          texture: e.target.value,
        })
      }
      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white"
    />
  </div>

  <div>
    <label className="block mb-2 text-sm text-slate-300">
      Color
    </label>

    <input
      type="text"
      value={form.color}
      onChange={(e) =>
        setForm({
          ...form,
          color: e.target.value,
        })
      }
      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white"
    />
  </div>

  <div>
    <label className="block mb-2 text-sm text-slate-300">
      Cap Size
    </label>

    <input
      type="text"
      value={form.capSize}
      onChange={(e) =>
        setForm({
          ...form,
          capSize: e.target.value,
        })
      }
      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white"
    />
  </div>

</div>
<div className="flex gap-8">

  <label className="flex items-center gap-2 text-white">
    <input
      type="checkbox"
      checked={form.isFeatured}
      onChange={(e) =>
        setForm({
          ...form,
          isFeatured: e.target.checked,
        })
      }
    />
    Featured
  </label>

  <label className="flex items-center gap-2 text-white">
    <input
      type="checkbox"
      checked={form.isBestSeller}
      onChange={(e) =>
        setForm({
          ...form,
          isBestSeller: e.target.checked,
        })
      }
    />
    Best Seller
  </label>

  <label className="flex items-center gap-2 text-white">
    <input
      type="checkbox"
      checked={form.isNewArrival}
      onChange={(e) =>
        setForm({
          ...form,
          isNewArrival: e.target.checked,
        })
      }
    />
    New Arrival
  </label>

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
{/* Product Features */}

<div className="border border-white/10 rounded-2xl p-6">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold text-white">
      Product Features
    </h2>

    <button
      type="button"
      onClick={() =>
        setFeatures([
          ...features,
          {
            title: "",
            subtitle: "",
          },
        ])
      }
      className="px-4 py-2 bg-cyan-500 rounded-xl text-white"
    >
      + Add Feature
    </button>
  </div>

  {features.map((feature, index) => (
    <div
      key={index}
      className="grid md:grid-cols-3 gap-4 mb-4"
    >
      <input
        type="text"
        placeholder="Title"
        value={feature.title}
        onChange={(e) => {
          const copy = [...features];
          copy[index].title =
            e.target.value;
          setFeatures(copy);
        }}
        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white"
      />

      <input
        type="text"
        placeholder="Subtitle"
        value={feature.subtitle}
        onChange={(e) => {
          const copy = [...features];
          copy[index].subtitle =
            e.target.value;
          setFeatures(copy);
        }}
        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white"
      />

      <button
        type="button"
        onClick={() =>
          setFeatures(
            features.filter(
              (_, i) => i !== index
            )
          )
        }
        className="bg-red-500 rounded-xl text-white"
      >
        Remove
      </button>
    </div>
  ))}
</div>
{/* Product FAQ */}

<div className="border border-white/10 rounded-2xl p-6 mt-6">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold text-white">
      Product FAQ
    </h2>

    <button
      type="button"
      onClick={() =>
        setFaqs([
          ...faqs,
          {
            question: "",
            answer: "",
          },
        ])
      }
      className="px-4 py-2 bg-cyan-500 rounded-xl text-white"
    >
      + Add FAQ
    </button>
  </div>

  {faqs.map((faq, index) => (
    <div
      key={index}
      className="space-y-3 mb-4"
    >
      <input
        type="text"
        placeholder="Question"
        value={faq.question}
        onChange={(e) => {
          const copy = [...faqs];
          copy[index].question =
            e.target.value;
          setFaqs(copy);
        }}
        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white"
      />

      <textarea
        placeholder="Answer"
        value={faq.answer}
        onChange={(e) => {
          const copy = [...faqs];
          copy[index].answer =
            e.target.value;
          setFaqs(copy);
        }}
        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white"
      />

      <button
        type="button"
        onClick={() =>
          setFaqs(
            faqs.filter(
              (_, i) => i !== index
            )
          )
        }
        className="px-4 py-2 bg-red-500 rounded-xl text-white"
      >
        Remove
      </button>
    </div>
  ))}
</div>
{/* Care Guide */}

<div className="border border-white/10 rounded-2xl p-6 mt-6">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold text-white">
      Care Guide
    </h2>

    <button
      type="button"
      onClick={() =>
        setCareGuides([
          ...careGuides,
          {
            icon: "",
            title: "",
            steps: "",
          },
        ])
      }
      className="px-4 py-2 bg-cyan-500 rounded-xl text-white"
    >
      + Add Guide
    </button>
  </div>

  {careGuides.map((guide, index) => (
    <div
      key={index}
      className="grid md:grid-cols-4 gap-4 mb-4"
    >
      <input
        type="text"
        placeholder="Icon"
        value={guide.icon}
        onChange={(e) => {
          const copy = [...careGuides];
          copy[index].icon =
            e.target.value;
          setCareGuides(copy);
        }}
        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white"
      />

      <input
        type="text"
        placeholder="Title"
        value={guide.title}
        onChange={(e) => {
          const copy = [...careGuides];
          copy[index].title =
            e.target.value;
          setCareGuides(copy);
        }}
        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white"
      />

      <input
        type="text"
        placeholder="Steps"
        value={guide.steps}
        onChange={(e) => {
          const copy = [...careGuides];
          copy[index].steps =
            e.target.value;
          setCareGuides(copy);
        }}
        className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white"
      />

      <button
        type="button"
        onClick={() =>
          setCareGuides(
            careGuides.filter(
              (_, i) => i !== index
            )
          )
        }
        className="bg-red-500 rounded-xl text-white"
      >
        Remove
      </button>
    </div>
  ))}
</div>
{/* Included Items */}

<div className="border border-white/10 rounded-2xl p-6 mt-6">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold text-white">
      Included Items
    </h2>

    <button
      type="button"
      onClick={() =>
        setIncludedItems([
          ...includedItems,
          {
            text: "",
          },
        ])
      }
      className="px-4 py-2 bg-cyan-500 rounded-xl text-white"
    >
      + Add Item
    </button>
  </div>

  {includedItems.map((item, index) => (
    <div
      key={index}
      className="flex gap-4 mb-4"
    >
      <input
        type="text"
        placeholder="Item Name"
        value={item.text}
        onChange={(e) => {
          const copy = [...includedItems];
          copy[index].text =
            e.target.value;
          setIncludedItems(copy);
        }}
        className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white"
      />

      <button
        type="button"
        onClick={() =>
          setIncludedItems(
            includedItems.filter(
              (_, i) => i !== index
            )
          )
        }
        className="px-4 bg-red-500 rounded-xl text-white"
      >
        Remove
      </button>
    </div>
  ))}
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
          <div className="mt-4 w-40 space-y-2">
            <img
              src={mainPreview}
              alt="Preview"
              className="
              w-40
              h-40
              object-cover
              rounded-2xl
              border
              border-white/10
              "
            />

            <select
              value={mainMeta.angle}
              onChange={(e) =>
                setMainMeta((meta) => ({
                  ...meta,
                  angle: Number(e.target.value),
                }))
              }
              className="
            w-full
            px-3
            py-2
            rounded-xl
            bg-white/5
            border
            border-white/10
            text-sm
            text-slate-300
            "
            >
              {ANGLE_OPTIONS.map((angle) => (
                <option
                  key={angle}
                  value={angle}
                  className="bg-slate-900"
                >
                  {angle}&deg;
                  {angle === 0 ? " (front)" : ""}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={mainMeta.isTryOn}
                onChange={(e) =>
                  setMainMeta((meta) => ({
                    ...meta,
                    isTryOn: e.target.checked,
                  }))
                }
              />
              Use for try-on
            </label>
          </div>
        )}
      </div>

      {/* Gallery Images */}
      <div>
        <label className="block mb-1 text-sm font-medium text-slate-300">
          360 Product Images
        </label>

        <p className="mb-3 text-xs text-slate-500">
          Tick &ldquo;Use for try-on&rdquo; on the transparent wig cut-outs and set
          the angle each one was shot at. Virtual try-on loads only these, and
          cross-fades between the two nearest the viewer&rsquo;s head angle &mdash;
          a front (0&deg;) plus both profiles (45&deg; and 315&deg;) is the useful
          minimum.
        </p>

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

            setGalleryMeta(
              files.map(() => ({
                angle: 0,
                isTryOn: false,
              }))
            );
          }}
        />

        {galleryPreviews.length > 0 && (
          <div className="grid grid-cols-4 gap-4 mt-4">
            {galleryPreviews.map(
              (image, index) => (
                <div key={index} className="space-y-2">
                  <img
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

                  <select
                    value={
                      galleryMeta[index]?.angle ?? 0
                    }
                    onChange={(e) =>
                      setGalleryMeta((meta) =>
                        meta.map((item, i) =>
                          i === index
                            ? {
                                ...item,
                                angle: Number(
                                  e.target.value
                                ),
                              }
                            : item
                        )
                      )
                    }
                    className="
            w-full
            px-3
            py-2
            rounded-xl
            bg-white/5
            border
            border-white/10
            text-sm
            text-slate-300
            "
                  >
                    {ANGLE_OPTIONS.map((angle) => (
                      <option
                        key={angle}
                        value={angle}
                        className="bg-slate-900"
                      >
                        {angle}&deg;
                        {angle === 0 ? " (front)" : ""}
                      </option>
                    ))}
                  </select>

                  <label className="flex items-center gap-2 text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={
                        galleryMeta[index]?.isTryOn ??
                        false
                      }
                      onChange={(e) =>
                        setGalleryMeta((meta) =>
                          meta.map((item, i) =>
                            i === index
                              ? {
                                  ...item,
                                  isTryOn:
                                    e.target.checked,
                                }
                              : item
                          )
                        )
                      }
                    />
                    Use for try-on
                  </label>
                </div>
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
        to-brand-600
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