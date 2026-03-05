import { icons } from '../lib/icons.js';
import { renderBottomNav } from './BottomNav.js';

export function renderRecordQR() {
  return '<div class="screen qr-screen">' +
    '<header class="record-qr-header">' +
      '<h1>記録する</h1>' +
      '<button type="button" class="btn-icon" data-nav="calendar">' + icons.x + '</button>' +
    '</header>' +
    '<div class="qr-area" id="record-qr-area-tappable">' +
      '<div class="qr-bg"></div>' +
      '<div class="qr-center-wrapper">' +
        '<div class="qr-frame record-qr-frame">' +
          '<div class="qr-frame-inner">' +
            '<div class="qr-corner qr-corner--tl"></div><div class="qr-corner qr-corner--tr"></div><div class="qr-corner qr-corner--bl"></div><div class="qr-corner qr-corner--br"></div>' +
            '<div id="record-qr-success" class="qr-success hidden"><div class="qr-success-icon">' + icons.scan + '</div></div>' +
          '</div>' +
        '</div>' +
        '<p class="qr-hint" id="record-qr-hint" style="margin-top:2rem;">装置のQRコードを\n枠内に合わせてください</p>' +
        '<p class="qr-hint qr-tap-hint" style="margin-top:0.5rem; opacity: 0.9; font-size: 0.8rem;">（画面をタップすると読み取ります）</p>' +
      '</div>' +
      '<button type="button" class="peeled-btn" id="peeled-btn" style="z-index: 10;">' + icons.alertCircle + ' シールが剥がれた？</button>' +
    '</div>' +
    renderBottomNav('record-qr') +
  '</div>';
}
