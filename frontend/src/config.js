// API Configuration
export const API_HOST = (
  process.env.REACT_APP_API_URL
  || process.env.REACT_APP_API_BASE_URL
  || 'http://localhost:8000'
).replace(/\/+$/, '');

export const API_URL = `${API_HOST}/api/`;