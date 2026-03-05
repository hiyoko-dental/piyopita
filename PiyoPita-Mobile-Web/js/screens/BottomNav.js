/**
 * ボトムナビ（カレンダー・記録QR・ゲーム・メニューで共通）
 */
import { icons } from '../lib/icons.js';

export function renderBottomNav(active) {
  const items = [
    { path: 'record-qr', icon: icons.qrCode, label: 'QR' },
    { path: 'calendar', icon: icons.calendar, label: 'CALENDAR' },
    { path: 'game', icon: icons.gamepad, label: 'GAME' },
    { path: 'menu', icon: icons.menu, label: 'MENU' }
  ];
  return '<nav class="bottom-nav"><div class="bottom-nav-inner">' +
    items.map(it => {
      const cls = 'bottom-nav-item' + (active === it.path ? ' active' : '');
      return '<button type="button" class="' + cls + '" data-nav="' + it.path + '">' + it.icon + '<span>' + it.label + '</span></button>';
    }).join('') +
    '</div></nav>';
}
