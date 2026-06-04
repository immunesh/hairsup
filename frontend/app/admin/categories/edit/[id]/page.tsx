import Link from "next/link";
import EditCategoryForm from "@/components/admin/EditCategoryForm";

async function getCategory(id: string) {
  const res = await fetch(
    `http://localhost:5000/api/categories/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(
      "Failed to fetch category"
    );
  }

  return res.json();
}

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const category = await getCategory(
    params.id
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">
          Edit Category
        </h1>

        <Link
          href="/admin/categories"
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Back
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <EditCategoryForm
          category={category}
        />
      </div>
    </div>
  );
}