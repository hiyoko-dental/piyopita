/**
 * ハッシュルーティング
 */
export function getHashPath() {
  const hash = window.location.hash.slice(1) || '';
  const q = hash.indexOf('?');
  return q >= 0 ? hash.slice(0, q) : hash;
}

export function getHashSegments() {
  const path = getHashPath();
  if (path === '' || path === '/') return { base: '/', id: null };
  const parts = path.split('/').filter(Boolean);
  if (parts[0] === 'patients' && parts[1]) return { base: '/patients/:id', id: parts[1] };
  return { base: '/' + (parts[0] || ''), id: parts[1] || null };
}

export function navigateTo(path) {
  window.location.hash = path || '/';
}
