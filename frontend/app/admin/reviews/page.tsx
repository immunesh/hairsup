"use client";

import { useEffect, useState } from "react";
import {
  getAllReviews,
  deleteReview,
} from "@/lib/review-admin-api";

export default function AdminReviewsPage() {
  const [reviews, setReviews] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const res =
        await getAllReviews();

      setReviews(res.data || []);
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
        "Delete this review?"
      )
    )
      return;

    try {
      await deleteReview(id);

      setReviews((prev) =>
        prev.filter(
          (review) =>
            review.id !== id
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

 if (loading) {
  return (
    <div className="p-8">
      <div
        className="
        rounded-3xl

        bg-white/5
        backdrop-blur-xl

        border
        border-white/10

        p-10

        text-center
        text-slate-400
        "
      >
        Loading reviews...
      </div>
    </div>
  );
}

return (
  <div className="p-8">
    {/* Header */}
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold text-white">
          Review Management
        </h1>

        <p className="text-slate-400 mt-2">
          Manage customer product reviews
        </p>
      </div>

      <div
        className="
        px-5
        py-3

        rounded-2xl

        bg-emerald-500/10
        border
        border-emerald-500/20

        text-emerald-300
        font-medium
        "
      >
        Total Reviews: {reviews.length}
      </div>
    </div>

    {/* Reviews Table */}
    <div
      className="
      rounded-3xl

      bg-white/5
      backdrop-blur-xl

      border
      border-white/10

      overflow-hidden
      "
    >
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="p-5 text-left text-slate-300">
              Customer
            </th>

            <th className="p-5 text-left text-slate-300">
              Product
            </th>

            <th className="p-5 text-left text-slate-300">
              Rating
            </th>

            <th className="p-5 text-left text-slate-300">
              Review
            </th>

            <th className="p-5 text-left text-slate-300">
              Date
            </th>

            <th className="p-5 text-left text-slate-300">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {reviews.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="
                p-12
                text-center
                text-slate-500
                "
              >
                No reviews found
              </td>
            </tr>
          ) : (
            reviews.map((review) => (
              <tr
                key={review.id}
                className="
                border-b
                border-white/5

                hover:bg-white/5

                transition-all
                duration-300
                "
              >
                {/* Customer */}
                <td className="p-5">
                  <div className="font-medium text-white">
                    {review.user?.firstName}{" "}
                    {review.user?.lastName}
                  </div>
                </td>

                {/* Product */}
                <td className="p-5 text-white">
                  {review.product?.name}
                </td>

                {/* Rating */}
                <td className="p-5">
                  <span
                    className="
                    px-3
                    py-1

                    rounded-full

                    text-xs
                    font-semibold

                    bg-yellow-500/20
                    text-yellow-300

                    border
                    border-yellow-500/20
                    "
                  >
                    ⭐ {review.rating}/5
                  </span>
                </td>

                {/* Review */}
                <td className="p-5 max-w-md">
                  <p className="text-slate-300 truncate">
                    {review.body}
                  </p>
                </td>

                {/* Date */}
                <td className="p-5 text-slate-400">
                  {new Date(
                    review.createdAt
                  ).toLocaleDateString()}
                </td>

                {/* Action */}
                <td className="p-5">
                  <button
                    onClick={() =>
                      handleDelete(
                        review.id
                      )
                    }
                    className="
                    px-4
                    py-2

                    rounded-xl

                    bg-red-500/20
                    border
                    border-red-500/30

                    text-red-300

                    hover:bg-red-500/30
                    hover:text-white

                    transition-all
                    duration-300
                    "
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);
}