import Link from "next/link";

async function getCategories() {
  const res = await fetch(
    "http://localhost:5000/api/categories",
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold">
            Categories
          </h1>
          <p className="text-gray-500 mt-1">
            Manage product categories
          </p>
        </div>

        <Link
          href="/admin/categories/create"
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-medium"
        >
          + Add Category
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Slug</th>
              <th className="text-left p-4">Gender</th>
              <th className="text-left p-4">Products</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center p-8 text-gray-500"
                >
                  No categories found
                </td>
              </tr>
            ) : (
              categories.map((category: any) => (
                <tr
                  key={category.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">
                    {category.name}
                  </td>

                  <td className="p-4 text-gray-600">
                    {category.slug}
                  </td>

                  <td className="p-4">
                    {category.gender ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                        {category.gender}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="p-4 font-medium">
                    {category._count?.products ?? 0}
                  </td>

                  <td className="p-4">
                    <Link
                      href={`/admin/categories/edit/${category.id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                    >
                      Edit
                    </Link>
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