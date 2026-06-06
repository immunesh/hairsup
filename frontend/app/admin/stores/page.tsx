"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getAllStores,
  createStore,
  deleteStore,
} from "@/lib/store-admin-api";

export default function StoresPage() {
  const [stores, setStores] =
    useState<any[]>([]);

  const [form, setForm] =
    useState({
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      email: "",
      hours: "",
    });

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    const res =
      await getAllStores();

    setStores(res.data || []);
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    await createStore(form);

    setForm({
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      email: "",
      hours: "",
    });

    loadStores();
  };

  const handleDelete = async (
    id: string
  ) => {
    if (
      !window.confirm(
        "Delete store?"
      )
    )
      return;

    await deleteStore(id);

    setStores((prev) =>
      prev.filter(
        (s) => s.id !== id
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Store Locations
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow mb-8"
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Store Name"
            className="border p-3 rounded"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="Phone"
            className="border p-3 rounded"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="City"
            className="border p-3 rounded"
            value={form.city}
            onChange={(e) =>
              setForm({
                ...form,
                city:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="State"
            className="border p-3 rounded"
            value={form.state}
            onChange={(e) =>
              setForm({
                ...form,
                state:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="Pincode"
            className="border p-3 rounded"
            value={form.pincode}
            onChange={(e) =>
              setForm({
                ...form,
                pincode:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="Email"
            className="border p-3 rounded"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="Opening Hours"
            className="border p-3 rounded"
            value={form.hours}
            onChange={(e) =>
              setForm({
                ...form,
                hours:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="Address"
            className="border p-3 rounded"
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address:
                  e.target.value,
              })
            }
          />
        </div>

        <button
          className="bg-black text-white px-5 py-3 rounded mt-4"
          type="submit"
        >
          Add Store
        </button>
      </form>

      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">
                Name
              </th>
              <th className="p-3">
                City
              </th>
              <th className="p-3">
                Phone
              </th>
              <th className="p-3">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {stores.map(
              (store) => (
                <tr
                  key={store.id}
                  className="border-t"
                >
                  <td className="p-3">
                    {store.name}
                  </td>

                  <td className="p-3">
                    {store.city}
                  </td>

                  <td className="p-3">
                    {store.phone}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() =>
                        handleDelete(
                          store.id
                        )
                      }
                      className="bg-red-500 text-white px-3 py-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}