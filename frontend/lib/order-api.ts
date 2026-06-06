import { api } from "./api";

export const getAllOrders = async () => {
  const res = await api.get("/orders/admin/all");
  return res.data;
};

export const updateOrderStatus = async (
  id: string,
  status: string
) => {
  const res = await api.put(
    `/orders/admin/${id}/status`,
    { status }
  );

  return res.data;
};