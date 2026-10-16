// API Configuration
export const API_HOST = (
  process.env.REACT_APP_API_URL
  || process.env.REACT_APP_API_BASE_URL
  || 'http://localhost:8000'
).replace(/\/+$/, '');

export const API_URL = `${API_HOST}/api/`;

const mediaDirectories = new Set([
  'profile_pics',
  'profile_pictures',
  'community_attachments',
  'company_covers',
  'company_logos',
  'company_slides',
  'event_images',
  'event_covers',
]);

export const getMediaUrl = (value) => {
  if (!value || typeof value !== 'string') return '';
  if (/^https?:/i.test(value)) {
    try {
      const url = new URL(value);
      const isSignedStorageUrl = [...url.searchParams.keys()].some((key) =>
        /^(x-amz-signature|awsaccesskeyid|signature)$/i.test(key)
      );
      if (isSignedStorageUrl) {
        const pathParts = url.pathname.split('/').filter(Boolean);
        const mediaIndex = pathParts.findIndex((part) => {
          try {
            return mediaDirectories.has(decodeURIComponent(part));
          } catch {
            return false;
          }
        });
        if (mediaIndex >= 0) {
          return `${API_HOST}/media/${pathParts.slice(mediaIndex).join('/')}`;
        }
      }
    } catch {
      return value;
    }
    return value;
  }
  if (/^(data:|blob:)/i.test(value)) return value;
  if (value.startsWith('//')) return `${window.location.protocol}${value}`;

  const path = value.replace(/\\/g, '/').replace(/^\/+/, '');
  return `${API_HOST}/${path.startsWith('media/') ? path : `media/${path}`}`;
};