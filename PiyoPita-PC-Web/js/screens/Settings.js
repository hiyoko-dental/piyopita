import { ic } from '../lib/icons.js';

export function renderSettings(activeTab, staffList) {
  const tabs = [
    { id: 'clinic', label: '医院情報', icon: ic.building },
    { id: 'account', label: 'アカウント', icon: ic.user },
    { id: 'staff', label: 'スタッフ管理', icon: ic.shield }
  ];
  const tabButtons = tabs
    .map(function (t) {
      return (
        '<button type="button" class="' +
        (activeTab === t.id ? 'active' : '') +
        '" data-tab="' +
        t.id +
        '">' +
        t.icon +
        t.label +
        '</button>'
      );
    })
    .join('');

  const staffRows = staffList
    .map(function (s) {
      return (
        '<tr><td style="font-weight:500">' +
        s.name +
        '</td><td>' +
        s.role +
        '</td><td>' +
        s.email +
        '</td>' +
        '<td><span class="badge ' +
        (s.status === 'active' ? 'active' : 'inactive') +
        '">' +
        (s.status === 'active' ? '有効' : '無効') +
        '</span></td>' +
        '<td class="actions">' +
        '<button type="button" onclick="showMockToast(\'スタッフ情報を編集します\')">' +
        ic.edit2 +
        '</button>' +
        '<button type="button" class="danger" data-delete="' +
        s.id +
        '">' +
        ic.trash +
        '</button>' +
        '</td></tr>'
      );
    })
    .join('');

  return (
    '<div class="settings-header">' +
    '<div><h1 class="page-title">設定</h1><p class="page-desc">医院情報やアカウント設定を管理します</p></div>' +
    '<button type="button" class="btn btn-primary" onclick="showMockToast(\'設定内容を保存しました\')">' +
    ic.save +
    '変更を保存</button>' +
    '</div>' +
    '<div class="tabs-list">' +
    tabButtons +
    '</div>' +
    '<div id="tab-clinic" class="tab-content' +
    (activeTab === 'clinic' ? ' active' : '') +
    '">' +
    '<div class="settings-grid">' +
    '<div class="card settings-card">' +
    '<div class="card-header"><h3 class="card-title">基本情報</h3><p class="card-description">医院の基本的な情報を設定します</p></div>' +
    '<div class="card-content">' +
    '<div class="form-group"><label>医院名</label><div class="input-wrap"><span class="icon">' +
    ic.building +
    '</span><input value="ほりみき矯正歯科医院"/></div></div>' +
    '<div class="form-group"><label>住所</label><div class="input-wrap"><span class="icon">' +
    ic.mapPin +
    '</span><input value="東京都渋谷区神南1-1-1"/></div></div>' +
    '<div class="row-2">' +
    '<div class="form-group"><label>電話番号</label><div class="input-wrap"><span class="icon">' +
    ic.phone +
    '</span><input value="03-1234-5678"/></div></div>' +
    '<div class="form-group"><label>代表メールアドレス</label><div class="input-wrap"><span class="icon">' +
    ic.mail +
    '</span><input value="info@horimiki-dental.com"/></div></div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div class="card settings-card">' +
    '<div class="card-header"><h3 class="card-title">診療時間・休診日</h3><p class="card-description">アプリ上で患者に表示される診療時間です</p></div>' +
    '<div class="card-content">' +
    '<div class="form-group"><label>平日診療時間</label><div style="display:flex;align-items:center;gap:0.5rem"><div class="input-wrap"><span class="icon">' +
    ic.clock +
    '</span><input value="10:00"/></div>～<div class="input-wrap"><span class="icon">' +
    ic.clock +
    '</span><input value="19:00"/></div></div></div>' +
    '<div class="form-group"><label>土日祝診療時間</label><div style="display:flex;align-items:center;gap:0.5rem"><div class="input-wrap"><span class="icon">' +
    ic.clock +
    '</span><input value="10:00"/></div>～<div class="input-wrap"><span class="icon">' +
    ic.clock +
    '</span><input value="17:00"/></div></div></div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div id="tab-account" class="tab-content' +
    (activeTab === 'account' ? ' active' : '') +
    '">' +
    '<div class="card settings-card" style="max-width:42rem">' +
    '<div class="card-header"><h3 class="card-title">ログイン情報</h3><p class="card-description">管理画面へのログインに使用する情報です</p></div>' +
    '<div class="card-content">' +
    '<div class="form-group"><label>ログインID</label><div class="input-wrap"><span class="icon">' +
    ic.user +
    '</span><input value="admin_horimiki" readonly/><p class="hint">※ログインIDの変更はサポートへお問い合わせください</p></div></div>' +
    '<div class="form-group"><label>現在のパスワード</label><div class="input-wrap"><span class="icon">' +
    ic.lock +
    '</span><input type="password" placeholder="••••••••"/></div></div>' +
    '<div class="row-2"><div class="form-group"><label>新しいパスワード</label><div class="input-wrap"><span class="icon">' +
    ic.lock +
    '</span><input type="password" placeholder="新しいパスワード"/></div></div><div class="form-group"><label>パスワード確認</label><div class="input-wrap"><span class="icon">' +
    ic.lock +
    '</span><input type="password" placeholder="もう一度入力"/></div></div></div>' +
    '</div>' +
    '<div class="card-footer" style="border-top:1px solid var(--border-light);padding:1rem;display:flex;justify-content:flex-end"><button type="button" class="btn btn-outline" onclick="showMockToast(\'パスワードを変更しました\')">パスワードを変更</button></div>' +
    '</div>' +
    '<div class="card settings-card" style="max-width:42rem;margin-top:1.5rem">' +
    '<div class="card-header"><h3 class="card-title">通知設定</h3><p class="card-description">システムからの通知を受け取る条件を設定します</p></div>' +
    '<div class="card-content">' +
    '<div class="switch-row"><div class="label-wrap"><div class="main">新着メッセージ通知</div><div class="sub">患者からのメッセージを受信した際に通知します</div></div><div class="switch-toggle on"></div></div>' +
    '<div class="switch-row"><div class="label-wrap"><div class="main">予約リクエスト通知</div><div class="sub">新しい予約や変更リクエストがあった際に通知します</div></div><div class="switch-toggle on"></div></div>' +
    '<div class="switch-row"><div class="label-wrap"><div class="main">システムからのお知らせ</div><div class="sub">メンテナンス情報など重要なお知らせを通知します</div></div><div class="switch-toggle on"></div></div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div id="tab-staff" class="tab-content' +
    (activeTab === 'staff' ? ' active' : '') +
    '">' +
    '<div class="card">' +
    '<div class="card-header" style="display:flex;justify-content:space-between;align-items:center">' +
    '<div><h3 class="card-title">スタッフ一覧</h3><p class="card-description">管理画面にアクセスできるスタッフを管理します</p></div>' +
    '<button type="button" class="btn btn-primary btn-sm" onclick="showMockToast(\'スタッフ追加画面を開きます\')">' +
    ic.plus +
    'スタッフ追加</button>' +
    '</div>' +
    '<div class="card-content">' +
    '<table class="data-table"><thead><tr><th>氏名</th><th>役割</th><th>メールアドレス</th><th>ステータス</th><th style="text-align:right">操作</th></tr></thead><tbody>' +
    staffRows +
    '</tbody></table>' +
    '</div>' +
    '</div>' +
    '</div>'
  );
}

