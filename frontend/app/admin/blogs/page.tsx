"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getAllBlogs,
  deleteBlog,
  publishBlog,
} from "@/lib/blog-admin-api";

export default function BlogsPage() {
  const [blogs, setBlogs] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const res =
        await getAllBlogs();

      setBlogs(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (
    id: string
  ) => {
    if (
      !window.confirm(
        "Delete this blog?"
      )
    )
      return;

    await deleteBlog(id);

    setBlogs((prev) =>
      prev.filter(
        (blog) => blog.id !== id
      )
    );
  };

  const handlePublish = async (
    id: string
  ) => {
    await publishBlog(id);

    loadBlogs();
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading blogs...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Blog Management
        </h1>

        <Link
          href="/admin/blogs/create"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Create Blog
        </Link>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">
                Title
              </th>

              <th className="p-3">
                Author
              </th>

              <th className="p-3">
                Status
              </th>

              <th className="p-3">
                Published
              </th>

              <th className="p-3">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {blogs.map((blog) => (
              <tr
                key={blog.id}
                className="border-t"
              >
                <td className="p-3">
                  {blog.title}
                </td>

                <td className="p-3">
                  {blog.author}
                </td>

                <td className="p-3">
                  {blog.isPublished
                    ? "✅ Published"
                    : "❌ Draft"}
                </td>

                <td className="p-3">
                  {blog.publishedAt
                    ? new Date(
                        blog.publishedAt
                      ).toLocaleDateString()
                    : "-"}
                </td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() =>
                      handlePublish(
                        blog.id
                      )
                    }
                    className="bg-blue-500 text-white px-3 py-2 rounded"
                  >
                    Toggle
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        blog.id
                      )
                    }
                    className="bg-red-500 text-white px-3 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}