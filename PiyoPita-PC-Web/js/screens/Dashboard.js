import { ic } from '../lib/icons.js';

export function renderQRModal() {
  return (
    '<div id="qr-modal" class="modal-overlay">' +
    '<div class="modal-content">' +
    '<div class="modal-header"><h2>歯科医院情報QRコード</h2></div>' +
    '<div class="qr-modal-body">' +
    '<div class="qr-placeholder">' +
    ic.qr +
    '</div>' +
    '<p>患者用アプリ「ぴよぴた」でこのQRコードを読み取ると、<br/>医院情報が自動的に連携されます。</p>' +
    '<button type="button" class="btn-download" onclick="showMockToast(\'QRコード画像をダウンロードしました\')">画像をダウンロード</button>' +
    '</div>' +
    '</div>' +
    '</div>'
  );
}

export function renderDashboard(content, path, { qrModalOpen } = { qrModalOpen: false }) {
  const nav = [
    { path: '/', label: 'ホーム', icon: ic.layout },
    { path: '/patients', label: '患者検索', icon: ic.users },
    { path: '/settings', label: '設定', icon: ic.settings }
  ];
  const navHtml = nav
    .map(function (n) {
      const active = path === n.path || (n.path !== '/' && path.indexOf(n.path) === 0);
      return '<a href="#' + n.path + '" class="' + (active ? 'active' : '') + '">' + n.icon + n.label + '</a>';
    })
    .join('');

  return (
    '<div class="dashboard">' +
    '<aside class="sidebar">' +
    '<div class="sidebar-header">' +
    '<div class="logo-icon">P</div>' +
    '<h1>ぴよぴた</h1>' +
    '</div>' +
    '<nav class="sidebar-nav">' +
    navHtml +
    '</nav>' +
    '<div class="sidebar-footer">' +
    '<button type="button" id="btn-logout">' +
    ic.logOut +
    'ログアウト</button>' +
    '</div>' +
    '</aside>' +
    '<div class="main-wrap">' +
    '<header class="header">' +
    '<div class="header-left">' +
    '<span class="label">医院名:</span>' +
    '<span class="clinic">ほりみき矯正歯科医院様</span>' +
    '</div>' +
    '<div class="header-actions">' +
    '<button type="button" class="btn" id="btn-qr">' +
    ic.qr +
    '<span>歯科医院情報QR</span></button>' +
    '<button type="button" class="btn" onclick="showMockToast(\'医院情報の編集画面を開きます\')">' +
    ic.edit +
    '<span>情報編集</span></button>' +
    '<span class="header-divider"></span>' +
    '<div class="header-icons">' +
    '<button type="button" onclick="showMockToast(\'通知一覧を開きます\')"><span class="badge red"></span>' +
    ic.bell +
    '</button>' +
    '<a href="#/messages"><button type="button"><span class="badge blue"></span>' +
    ic.message +
    '</button></a>' +
    '</div>' +
    '<div class="header-avatar"><img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop" alt="Doctor"/></div>' +
    '</div>' +
    '</header>' +
    '<main class="main"><div class="main-inner">' +
    content +
    '</div></main>' +
    '</div>' +
    (qrModalOpen ? renderQRModal() : '') +
    '</div>'
  );
}

