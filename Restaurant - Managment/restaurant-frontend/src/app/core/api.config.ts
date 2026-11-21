export const API_CONFIG = {
  baseUrl: 'http://localhost:8080/api',
  endpoints: {
    login: '/auth/login',
    signup: '/auth/signup',
    products: '/products',
    categories: '/categories',
  },
} as const;
