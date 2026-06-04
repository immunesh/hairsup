import Link from "next/link";
import DeleteProductButton from "@/components/DeleteProductButton";

async function getProducts() {
  const res = await fetch(
    "http://localhost:5000/api/products",
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();

  return data.data || [];
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold">
            Products
          </h1>

          <p className="text-gray-500 mt-1">
            Manage all products
          </p>
        </div>

        <Link
          href="/admin/products/create"
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-medium"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow border overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-4">
                Image
              </th>

              <th className="text-left p-4">
                Product Name
              </th>

              <th className="text-left p-4">
                Slug
              </th>

              <th className="text-left p-4">
                Category
              </th>

              <th className="text-left p-4">
                Stock
              </th>

            

              <th className="text-left p-4">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center p-8 text-gray-500"
                >
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product: any) => (
                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-50"
                >
                  {/* IMAGE */}
                  <td className="p-4">
                    {product.images?.[0]?.url ? (
                      <>
                        <img
                          src={
                            product.images[0].url.startsWith(
                              "http"
                            )
                              ? product.images[0].url
                              : `http://localhost:5000${product.images[0].url}`
                          }
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />

                        {/* TEMP DEBUG */}
                        <p className="text-xs text-gray-400 mt-1 break-all">
                          {product.images[0].url}
                        </p>
                      </>
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </td>

                  {/* NAME */}
                  <td className="p-4 font-medium">
                    {product.name}
                  </td>

                  {/* SLUG */}
                  <td className="p-4">
                    {product.slug || "-"}
                  </td>

                  {/* CATEGORY */}
                  <td className="p-4">
                    {product.category?.name || "-"}
                  </td>

                  {/* STOCK */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.stock > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
 

                  {/* ACTIONS */}
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                      >
                        Edit
                      </Link>

                      <DeleteProductButton
                        id={product.id}
                      />
                    </div>
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