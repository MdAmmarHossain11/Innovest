// API Configuration
export const API_HOST = (
  process.env.REACT_APP_API_URL
  || process.env.REACT_APP_API_BASE_URL
  || 'http://localhost:8000'
).replace(/\/+$/, '');

export const API_URL = `${API_HOST}/api/`;

export const getMediaUrl = (value) => {
  if (!value || typeof value !== 'string') return '';
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  if (value.startsWith('//')) return `${window.location.protocol}${value}`;

  const path = value.replace(/\\/g, '/').replace(/^\/+/, '');
  return `${API_HOST}/${path.startsWith('media/') ? path : `media/${path}`}`;
};