import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          localStorage.setItem('accessToken', data.data.accessToken);
          localStorage.setItem('refreshToken', data.data.refreshToken);
          original.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(original);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        window.location.href = '/admin/login';
        //window.location.href = '/login';
        }
      }
    }
    return Promise.reject(err);
  }
);

// Auth
export const authApi = {
  register: (data: Record<string, string>) => api.post('/auth/register', data),
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  logout: (refreshToken: string) => api.post('/auth/logout', { refreshToken }),
  getMe: () => api.get('/auth/me'),
};

// Products
export const productsApi = {
  getAll: (params?: Record<string, unknown>) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  getCategories: () => api.get('/products/categories'),
  getRelated: (id: string) => api.get(`/products/${id}/related`),
};

// Cart
export const cartApi = {
  get: () => api.get('/cart'),
  add: (productId: string, quantity: number, variant?: Record<string, string>) =>
    api.post('/cart', { productId, quantity, variant }),
  update: (id: string, quantity: number) => api.put(`/cart/${id}`, { quantity }),
  remove: (id: string) => api.delete(`/cart/${id}`),
  clear: () => api.delete('/cart/clear'),
};
export const uploadApi = {
  image: (formData: FormData) =>
    api.post("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
// Orders
export const ordersApi = {
  create: (data: Record<string, unknown>) => api.post('/orders', data),
  getAll: (params?: Record<string, unknown>) => api.get('/orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  cancel: (id: string) => api.patch(`/orders/${id}/cancel`),
};

// User
export const userApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: Record<string, unknown>) => api.put('/users/profile', data),
  changePassword: (data: Record<string, string>) => api.patch('/users/password', data),
  getAddresses: () => api.get('/users/addresses'),
  addAddress: (data: Record<string, unknown>) => api.post('/users/addresses', data),
  updateAddress: (id: string, data: Record<string, unknown>) => api.put(`/users/addresses/${id}`, data),
  deleteAddress: (id: string) => api.delete(`/users/addresses/${id}`),
};

// Wishlist
export const wishlistApi = {
  get: () => api.get('/wishlist'),
  add: (productId: string) => api.post('/wishlist', { productId }),
  remove: (productId: string) => api.delete(`/wishlist/${productId}`),
};

// Reviews
export const reviewsApi = {
  getMyReviews: () => api.get('/reviews/my'),
   
  create: (data: Record<string, unknown>) => api.post('/reviews', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/reviews/${id}`, data),
  delete: (id: string) => api.delete(`/reviews/${id}`),
};
export const blogApi = {
  getAll: () => api.get('/blogs/published'),
};