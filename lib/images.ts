export function getCustomPhotos(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem('ck_custom_photos') || '{}'); } catch { return {}; }
}

export function setCustomPhoto(id: string, url: string) {
  const photos = getCustomPhotos();
  photos[id] = url;
  localStorage.setItem('ck_custom_photos', JSON.stringify(photos));
}

export function resetCustomPhotos() {
  localStorage.removeItem('ck_custom_photos');
}

export function getImageUrl(item: any): string {
  const photos = getCustomPhotos();
  if (item && photos[item.id]) return photos[item.id];
  if (item && item.image_url) return item.image_url;
  return 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80';
}
