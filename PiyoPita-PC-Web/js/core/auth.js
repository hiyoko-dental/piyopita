/**
 * 認証状態（メモリ上・ページ読み込みでリセット）
 */
let isAuth = false;

export function isAuthenticated() {
  return isAuth;
}

export function setAuthenticated(value) {
  isAuth = value;
}
