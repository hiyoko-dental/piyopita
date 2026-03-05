import { icons } from '../lib/icons.js';
import { state } from '../core/state.js';
import { renderBottomNav } from './BottomNav.js';

export function renderMenu() {
  const name = (state.patientInfo && state.patientInfo.nickname) ? state.patientInfo.nickname : 'ゲスト';
  const clinic = (state.patientInfo && state.patientInfo.clinicName) ? state.patientInfo.clinicName : '未登録';

  return '<div class="screen menu-screen">' +
    '<div class="menu-header">' +
      '<div class="profile">' +
        '<div class="avatar">' + icons.bird + '</div>' +
        '<div><h1>' + name + '</h1><p>' + clinic + '</p></div>' +
      '</div>' +
    '</div>' +
    '<div class="menu-list">' +
      '<button type="button" class="menu-item" data-nav="messages"><div class="left"><div class="icon-wrap">' + icons.message + '</div><div><p class="label">メッセージ</p><p class="desc">医院とのチャット</p></div></div>' + icons.chevronRight + '</button>' +
      '<button type="button" class="menu-item" data-alert="アカウント設定画面は準備中です"><div class="left"><div class="icon-wrap">' + icons.user + '</div><div><p class="label">アカウント設定</p><p class="desc">プロフィール・ニックネーム変更</p></div></div>' + icons.chevronRight + '</button>' +
      '<button type="button" class="menu-item" data-nav="device-info"><div class="left"><div class="icon-wrap">' + icons.stethoscope + '</div><div><p class="label">使用装置について</p><p class="desc">装置の使い方・注意点</p></div></div>' + icons.chevronRight + '</button>' +
      '<button type="button" class="menu-item" data-alert="ヘルプ画面は準備中です"><div class="left"><div class="icon-wrap">' + icons.helpCircle + '</div><div><p class="label">ヘルプ</p><p class="desc">使い方・よくある質問</p></div></div>' + icons.chevronRight + '</button>' +
      '<button type="button" class="menu-item" data-alert="お知らせ画面は準備中です"><div class="left"><div class="icon-wrap">' + icons.bell + '</div><div><p class="label">お知らせ</p><p class="desc">新機能・更新情報</p></div></div>' + icons.chevronRight + '</button>' +
      '<button type="button" class="menu-item logout" id="menu-logout"><div class="left"><div class="icon-wrap">' + icons.logOut + '</div><div><p class="label">ログアウト</p><p class="desc">アプリからログアウトします</p></div></div>' + icons.chevronRight + '</button>' +
    '</div>' +
    '<div class="menu-footer"><p>ぴよぴた (PiyoPita)</p><p>Version 1.0.0</p><p>© 2026 PiyoPita. All rights reserved.</p></div>' +
    renderBottomNav('menu') +
  '</div>';
}
