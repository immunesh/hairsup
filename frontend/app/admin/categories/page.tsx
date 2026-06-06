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
  <div className="p-8">
    {/* Header */}
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold text-white">
          Categories
        </h1>

        <p className="text-slate-400 mt-2">
          Manage product categories
        </p>
      </div>

      <Link
        href="/admin/categories/create"
        className="
        px-6
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

        shadow-[0_0_25px_rgba(56,189,248,0.35)]
        "
      >
        + Add Category
      </Link>
    </div>

    {/* Categories Card */}
    <div
      className="
      rounded-3xl

      border
      border-white/10

      bg-white/5
      backdrop-blur-xl

      overflow-x-auto
      "
    >
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="text-left p-5 text-slate-300">
              Name
            </th>

            <th className="text-left p-5 text-slate-300">
              Slug
            </th>

            <th className="text-left p-5 text-slate-300">
              Gender
            </th>

            <th className="text-left p-5 text-slate-300">
              Products
            </th>

            <th className="text-left p-5 text-slate-300">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="
                p-12
                text-center
                text-slate-500
                "
              >
                No categories found
              </td>
            </tr>
          ) : (
            categories.map((category: any) => (
              <tr
                key={category.id}
                className="
                border-b
                border-white/5

                hover:bg-white/5

                transition-all
                duration-300
                "
              >
                {/* Name */}
                <td className="p-5">
                  <div className="font-medium text-white">
                    {category.name}
                  </div>
                </td>

                {/* Slug */}
                <td className="p-5 text-slate-400">
                  {category.slug}
                </td>

                {/* Gender */}
                <td className="p-5">
                  {category.gender ? (
                    <span
                      className="
                      inline-flex
                      items-center

                      px-3
                      py-1

                      rounded-full

                      text-xs
                      font-semibold

                      bg-purple-500/20
                      text-purple-300

                      border
                      border-purple-500/20
                      "
                    >
                      {category.gender}
                    </span>
                  ) : (
                    <span className="text-slate-500">
                      —
                    </span>
                  )}
                </td>

                {/* Product Count */}
                <td className="p-5">
                  <span
                    className="
                    inline-flex
                    items-center

                    px-3
                    py-1

                    rounded-full

                    text-xs
                    font-semibold

                    bg-cyan-500/20
                    text-cyan-300

                    border
                    border-cyan-500/20
                    "
                  >
                    {category._count?.products ?? 0}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-5">
                  <Link
                    href={`/admin/categories/edit/${category.id}`}
                    className="
                    inline-flex
                    items-center

                    px-4
                    py-2

                    rounded-xl

                    bg-cyan-500/20
                    border
                    border-cyan-500/30

                    text-cyan-300

                    hover:bg-cyan-500/30
                    hover:text-white

                    transition-all
                    duration-300

                    hover:shadow-[0_0_15px_rgba(34,211,238,0.25)]
                    "
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