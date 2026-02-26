// Manage all the API

// Get base URL from environment or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  GEMS_ENDPOINT: '/api/gems',
  AUTH_ENDPOINT: '/api/auth',
  SELLERS_ENDPOINT: '/api/sellers',
  COUNTRIES_ENDPOINT: '/api/countries',
  TIMEOUT: 30000,
};

export default API_CONFIG;