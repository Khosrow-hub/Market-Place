import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    AMAZON_LOGIN: '/auth/amazon-login',
    ALIBABA_LOGIN: '/auth/alibaba-login',
  },
  USERS: {
    ME: '/users/me',
    UPDATE_PROFILE: '/users/update-profile',
    CHANGE_PASSWORD: '/users/change-password',
    DELETE_ACCOUNT: '/users/delete-account',
  },
  PRODUCTS: {
    BASE: '/products',
    FEATURED: '/products/featured',
    SEARCH: '/products/search',
    CATEGORY: (categoryId) => `/products/category/${categoryId}`, 
    BY_ID: (id) => `/products/${id}`, 
  },
  ORDERS: {
    BASE: '/orders',
    BY_ID: (id) => `/orders/${id}`, 
    CANCEL: (id) => `/orders/${id}/cancel`, 
    RETURN: (id) => `/orders/${id}/return`, 
  },
  ADMIN: {
    STATS: '/admin/stats',
    USERS: '/admin/users',
    USER: (id) => `/admin/users/${id}`, 
    PRODUCTS: '/admin/products',
    PRODUCT: (id) => `/admin/products/${id}`, 
  },
  HEALTH: '/health',
};

// API service functions
export const authAPI = {
  register: (data) => api.post(API_ENDPOINTS.AUTH.REGISTER, data),
  login: (data) => api.post(API_ENDPOINTS.AUTH.LOGIN, data),
  logout: () => api.post(API_ENDPOINTS.AUTH.LOGOUT),
  forgotPassword: (email) => api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),
  resetPassword: (data) => api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data),
  verifyEmail: (token) => api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token }),
  resendVerification: (email) => api.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, { email }),
  amazonLogin: (data) => api.post(API_ENDPOINTS.AUTH.AMAZON_LOGIN, data),
  alibabaLogin: (data) => api.post(API_ENDPOINTS.AUTH.ALIBABA_LOGIN, data),
  getProfile: () => api.get(API_ENDPOINTS.USERS.ME),
  updateProfile: (data) => api.patch(API_ENDPOINTS.USERS.UPDATE_PROFILE, data),
  changePassword: (data) => api.patch(API_ENDPOINTS.USERS.CHANGE_PASSWORD, data),
  deleteAccount: () => api.delete(API_ENDPOINTS.USERS.DELETE_ACCOUNT),
};

export const productAPI = {
  getAll: (params) => api.get(API_ENDPOINTS.PRODUCTS.BASE, { params }),
  getFeatured: () => api.get(API_ENDPOINTS.PRODUCTS.FEATURED),
  getById: (id) => api.get(API_ENDPOINTS.PRODUCTS.BY_ID(id)),
  search: (query) => api.get(API_ENDPOINTS.PRODUCTS.SEARCH, { params: { q: query } }),
  getByCategory: (categoryId) => api.get(API_ENDPOINTS.PRODUCTS.CATEGORY(categoryId)),
  create: (data) => api.post(API_ENDPOINTS.PRODUCTS.BASE, data),
  update: (id, data) => api.patch(`${API_ENDPOINTS.PRODUCTS.BY_ID(id)}`, data),
  delete: (id) => api.delete(API_ENDPOINTS.PRODUCTS.BY_ID(id)),
};

export const orderAPI = {
  getAll: (params) => api.get(API_ENDPOINTS.ORDERS.BASE, { params }),
  getById: (id) => api.get(API_ENDPOINTS.ORDERS.BY_ID(id)),
  create: (data) => api.post(API_ENDPOINTS.ORDERS.BASE, data),
  cancel: (id) => api.patch(API_ENDPOINTS.ORDERS.CANCEL(id)),
  return: (id) => api.patch(API_ENDPOINTS.ORDERS.RETURN(id)),
};

export const adminAPI = {
  getStats: () => api.get(API_ENDPOINTS.ADMIN.STATS),
  getAllUsers: (params) => api.get(API_ENDPOINTS.ADMIN.USERS, { params }),
  getUser: (id) => api.get(API_ENDPOINTS.ADMIN.USER(id)),
  updateUser: (id, data) => api.patch(API_ENDPOINTS.ADMIN.USER(id), data),
  deleteUser: (id) => api.delete(API_ENDPOINTS.ADMIN.USER(id)),
  getAllProducts: (params) => api.get(API_ENDPOINTS.ADMIN.PRODUCTS, { params }),
  getProduct: (id) => api.get(API_ENDPOINTS.ADMIN.PRODUCT(id)),
  updateProduct: (id, data) => api.patch(API_ENDPOINTS.ADMIN.PRODUCT(id), data),
  deleteProduct: (id) => api.delete(API_ENDPOINTS.ADMIN.PRODUCT(id)),
};

export { api };

export default {
  authAPI,
  productAPI,
  orderAPI,
  adminAPI,
};

export const ROLES = {
  USER: 'user',
  SELLER: 'seller',
  ADMIN: 'admin',
  OWNER: 'owner'
};
