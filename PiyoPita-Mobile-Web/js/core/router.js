/**
 * ハッシュルーティング
 */
export const routes = {
  '': 'Top',
  'terms': 'Terms',
  'qr-scan': 'QRScan',
  'manual-clinic': 'ManualClinic',
  'registration': 'Registration',
  'calendar': 'Calendar',
  'record-qr': 'RecordQR',
  'record-confirm': 'RecordConfirm',
  'game': 'Game',
  'menu': 'Menu',
  'device-info': 'DeviceInfo',
  'messages': 'Messages'
};

export function getPath() {
  const hash = window.location.hash.slice(1) || '';
  const q = hash.indexOf('?');
  return q >= 0 ? hash.slice(0, q) : hash;
}

export function getRouteState() {
  const path = getPath();
  const query = {};
  const idx = (window.location.hash || '').indexOf('?');
  if (idx >= 0) {
    const params = new URLSearchParams(window.location.hash.slice(idx));
    params.forEach((v, k) => { query[k] = v; });
  }
  return { path, evaluation: query.evaluation || null, from: query.from || null, query };
}

export function navigateTo(path, query) {
  const q = query ? '?' + new URLSearchParams(query).toString() : '';
  window.location.hash = (path || '') + q;
}
