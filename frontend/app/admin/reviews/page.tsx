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
      <div className="p-6">
        Loading reviews...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Review Management
        </h1>

        <div className="bg-green-100 px-4 py-2 rounded">
          Total Reviews:{" "}
          {reviews.length}
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">
                Customer
              </th>

              <th className="p-3 text-left">
                Product
              </th>

              <th className="p-3 text-left">
                Rating
              </th>

              <th className="p-3 text-left">
                Review
              </th>

              <th className="p-3 text-left">
                Date
              </th>

              <th className="p-3 text-left">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {reviews.map((review) => (
              <tr
                key={review.id}
                className="border-t"
              >
                <td className="p-3">
                  {
                    review.user
                      ?.firstName
                  }{" "}
                  {
                    review.user
                      ?.lastName
                  }
                </td>

                <td className="p-3">
                  {
                    review.product
                      ?.name
                  }
                </td>

                <td className="p-3">
                  ⭐ {review.rating}/5
                </td>

                <td className="p-3 max-w-sm truncate">
                  {review.body}
                </td>

                <td className="p-3">
                  {new Date(
                    review.createdAt
                  ).toLocaleDateString()}
                </td>

                <td className="p-3">
                  <button
                    onClick={() =>
                      handleDelete(
                        review.id
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