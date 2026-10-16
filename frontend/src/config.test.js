import { API_HOST, getMediaUrl } from './config';

describe('getMediaUrl', () => {
  test('rewrites expired signed storage URLs to stable API media URLs', () => {
    const signedUrl = 'https://storage.example.test/bucket/profile_pics/avatar.png?X-Amz-Signature=expired';

    expect(getMediaUrl(signedUrl)).toBe(
      `${API_HOST}/media/profile_pics/avatar.png`
    );
  });

  test('preserves unrelated external image URLs', () => {
    const imageUrl = 'https://images.example.test/avatar.png';

    expect(getMediaUrl(imageUrl)).toBe(imageUrl);
  });
});
