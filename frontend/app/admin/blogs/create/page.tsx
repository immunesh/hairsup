"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBlog } from "@/lib/blog-admin-api";

export default function CreateBlogPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [author, setAuthor] = useState("Admin");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await createBlog({
        title,
        slug,
        excerpt,
        content,
        image,
        author,
      });

      alert("Blog created");

      router.push("/admin/blogs");
    } catch (error) {
      console.error(error);
      alert("Failed to create blog");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Create Blog
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded shadow"
      >
        <input
          className="w-full border p-3 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <input
          className="w-full border p-3 rounded"
          placeholder="Slug"
          value={slug}
          onChange={(e) =>
            setSlug(e.target.value)
          }
        />

        <input
          className="w-full border p-3 rounded"
          placeholder="Author"
          value={author}
          onChange={(e) =>
            setAuthor(e.target.value)
          }
        />

        <input
          className="w-full border p-3 rounded"
          placeholder="Image URL"
          value={image}
          onChange={(e) =>
            setImage(e.target.value)
          }
        />

        <textarea
          className="w-full border p-3 rounded"
          rows={3}
          placeholder="Excerpt"
          value={excerpt}
          onChange={(e) =>
            setExcerpt(e.target.value)
          }
        />

        <textarea
          className="w-full border p-3 rounded"
          rows={10}
          placeholder="Content"
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
        />

        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded"
        >
          Create Blog
        </button>
      </form>
    </div>
  );
}