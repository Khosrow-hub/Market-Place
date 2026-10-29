export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    VERIFY_EMAIL: '/api/auth/verify-email',
    AMAZON_LOGIN: '/api/auth/amazon-login',
    ALIBABA_LOGIN: '/api/auth/alibaba-login',
  },
  USERS: {
    ME: '/api/users/me',
    UPDATE_PROFILE: '/api/users/update-profile',
    CHANGE_PASSWORD: '/api/users/change-password',
    DELETE_ACCOUNT: '/api/users/delete-account',
  },
  PRODUCTS: {
    BASE: '/api/products',
    FEATURED: '/api/products/featured',
    SEARCH: '/api/products/search',
    CATEGORY: (categoryId: string) => `/api/products/category/${categoryId}`,
    BY_ID: (id: string) => `/api/products/${id}`,
  },
  ORDERS: {
    BASE: '/api/orders',
    BY_ID: (id: string) => `/api/orders/${id}`,
    CANCEL: (id: string) => `/api/orders/${id}/cancel`,
    RETURN: (id: string) => `/api/orders/${id}/return`,
  },
  ADMIN: {
    STATS: '/api/admin/stats',
    USERS: '/api/admin/users',
    USER: (id: string) => `/api/admin/users/${id}`,
    PRODUCTS: '/api/admin/products',
    PRODUCT: (id: string) => `/api/admin/products/${id}`,
  },
  HEALTH: '/api/health',
};

export const ROLES = {
  USER: 'user',
  SELLER: 'seller',
  ADMIN: 'admin',
  OWNER: 'owner',
};

export const LANGUAGES = {
  DARI: 'dari',
  PASHTU: 'pashto',
  ENGLISH: 'english',
};

export const CURRENCIES = {
  USD: 'USD',
  AFN: 'AFN',
  EUR: 'EUR',
};