import { icons } from '../lib/icons.js';

export function renderQRScan() {
  return '<div class="screen qr-screen">' +
    '<header class="header header--dark">' +
      '<button type="button" class="btn-icon" data-back>' + icons.arrowLeft + '</button>' +
      '<h1>QRコード読み取り</h1>' +
    '</header>' +
    '<div class="qr-area" id="qr-area-tappable">' +
      '<div class="qr-bg"></div>' +
      '<div class="qr-center-wrapper">' +
        '<div class="qr-frame">' +
          '<div class="qr-frame-inner">' +
            '<div class="qr-corner qr-corner--tl"></div><div class="qr-corner qr-corner--tr"></div><div class="qr-corner qr-corner--bl"></div><div class="qr-corner qr-corner--br"></div>' +
            '<div id="qr-success" class="qr-success hidden">' +
              '<div class="qr-success-icon">' + icons.qrCode + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<p class="qr-hint" id="qr-hint" style="margin-top:2rem;">歯科医院から受け取ったQRコードを枠内に合わせてください</p>' +
        '<p class="qr-hint qr-tap-hint" style="margin-top:0.5rem; opacity: 0.9; font-size: 0.8rem;">（画面をタップすると読み取ります）</p>' +
        '<button type="button" class="qr-cant-read-btn" id="qr-cant-read-btn" style="margin-top:1.5rem; position: relative; z-index: 10;">読み取りできない場合</button>' +
      '</div>' +
    '</div>' +
  '</div>';
}
