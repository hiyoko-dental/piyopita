import { icons } from '../lib/icons.js';

export function renderTop() {
  return '<div class="screen top-screen">' +
    '<div class="top-logo">' +
      '<div class="top-logo-icon">' + icons.bird.replace('width="24" height="24"','width="80" height="80"') + '</div>' +
      '<h1>ぴよぴた</h1>' +
      '<p class="sub">PiyoPita</p>' +
      '<p class="tagline">歯科矯正を楽しく続けよう！</p>' +
    '</div>' +
    '<div class="top-buttons">' +
      '<button type="button" class="btn-primary" data-nav="terms">歯科医師との連携</button>' +
      '<button type="button" class="btn-outline" data-alert="データ引継ぎ機能は準備中です">データ引継ぎ</button>' +
      '<button type="button" class="btn-outline" data-alert="お問い合わせフォームは準備中です">お問い合わせ</button>' +
    '</div>' +
    '<div class="top-footer">© 2026 PiyoPita. All rights reserved.</div>' +
  '</div>';
}
