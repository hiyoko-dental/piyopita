import { icons } from '../lib/icons.js';

export function renderTerms() {
  return '<div class="screen">' +
    '<header class="header">' +
      '<button type="button" class="btn-icon" data-back aria-label="戻る">' + icons.arrowLeft + '</button>' +
      '<h1>利用規約の確認</h1>' +
    '</header>' +
    '<div class="terms-content">' +
      '<p>ぴよぴたをご利用いただくには、以下の規約への同意が必要です。</p>' +
      '<button type="button" class="link-card" data-alert="利用規約の詳細ページを開きます"><span>利用規約</span>' + icons.externalLink + '</button>' +
      '<button type="button" class="link-card" data-alert="プライバシーポリシーの詳細ページを開きます"><span>プライバシーポリシー</span>' + icons.externalLink + '</button>' +
      '<div class="checkbox-card">' +
        '<label><input type="checkbox" id="terms-agree"/> <span>利用規約およびプライバシーポリシーを確認し、同意します</span></label>' +
      '</div>' +
      '<div class="note-box"><p><strong>※ 注意事項</strong><br/>この連携により、歯科医師があなたの装置装着記録を確認できるようになります。</p></div>' +
    '</div>' +
    '<div class="terms-footer">' +
      '<button type="button" class="btn-primary" id="terms-submit" disabled>同意してください</button>' +
    '</div>' +
  '</div>';
}
