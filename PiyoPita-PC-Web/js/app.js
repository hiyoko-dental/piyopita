(function () {
  'use strict';

  // 認証状態をメモリ上で管理する（ページを開くたびに初期化されるため、必ずログイン画面から始まります）
  var isAuth = false;

  // --- LocalStorage Sync for Mobile & PC ---
  var lsSync = {
    getRecords: function() {
      return JSON.parse(localStorage.getItem('piyopita_records') || '[]');
    },
    getMessages: function() {
      var msgs = localStorage.getItem('piyopita_messages');
      if (!msgs) {
        msgs = [{ id: 1, sender: 'doctor', text: 'こんにちは。装置の調子はいかがですか？', time: '14:00' }];
        localStorage.setItem('piyopita_messages', JSON.stringify(msgs));
        return msgs;
      }
      return JSON.parse(msgs);
    },
    saveMessages: function(msgs) {
      localStorage.setItem('piyopita_messages', JSON.stringify(msgs));
    }
  };

  // モック用の簡易通知関数
  window.showMockToast = function(msg) {
    alert(msg);
  };

  function isAuthenticated() {
    return isAuth;
  }

  function setAuthenticated(value) {
    isAuth = value;
  }

  function getHashPath() {
    var hash = window.location.hash.slice(1) || '';
    var q = hash.indexOf('?');
    return q >= 0 ? hash.slice(0, q) : hash;
  }

  function getHashSegments() {
    var path = getHashPath();
    if (path === '' || path === '/') return { base: '/', id: null };
    var parts = path.split('/').filter(Boolean);
    if (parts[0] === 'patients' && parts[1]) return { base: '/patients/:id', id: parts[1] };
    return { base: '/' + (parts[0] || ''), id: parts[1] || null };
  }

  function navigateTo(path) {
    window.location.hash = path || '/';
  }

  // --- 統合・刷新されたモックデータ ---
  var mockPatients = [
    { id: '1', lastName: '山田', firstName: '太郎', kana: 'やまだ たろう', age: 8, device: 'インビザライン', chartNo: 'C00101' },
    { id: '2', lastName: '鈴木', firstName: '結衣', kana: 'すずき ゆい', age: 10, device: '拡大床', chartNo: 'C00102' },
    { id: '3', lastName: '佐藤', firstName: '大翔', kana: 'さとう ひろと', age: 7, device: 'プレオルソ', chartNo: 'C00103' },
    { id: '4', lastName: '高橋', firstName: '陽菜', kana: 'たかはし ひな', age: 9, device: 'マイオブレース', chartNo: 'C00104' },
    { id: '5', lastName: '伊藤', firstName: '湊', kana: 'いとう みなと', age: 11, device: '拡大床', chartNo: 'C00105' },
    { id: '6', lastName: '渡辺', firstName: '莉子', kana: 'わたなべ りこ', age: 8, device: 'インビザライン', chartNo: 'C00106' },
    { id: '7', lastName: '山本', firstName: '悠真', kana: 'やまもと ゆうま', age: 6, device: 'ムーシールド', chartNo: 'C00107' },
    { id: '8', lastName: '中村', firstName: '紬', kana: 'なかむら つむぎ', age: 7, device: 'インビザライン', chartNo: 'C00108' },
    { id: '9', lastName: '小林', firstName: '蒼', kana: 'こばやし あお', age: 9, device: 'プレオルソ', chartNo: 'C00109' },
    { id: '10', lastName: '加藤', firstName: '凛', kana: 'かとう りん', age: 8, device: '拡大床', chartNo: 'C00110' }
  ];

  var timelineEvents = [
    { id: 1, type: 'achievement', date: '2026/02/20', time: '20:15', content: '山田太郎くんが本日の装着記録を行いました', patientId: '1', isNew: true },
    { id: 2, type: 'message', date: '2026/02/20', time: '14:30', content: '鈴木結衣ちゃんからメッセージを受信しました', patientId: '2', isNew: true },
    { id: 3, type: 'registration', date: '2026/02/19', time: '09:45', content: '佐藤大翔くんが新規登録されました', patientId: '3', isNew: false },
    { id: 4, type: 'message', date: '2026/02/17', time: '11:00', content: '伊藤湊くんから装置の不具合に関する相談があります', patientId: '5', isNew: false }
  ];

  var alertPatients = {
    red: [{ id: '6', name: '渡辺 莉子', days: 5, last: '2/16' }],
    orange: [{ id: '7', name: '山本 悠真', days: 3, last: '2/18' }],
    yellow: [{ id: '8', name: '中村 紬', days: 2, last: '2/19' }, { id: '9', name: '小林 蒼', days: 2, last: '2/19' }, { id: '10', name: '加藤 凛', days: 2, last: '2/19' }]
  };

  var mockContacts = [
    { id: '1', name: '山田 太郎', lastMessage: '', time: '', unread: 0, avatar: 'TR' },
    { id: '2', name: '鈴木 結衣', lastMessage: '', time: '', unread: 0, avatar: 'SY' },
    { id: '5', name: '伊藤 湊', lastMessage: '', time: '', unread: 0, avatar: 'IM' },
    { id: '4', name: '高橋 陽菜', lastMessage: '', time: '', unread: 0, avatar: 'TH' }
  ];

  var mockMessagesMap = {
    '2': [
      { id: 1, sender: 'doctor', text: 'こんにちは。調子はいかがですか？', time: '14:00' },
      { id: 2, sender: 'patient', text: 'ありがとうございました！', time: '14:30' }
    ],
    '5': [
      { id: 1, sender: 'patient', text: '装置が少し痛いです...', time: '昨日' }
    ],
    '4': [
      { id: 1, sender: 'patient', text: '写真送りました', time: '1週間前' }
    ]
  };

  var initialStaff = [
    { id: 1, name: '堀幹 太郎', role: '院長', email: 'horimiki@example.com', status: 'active' },
    { id: 2, name: '佐藤 花子', role: '歯科衛生士', email: 'sato@example.com', status: 'active' },
    { id: 3, name: '鈴木 一郎', role: '受付', email: 'suzuki@example.com', status: 'inactive' }
  ];

  var state = { 
    staffList: initialStaff.slice(), 
    selectedContact: mockContacts[0], 
    messageInput: '', 
    qrModalOpen: false,
    messages: [],
    detailYear: 2026,
    detailMonth: 2,
    lastPath: '' // スクロール維持判定用
  };

  // Icons
  var ic = {
    layout: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="9"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
    users: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    settings: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    logOut: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
    qr: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
    edit: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    bell: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    message: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    clock: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    check: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    messageSq: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    userPlus: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>',
    alert: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    chevronRight: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>',
    search: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    userPlusBtn: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>',
    file: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>',
    chevronLeft: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>',
    calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    save: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',
    send: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
    more: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',
    building: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/></svg>',
    user: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    lock: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    mapPin: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    mail: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>',
    shield: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    plus: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    edit2: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
    trash: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',
    camera: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>'
  };

  function getEventIcon(type) {
    if (type === 'achievement') return ic.check;
    if (type === 'message') return ic.messageSq;
    if (type === 'registration') return ic.userPlus;
    return ic.clock;
  }

  function renderLogin() {
    return '<div class="login-page">' +
      '<div class="login-logo">' +
        '<div class="icon">P</div>' +
        '<h1>ぴよぴた</h1>' +
        '<p>小児歯科矯正患者管理システム</p>' +
      '</div>' +
      '<div class="login-card">' +
        '<div class="login-card-header">' +
          '<h2>ログイン</h2>' +
          '<p>医院IDとパスワードを入力してください</p>' +
        '</div>' +
        '<form id="login-form">' +
          '<div class="login-card-body">' +
            '<div class="form-group"><label for="clinicId">医院ID</label><input id="clinicId" placeholder="123456" required/></div>' +
            '<div class="form-group"><label for="doctorId">歯科医師ID</label><input id="doctorId" placeholder="doctor01" required/></div>' +
            '<div class="form-group"><label for="password">パスワード</label><input id="password" type="password" required/></div>' +
          '</div>' +
          '<div class="login-card-footer">' +
            '<button type="submit" class="btn-primary">ログイン</button>' +
            '<div class="login-links">' +
              '<a href="#" onclick="showMockToast(\'アカウント追加申請フォームへ移動します\')">アカウントの追加申請</a>' +
              '<a href="#" onclick="showMockToast(\'パスワード再発行申請フォームへ移動します\')">パスワード再発行申請</a>' +
            '</div>' +
          '</div>' +
        '</form>' +
      '</div>' +
      '<footer class="login-footer">© 2026 PiyoPita System. All rights reserved.</footer>' +
    '</div>';
  }

  function renderDashboard(content, path) {
    var nav = [
      { path: '/', label: 'ホーム', icon: ic.layout },
      { path: '/patients', label: '患者検索', icon: ic.users },
      { path: '/settings', label: '設定', icon: ic.settings }
    ];
    var navHtml = nav.map(function (n) {
      var active = path === n.path || (n.path !== '/' && path.indexOf(n.path) === 0);
      return '<a href="#' + n.path + '" class="' + (active ? 'active' : '') + '">' + n.icon + n.label + '</a>';
    }).join('');

    return '<div class="dashboard">' +
      '<aside class="sidebar">' +
        '<div class="sidebar-header">' +
          '<div class="logo-icon">P</div>' +
          '<h1>ぴよぴた</h1>' +
        '</div>' +
        '<nav class="sidebar-nav">' + navHtml + '</nav>' +
        '<div class="sidebar-footer">' +
          '<button type="button" id="btn-logout">' + ic.logOut + 'ログアウト</button>' +
        '</div>' +
      '</aside>' +
      '<div class="main-wrap">' +
        '<header class="header">' +
          '<div class="header-left">' +
            '<span class="label">医院名:</span>' +
            '<span class="clinic">ほりみき矯正歯科医院様</span>' +
          '</div>' +
          '<div class="header-actions">' +
            '<button type="button" class="btn" id="btn-qr">' + ic.qr + '<span>歯科医院情報QR</span></button>' +
            '<button type="button" class="btn" onclick="showMockToast(\'医院情報の編集画面を開きます\')">' + ic.edit + '<span>情報編集</span></button>' +
            '<span class="header-divider"></span>' +
            '<div class="header-icons">' +
              '<button type="button" onclick="showMockToast(\'通知一覧を開きます\')"><span class="badge red"></span>' + ic.bell + '</button>' +
              '<a href="#/messages"><button type="button"><span class="badge blue"></span>' + ic.message + '</button></a>' +
            '</div>' +
            '<div class="header-avatar"><img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop" alt="Doctor"/></div>' +
          '</div>' +
        '</header>' +
        '<main class="main"><div class="main-inner">' + content + '</div></main>' +
      '</div>' +
      (state.qrModalOpen ? renderQRModal() : '') +
    '</div>';
  }

  function renderQRModal() {
    return '<div id="qr-modal" class="modal-overlay">' +
      '<div class="modal-content">' +
        '<div class="modal-header"><h2>歯科医院情報QRコード</h2></div>' +
        '<div class="qr-modal-body">' +
          '<div class="qr-placeholder">' + ic.qr + '</div>' +
          '<p>患者用アプリ「ぴよぴた」でこのQRコードを読み取ると、<br/>医院情報が自動的に連携されます。</p>' +
          '<button type="button" class="btn-download" onclick="showMockToast(\'QRコード画像をダウンロードしました\')">画像をダウンロード</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderHome() {
    var eventsHtml = timelineEvents.map(function (ev) {
      var icon = getEventIcon(ev.type);
      return '<div class="timeline-item' + (ev.isNew ? ' new' : '') + '" data-patient="' + ev.patientId + '" data-type="' + ev.type + '">' +
        '<div class="icon-wrap">' + icon + '</div>' +
        '<div class="body">' +
          '<div class="meta">' + ev.date + ' ' + ev.time + (ev.isNew ? '<span class="new-badge">NEW</span>' : '') + '</div>' +
          '<p class="content">' + ev.content + '</p>' +
        '</div>' +
        '<span class="arrow">' + ic.chevronRight + '</span>' +
      '</div>';
    }).join('');

    var alertHtml = '';
    ['red', 'orange', 'yellow'].forEach(function (level) {
      var label = level === 'red' ? '5日以上 (要緊急連絡)' : level === 'orange' ? '3〜4日 (要注意)' : '2日 (確認推奨)';
      var list = alertPatients[level];
      alertHtml += '<div class="alert-section">' +
        '<div class="section-label ' + level + '">' + label + '</div>' +
        list.map(function (p) {
          return '<div class="alert-row ' + level + '" data-id="' + p.id + '">' +
            '<div class="left">' +
              '<div class="avatar">' + p.name[0] + '</div>' +
              '<div><div class="name">' + p.name + '</div><div class="last">最終装着: ' + p.last + '</div></div>' +
            '</div>' +
            '<span class="days ' + level + '">' + p.days + '日</span>' +
          '</div>';
        }).join('') +
      '</div>';
    });

    return '<div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem">' +
      '<div><h1 class="page-title">ホーム</h1><p class="page-desc">最新のお知らせと患者の状況を確認できます</p></div>' +
      '<div class="date-badge">本日: 2026年2月21日 (土)</div>' +
    '</div>' +
    '<div class="home-grid">' +
      '<div class="card" style="grid-column: span 2">' +
        '<div class="card-header"><h3 class="card-title">' + ic.clock + 'お知らせタイムライン</h3></div>' +
        '<div class="card-content" style="padding:0">' + eventsHtml + '</div>' +
        '<div class="card-footer" style="text-align:center">' +
          '<button type="button" class="btn btn-ghost" onclick="showMockToast(\'すべてのお知らせ一覧を開きます\')">すべてのお知らせを見る</button>' +
        '</div>' +
      '</div>' +
      '<div class="card">' +
        '<div class="card-header danger">' +
          '<h3 class="card-title danger">' + ic.alert + '連続未装着アラート</h3>' +
          '<p class="card-description danger">2日以上装着記録がない患者リスト</p>' +
        '</div>' +
        '<div class="card-content" style="padding:0;flex:1;overflow-y:auto">' + alertHtml + '</div>' +
      '</div>' +
    '</div>';
  }

  function renderPatientSearch(searchTerm, deviceFilter) {
    var filtered = mockPatients.filter(function (p) {
      var matchSearch = !searchTerm || (p.lastName + p.firstName).indexOf(searchTerm) >= 0 || p.chartNo.indexOf(searchTerm) >= 0;
      var matchDevice = !deviceFilter || p.device === deviceFilter;
      return matchSearch && matchDevice;
    });
    var rows = filtered.map(function (p) {
      return '<tr class="interactive" data-id="' + p.id + '">' +
        '<td class="chart-no">' + p.chartNo + '</td>' +
        '<td><div class="patient-name">' + p.lastName + ' ' + p.firstName + '</div><div class="patient-kana">' + p.kana + '</div></td>' +
        '<td>' + p.age + '歳</td>' +
        '<td><span class="device-tag">' + p.device + '</span></td>' +
        '<td style="text-align:right">' + ic.chevronRight + '</td>' +
      '</tr>';
    }).join('');
    var empty = filtered.length === 0 ? '<div class="empty-state">' + ic.file + '<p>該当する患者が見つかりませんでした</p></div>' : '';

    return '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">' +
      '<div><h1 class="page-title">患者検索</h1><p class="page-desc">カルテNo.や氏名から患者を検索します</p></div>' +
      '<button type="button" class="btn btn-success" onclick="showMockToast(\'新規患者登録画面を開きます\')">' + ic.userPlusBtn + '新規患者登録</button>' +
    '</div>' +
    '<div class="card search-card" style="margin-bottom:1.5rem">' +
      '<div class="card-content">' +
        '<div class="form-grid">' +
          '<div class="form-group" style="grid-column: span 2">' +
            '<label>検索ワード (氏名・カルテNo)</label>' +
            '<div class="search-wrap"><span class="icon">' + ic.search + '</span><input type="text" id="search-input" placeholder="例: 山田 / C00101" value="' + (searchTerm || '') + '"/></div>' +
          '</div>' +
          '<div class="form-group">' +
            '<label>使用装置</label>' +
            '<select id="device-filter">' +
              '<option value="">すべて</option>' +
              '<option value="インビザライン"' + (deviceFilter === 'インビザライン' ? ' selected' : '') + '>インビザライン</option>' +
              '<option value="拡大床"' + (deviceFilter === '拡大床' ? ' selected' : '') + '>拡大床</option>' +
              '<option value="プレオルソ"' + (deviceFilter === 'プレオルソ' ? ' selected' : '') + '>プレオルソ</option>' +
              '<option value="マイオブレース"' + (deviceFilter === 'マイオブレース' ? ' selected' : '') + '>マイオブレース</option>' +
              '<option value="ムーシールド"' + (deviceFilter === 'ムーシールド' ? ' selected' : '') + '>ムーシールド</option>' +
            '</select>' +
          '</div>' +
          '<button type="button" class="btn btn-primary" onclick="showMockToast(\'検索を実行しました\')">検索</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="card" style="overflow:hidden;">' +
      (empty || ('<table class="data-table"><thead><tr><th style="width:8rem">カルテNo.</th><th>氏名</th><th style="width:6rem">年齢</th><th>使用装置</th><th style="width:6rem">詳細</th></tr></thead><tbody>' + rows + '</tbody></table>')) +
    '</div>';
  }

  function renderPatientDetail(id) {
    var p = mockPatients.find(function(pt) { return pt.id === id; });
    if (!p) {
      p = mockPatients[0];
    }

    var year = state.detailYear;
    var month = state.detailMonth;

    var daysInMonth = new Date(year, month, 0).getDate();

    // --- カレンダーデータ生成 ---
    var calendarDays = [];
    var lsRecords = (p.id === '1') ? lsSync.getRecords() : [];

    for (var i = 1; i <= daysInMonth; i++) {
      var dStr = year + '-' + String(month).padStart(2, '0') + '-' + String(i).padStart(2, '0');
      var status = '';
      var recTime = '';
      
      if (p.id === '1') {
        var rec = lsRecords.find(function(r) { 
          var rd = new Date(r.date); 
          return rd.getDate() === i && (rd.getMonth() + 1) === month && rd.getFullYear() === year; 
        });
        if(rec) {
          status = rec.evaluation;
          recTime = rec.time;
        }
      } else {
        var r = Math.random();
        if (r > 0.85) status = '';
        else if (r > 0.6) status = 'good';
        else if (r > 0.4) status = 'normal';
        else if (r > 0.2) status = 'peeled';
        else status = 'bad';
        if (status) recTime = '20:00';
      }
      
      calendarDays.push({
        day: i,
        date: dStr,
        status: status,
        time: recTime
      });
    }

    var firstDay = new Date(year, month - 1, 1).getDay();
    var calHtml = '<div class="calendar-grid">';
    for(var j=0; j<firstDay; j++) {
      calHtml += '<div class="calendar-day empty"></div>';
    }
    calendarDays.forEach(function (d) {
      var emptyClass = d.status === '' ? ' empty-record' : '';
      calHtml += '<button type="button" class="calendar-day' + emptyClass + '" data-date="' + d.date + '" data-time="' + d.time + '" data-status="' + d.status + '"><span>' + d.day + '</span>' + (d.status ? '<span class="day-dot ' + d.status + '"></span>' : '') + '</button>';
    });
    calHtml += '</div>';

    // --- 円グラフ用のデータ集計とHTML生成 ---
    var stats = { good: 0, normal: 0, peeled: 0, bad: 0, empty: 0 };
    calendarDays.forEach(function (d) {
      if (d.status === 'good') stats.good++;
      else if (d.status === 'normal') stats.normal++;
      else if (d.status === 'peeled') stats.peeled++;
      else if (d.status === 'bad') stats.bad++;
      else stats.empty++;
    });

    var totalDays = daysInMonth;
    var recordedDays = stats.good + stats.normal + stats.peeled + stats.bad;
    var achieveRate = Math.round((recordedDays / totalDays) * 100) || 0;

    var goodDeg = (stats.good / totalDays) * 100;
    var normalDeg = (stats.normal / totalDays) * 100;
    var peeledDeg = (stats.peeled / totalDays) * 100;
    var badDeg = (stats.bad / totalDays) * 100;

    var deg1 = goodDeg;
    var deg2 = deg1 + normalDeg;
    var deg3 = deg2 + peeledDeg;
    var deg4 = deg3 + badDeg;

    var conicGradient = 'conic-gradient(' +
      '#4A90E2 0% ' + deg1 + '%, ' +
      '#FFD700 ' + deg1 + '% ' + deg2 + '%, ' +
      '#4CAF50 ' + deg2 + '% ' + deg3 + '%, ' +
      '#FF6B6B ' + deg3 + '% ' + deg4 + '%, ' +
      '#e2e8f0 ' + deg4 + '% 100%' +
    ')';

    var prevMonth = month === 1 ? 12 : month - 1;
    var prevYear = month === 1 ? year - 1 : year;
    var nextMonth = month === 12 ? 1 : month + 1;
    var nextYear = month === 12 ? year + 1 : year;

    var monthSelectorHtml = 
      '<div style="display:flex; align-items:center; gap:0.5rem; margin-bottom: 0.5rem;">' +
        '<button type="button" class="btn btn-ghost month-nav" style="padding:0.25rem" data-y="' + prevYear + '" data-m="' + prevMonth + '">' + ic.chevronLeft + '</button>' +
        '<span style="font-weight:700; font-size:1rem; width:120px; text-align:center; white-space:nowrap;">' + year + '年' + month + '月</span>' +
        '<button type="button" class="btn btn-ghost month-nav" style="padding:0.25rem" data-y="' + nextYear + '" data-m="' + nextMonth + '">' + ic.chevronRight + '</button>' +
      '</div>';

    var pieChartHtml = 
      '<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap: 1rem;">' +
        monthSelectorHtml +
        '<div style="position:relative; width:140px; height:140px; border-radius:50%; background:' + conicGradient + '; flex-shrink: 0;">' +
          '<div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:96px; height:96px; background:var(--card); border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);">' +
            '<span style="font-size:0.75rem; color:var(--muted); font-weight:500;">装着率</span>' +
            '<span style="font-size:1.5rem; font-weight:bold; color:var(--fg); line-height:1.2;">' + achieveRate + '%</span>' +
          '</div>' +
        '</div>' +
        '<div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; font-size:0.75rem; color:var(--muted); margin-top:0.5rem; width: 100%; padding: 0 1rem;">' +
          '<div style="display:flex; align-items:center; justify-content:space-between; gap:0.25rem;"><span><span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#4A90E2; margin-right:4px;"></span>完全脱色:</span> <b>' + stats.good + '日</b></div>' +
          '<div style="display:flex; align-items:center; justify-content:space-between; gap:0.25rem;"><span><span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#FFD700; margin-right:4px;"></span>不十分:</span> <b>' + stats.normal + '日</b></div>' +
          '<div style="display:flex; align-items:center; justify-content:space-between; gap:0.25rem;"><span><span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#4CAF50; margin-right:4px;"></span>剥離:</span> <b>' + stats.peeled + '日</b></div>' +
          '<div style="display:flex; align-items:center; justify-content:space-between; gap:0.25rem;"><span><span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#FF6B6B; margin-right:4px;"></span>脱色なし:</span> <b>' + stats.bad + '日</b></div>' +
        '</div>' +
        '<div style="font-size:0.75rem; color:var(--muted); text-align:center; width: 100%; border-top: 1px solid var(--border-light); padding-top:0.5rem;">未記録: ' + stats.empty + '日</div>' +
      '</div>';

    return '<div class="detail-header">' +
      '<div class="back">' +
        '<button type="button" id="detail-back">' + ic.chevronLeft + '</button>' +
        '<div>' +
          '<h1>' + p.lastName + ' ' + p.firstName + ' <span class="age-badge">' + p.age + '歳</span> <span class="chart-no">カルテNo: ' + p.chartNo + '</span></h1>' +
          '<p class="last-visit">最終来院日: 2026/01/15</p>' +
        '</div>' +
      '</div>' +
      '<div class="detail-actions">' +
        '<button type="button" class="btn btn-outline" onclick="showMockToast(\'来院予約画面を開きます\')">' + ic.calendar + '来院予約</button>' +
        '<button type="button" class="btn btn-primary" onclick="showMockToast(\'変更を保存しました\')">' + ic.save + '変更を保存</button>' +
      '</div>' +
    '</div>' +
    '<div class="card device-panel" style="margin-bottom:1.5rem">' +
      '<div class="card-header" style="background:rgba(248,250,252,0.5);border-bottom:1px solid var(--border-light);padding:1rem">' +
        '<h3 class="card-title">' + ic.clock + '装置設定</h3>' +
      '</div>' +
      '<div class="card-content">' +
        '<div class="form-grid" style="grid-template-columns: 1fr 1fr 1fr auto;">' +
          '<div class="form-group"><label>使用装置</label><select>' +
          '<option' + (p.device === 'インビザライン' ? ' selected' : '') + '>インビザライン</option>' +
          '<option' + (p.device === '拡大床' ? ' selected' : '') + '>拡大床</option>' +
          '<option' + (p.device === 'プレオルソ' ? ' selected' : '') + '>プレオルソ</option>' +
          '<option' + (p.device === 'マイオブレース' ? ' selected' : '') + '>マイオブレース</option>' +
          '<option' + (p.device === 'ムーシールド' ? ' selected' : '') + '>ムーシールド</option>' +
          '</select></div>' +
          '<div class="form-group"><label>使用開始日</label><input type="date" value="2025-01-15"/></div>' +
          '<div class="form-group"><label>使用終了予定日</label><input type="date" value="2026-12-01"/></div>' +
          '<button type="button" class="btn btn-outline" onclick="showMockToast(\'アプリ側へ設定を送信しました\')">設定を反映 (アプリへ送信)</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:2fr 1fr;gap:1.5rem;margin-bottom:1.5rem">' +
      '<div class="card">' +
        '<div class="card-header"><h3 class="card-title">治療進捗状況</h3><p class="card-description">現在の装置の装着期間と全体の進捗</p></div>' +
        '<div class="card-content">' +
          '<div class="progress-section">' +
            '<div class="progress-header"><span>現在の装置: ' + p.device + ' #3</span><span>1年2ヶ月 / 予定2年</span></div>' +
            '<div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:58%"></div></div>' +
            '<div class="progress-footer"><span>開始: 2024/12/01</span><span>終了予定: 2026/12/01</span></div>' +
          '</div>' +
          '<h4 style="font-size:0.875rem;font-weight:700;margin:1rem 0 0.5rem">装置履歴</h4>' +
          '<div class="history-list">' +
            '<div class="history-item current"><span class="dot red"></span><div class="body"><div class="title">' + p.device + ' #3 (現在)</div><div class="date">2026/01/15 - 現在</div></div><span class="status red">装着中</span></div>' +
            '<div class="history-item done"><span class="dot blue"></span><div class="body"><div class="title">' + p.device + ' #2</div><div class="date">2025/12/01 - 2026/01/14</div></div><span class="status blue">完了</span></div>' +
            '<div class="history-item done older"><span class="dot blue"></span><div class="body"><div class="title">' + p.device + ' #1</div><div class="date">2025/11/01 - 2025/11/30</div></div><span class="status blue">完了</span></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="card chart-card">' +
        '<div class="card-header"><h3 class="card-title">毎月の装着状況</h3><p class="card-description">選択した月の評価内訳</p></div>' +
        '<div class="card-content" style="height:340px; display:flex; align-items:center; justify-content:center; padding:1rem;">' +
          pieChartHtml +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="card">' +
      '<div class="card-header" style="display:flex;justify-content:space-between;align-items:center">' +
        '<h3 class="card-title">装着カレンダー (' + year + '年' + month + '月)</h3>' +
        '<div class="calendar-legend">' +
          '<span><span class="dot good"></span>完全脱色</span>' +
          '<span><span class="dot normal"></span>不十分</span>' +
          '<span><span class="dot bad"></span>ほぼ脱色なし</span>' +
          '<span><span class="dot peeled"></span>シール剥がれ</span>' +
        '</div>' +
      '</div>' +
      '<div class="card-content">' +
        '<div style="grid-template-columns:repeat(7,1fr);gap:0.5rem;margin-bottom:0.5rem;text-align:center;font-size:0.875rem;color:var(--muted);font-weight:500;display:grid">' +
          '<div>日</div><div>月</div><div>火</div><div>水</div><div>木</div><div>金</div><div>土</div>' +
        '</div>' +
        calHtml +
      '</div>' +
    '</div>' +
    (state.photoModalDate ? renderPhotoModal(state.photoModalDate, state.photoModalTime, state.photoModalStatus) : '');
  }

  function renderPhotoModal(date, time, status) {
    var evalLabels = { good: '完全脱色', normal: '不十分', bad: 'ほぼ脱色なし', peeled: 'シール剥がれ' };
    var evalColors = { good: '#4A90E2', normal: '#FFD700', bad: '#FF6B6B', peeled: '#4CAF50' };
    var label = evalLabels[status] || '未記録';
    var color = evalColors[status] || '#666';

    return '<div id="photo-modal" class="modal-overlay">' +
      '<div class="modal-content">' +
        '<div class="modal-header"><h2>' + date + ' の装着記録</h2></div>' +
        '<div class="modal-body">' +
          '<div class="photo-wrap" style="aspect-ratio:16/9; background:var(--muted-bg); border-radius:var(--radius); display:flex; align-items:center; justify-content:center; color:var(--muted); margin-bottom:1rem; flex-direction:column;">' +
            ic.camera + '<span style="margin-top:0.5rem; font-weight:500;">撮影イメージ</span>' +
          '</div>' +
          '<div class="stats-grid">' +
            '<div class="stat-box"><div class="label">記録時刻</div><div class="value">' + (time || '--:--') + '</div></div>' +
            '<div class="stat-box"><div class="label">評価</div><div class="value" style="color:' + color + '">' + label + '</div></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderMessages() {
    var contact = state.selectedContact;

    mockContacts.forEach(function(c) {
      var msgs = (c.id === '1') ? state.messages : (mockMessagesMap[c.id] || []);
      if(msgs.length > 0) {
        var lastMsg = msgs[msgs.length - 1];
        c.lastMessage = lastMsg.text;
        c.time = lastMsg.time;
      } else {
        c.lastMessage = 'メッセージはありません';
        c.time = '';
      }
    });

    var listHtml = mockContacts.map(function (c) {
      return '<button type="button" class="contact-item' + (c.id === contact.id ? ' active' : '') + '" data-id="' + c.id + '">' +
        '<div class="avatar">' + c.avatar + '</div>' +
        '<div class="body">' +
          '<div style="display:flex;justify-content:space-between;margin-bottom:0.25rem"><span class="name">' + c.name + '</span><span class="time">' + c.time + '</span></div>' +
          '<p class="preview">' + c.lastMessage + '</p>' +
        '</div>' +
      '</button>';
    }).join('');

    var msgsToRender = (contact.id === '1') ? state.messages : (mockMessagesMap[contact.id] || []);

    var msgHtml = msgsToRender.map(function (m) {
      return '<div class="chat-msg ' + m.sender + '">' +
        '<span class="time">' + m.time + '</span>' +
        '<div class="bubble ' + m.sender + '">' + m.text + '</div>' +
      '</div>';
    }).join('');

    return '<div class="messages-layout">' +
      '<div class="contacts-panel">' +
        '<div class="search-wrap"><span class="icon">' + ic.search + '</span><input type="text" placeholder="患者を検索"/></div>' +
        '<div class="contact-list">' + listHtml + '</div>' +
      '</div>' +
      '<div class="chat-panel">' +
        '<div class="chat-header">' +
          '<div class="user-info">' +
            '<div class="avatar">' + contact.avatar + '</div>' +
            '<div><div class="name">' + contact.name + '</div></div>' +
          '</div>' +
          '<div class="actions">' +
            '<button type="button" onclick="showMockToast(\'詳細メニューを開きます\')">' + ic.more + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="chat-messages" id="chat-messages">' + msgHtml + '</div>' +
        '<div class="chat-input-wrap">' +
          '<div class="row">' +
            '<input type="text" placeholder="メッセージを入力..." id="message-input" value="' + (state.messageInput || '') + '"/>' +
            '<button type="button" class="btn-send" id="btn-send">' + ic.send + '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderSettings(activeTab) {
    var tabs = [
      { id: 'clinic', label: '医院情報', icon: ic.building },
      { id: 'account', label: 'アカウント', icon: ic.user },
      { id: 'staff', label: 'スタッフ管理', icon: ic.shield }
    ];
    var tabButtons = tabs.map(function (t) {
      return '<button type="button" class="' + (activeTab === t.id ? 'active' : '') + '" data-tab="' + t.id + '">' + t.icon + t.label + '</button>';
    }).join('');

    var staffRows = state.staffList.map(function (s) {
      return '<tr><td style="font-weight:500">' + s.name + '</td><td>' + s.role + '</td><td>' + s.email + '</td>' +
        '<td><span class="badge ' + (s.status === 'active' ? 'active' : 'inactive') + '">' + (s.status === 'active' ? '有効' : '無効') + '</span></td>' +
        '<td class="actions">' +
          '<button type="button" onclick="showMockToast(\'スタッフ情報を編集します\')">' + ic.edit2 + '</button>' +
          '<button type="button" class="danger" data-delete="' + s.id + '">' + ic.trash + '</button>' +
        '</td></tr>';
    }).join('');

    return '<div class="settings-header">' +
      '<div><h1 class="page-title">設定</h1><p class="page-desc">医院情報やアカウント設定を管理します</p></div>' +
      '<button type="button" class="btn btn-primary" onclick="showMockToast(\'設定内容を保存しました\')">' + ic.save + '変更を保存</button>' +
    '</div>' +
    '<div class="tabs-list">' + tabButtons + '</div>' +
    '<div id="tab-clinic" class="tab-content' + (activeTab === 'clinic' ? ' active' : '') + '">' +
      '<div class="settings-grid">' +
        '<div class="card settings-card">' +
          '<div class="card-header"><h3 class="card-title">基本情報</h3><p class="card-description">医院の基本的な情報を設定します</p></div>' +
          '<div class="card-content">' +
            '<div class="form-group"><label>医院名</label><div class="input-wrap"><span class="icon">' + ic.building + '</span><input value="ほりみき矯正歯科医院"/></div></div>' +
            '<div class="form-group"><label>住所</label><div class="input-wrap"><span class="icon">' + ic.mapPin + '</span><input value="東京都渋谷区神南1-1-1"/></div></div>' +
            '<div class="row-2">' +
              '<div class="form-group"><label>電話番号</label><div class="input-wrap"><span class="icon">' + ic.phone + '</span><input value="03-1234-5678"/></div></div>' +
              '<div class="form-group"><label>代表メールアドレス</label><div class="input-wrap"><span class="icon">' + ic.mail + '</span><input value="info@horimiki-dental.com"/></div></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="card settings-card">' +
          '<div class="card-header"><h3 class="card-title">診療時間・休診日</h3><p class="card-description">アプリ上で患者に表示される診療時間です</p></div>' +
          '<div class="card-content">' +
            '<div class="form-group"><label>平日診療時間</label><div style="display:flex;align-items:center;gap:0.5rem"><div class="input-wrap"><span class="icon">' + ic.clock + '</span><input value="10:00"/></div>～<div class="input-wrap"><span class="icon">' + ic.clock + '</span><input value="19:00"/></div></div></div>' +
            '<div class="form-group"><label>土日祝診療時間</label><div style="display:flex;align-items:center;gap:0.5rem"><div class="input-wrap"><span class="icon">' + ic.clock + '</span><input value="10:00"/></div>～<div class="input-wrap"><span class="icon">' + ic.clock + '</span><input value="17:00"/></div></div></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div id="tab-account" class="tab-content' + (activeTab === 'account' ? ' active' : '') + '">' +
      '<div class="card settings-card" style="max-width:42rem">' +
        '<div class="card-header"><h3 class="card-title">ログイン情報</h3><p class="card-description">管理画面へのログインに使用する情報です</p></div>' +
        '<div class="card-content">' +
          '<div class="form-group"><label>ログインID</label><div class="input-wrap"><span class="icon">' + ic.user + '</span><input value="admin_horimiki" readonly/><p class="hint">※ログインIDの変更はサポートへお問い合わせください</p></div></div>' +
          '<div class="form-group"><label>現在のパスワード</label><div class="input-wrap"><span class="icon">' + ic.lock + '</span><input type="password" placeholder="••••••••"/></div></div>' +
          '<div class="row-2"><div class="form-group"><label>新しいパスワード</label><div class="input-wrap"><span class="icon">' + ic.lock + '</span><input type="password" placeholder="新しいパスワード"/></div></div><div class="form-group"><label>パスワード確認</label><div class="input-wrap"><span class="icon">' + ic.lock + '</span><input type="password" placeholder="もう一度入力"/></div></div></div>' +
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
    '<div id="tab-staff" class="tab-content' + (activeTab === 'staff' ? ' active' : '') + '">' +
      '<div class="card">' +
        '<div class="card-header" style="display:flex;justify-content:space-between;align-items:center">' +
          '<div><h3 class="card-title">スタッフ一覧</h3><p class="card-description">管理画面にアクセスできるスタッフを管理します</p></div>' +
          '<button type="button" class="btn btn-primary btn-sm" onclick="showMockToast(\'スタッフ追加画面を開きます\')">' + ic.plus + 'スタッフ追加</button>' +
        '</div>' +
        '<div class="card-content">' +
          '<table class="data-table"><thead><tr><th>氏名</th><th>役割</th><th>メールアドレス</th><th>ステータス</th><th style="text-align:right">操作</th></tr></thead><tbody>' + staffRows + '</tbody></table>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function render() {
    var path = getHashPath();
    var seg = getHashSegments();
    var app = document.getElementById('app');
    if (!app) return;

    if (!isAuthenticated()) {
      if (path !== 'login') {
        navigateTo('login');
        return;
      }
      app.innerHTML = renderLogin();
      var form = app.querySelector('#login-form');
      if (form) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          setAuthenticated(true);
          navigateTo('/');
        });
      }
      return;
    }

    if (path === 'login') {
      navigateTo('/');
      return;
    }

    // データ同期準備
    state.messages = lsSync.getMessages();

    // 再描画前に現在のスクロール位置を記憶する
    // ※同じページ内の操作の時のみ保持（別ページへの移動時はリセット）
    var currentPath = window.location.hash;
    var isSamePage = state.lastPath === currentPath;
    state.lastPath = currentPath;

    var scrollStates = { main: 0, chat: 0, contacts: 0 };
    if (isSamePage) {
      var mainEl = app.querySelector('.main');
      if (mainEl) scrollStates.main = mainEl.scrollTop;
      
      var chatEl = app.querySelector('.chat-messages');
      if (chatEl) scrollStates.chat = chatEl.scrollTop;
      
      var contactsEl = app.querySelector('.contact-list');
      if (contactsEl) scrollStates.contacts = contactsEl.scrollTop;
    }

    var content = '';
    if (seg.base === '/' || seg.base === '') {
      content = renderHome();
    } else if (seg.base === '/patients/:id' && seg.id) {
      content = renderPatientDetail(seg.id);
    } else if (seg.base === '/patients') {
      content = renderPatientSearch(state.searchTerm, state.deviceFilter);
    } else if (seg.base === '/messages') {
      content = renderMessages();
    } else if (seg.base === '/settings') {
      content = renderSettings(state.settingsTab || 'clinic');
    } else {
      content = renderHome();
    }

    // DOMの書き換え
    app.innerHTML = renderDashboard(content, seg.base);

    // 再描画後にスクロール位置を復元する
    if (isSamePage) {
      var newMainEl = app.querySelector('.main');
      if (newMainEl && scrollStates.main > 0) newMainEl.scrollTop = scrollStates.main;

      var newChatEl = app.querySelector('.chat-messages');
      if (newChatEl && scrollStates.chat > 0) newChatEl.scrollTop = scrollStates.chat;

      var newContactsEl = app.querySelector('.contact-list');
      if (newContactsEl && scrollStates.contacts > 0) newContactsEl.scrollTop = scrollStates.contacts;
    } else {
      // 違うページに移動した場合は強制的に一番上に戻す
      var resetMainEl = app.querySelector('.main');
      if (resetMainEl) resetMainEl.scrollTop = 0;
    }

    // Events
    var logoutBtn = app.querySelector('#btn-logout');
    if (logoutBtn) logoutBtn.addEventListener('click', function () { setAuthenticated(false); navigateTo('login'); });

    var qrBtn = app.querySelector('#btn-qr');
    if (qrBtn) qrBtn.addEventListener('click', function () { state.qrModalOpen = true; render(); });

    if (state.qrModalOpen) {
      var modal = app.querySelector('#qr-modal');
      if (modal) {
        modal.addEventListener('click', function (e) {
          if (e.target === modal) { state.qrModalOpen = false; render(); }
        });
      }
    }

    // Home: timeline & alerts
    app.querySelectorAll('.timeline-item').forEach(function (el) {
      el.addEventListener('click', function () {
        var type = el.getAttribute('data-type');
        var patientId = el.getAttribute('data-patient');
        if (type === 'message') navigateTo('/messages');
        else navigateTo('/patients/' + patientId);
      });
    });
    app.querySelectorAll('.alert-row').forEach(function (el) {
      el.addEventListener('click', function () { navigateTo('/patients/' + el.getAttribute('data-id')); });
    });

    // Patient search
    var searchInput = app.querySelector('#search-input');
    var deviceFilter = app.querySelector('#device-filter');
    if (searchInput) searchInput.addEventListener('input', function () { state.searchTerm = this.value; render(); });
    if (deviceFilter) deviceFilter.addEventListener('change', function () { state.deviceFilter = this.value || ''; render(); });
    app.querySelectorAll('.data-table tbody tr.interactive').forEach(function (tr) {
      tr.addEventListener('click', function () { navigateTo('/patients/' + tr.getAttribute('data-id')); });
    });

    // Patient detail
    var detailBack = app.querySelector('#detail-back');
    if (detailBack) detailBack.addEventListener('click', function () { window.history.back(); });
    
    // 月の切り替えイベント
    app.querySelectorAll('.month-nav').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.detailYear = parseInt(btn.getAttribute('data-y'), 10);
        state.detailMonth = parseInt(btn.getAttribute('data-m'), 10);
        render();
      });
    });

    app.querySelectorAll('.calendar-day[data-date]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if(!btn.classList.contains('empty') && btn.getAttribute('data-status')) {
          state.photoModalDate = btn.getAttribute('data-date');
          state.photoModalTime = btn.getAttribute('data-time');
          state.photoModalStatus = btn.getAttribute('data-status');
          render();
        }
      });
    });
    if (state.photoModalDate) {
      var photoModal = app.querySelector('#photo-modal');
      if (photoModal) {
        photoModal.addEventListener('click', function (e) {
          if (e.target === photoModal) { state.photoModalDate = null; render(); }
        });
      }
    }

    // Messages
    app.querySelectorAll('.contact-item').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        state.selectedContact = mockContacts.find(function (c) { return c.id === id; }) || mockContacts[0];
        render();
      });
    });

    var msgInput = app.querySelector('#message-input');
    if (msgInput) msgInput.addEventListener('input', function () { state.messageInput = this.value; });

    var btnSend = app.querySelector('#btn-send');
    if (btnSend && msgInput) {
      btnSend.addEventListener('click', function () {
        if (msgInput.value.trim() !== '') {
          var now = new Date();
          var timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
          // 山田太郎(id:1)の場合のみ同期に書き込む
          if (state.selectedContact.id === '1') {
            state.messages.push({ id: Date.now(), sender: 'doctor', text: msgInput.value.trim(), time: timeStr });
            lsSync.saveMessages(state.messages);
          }
          state.messageInput = '';
          render();
          
          // チャット送信時は、強制的に一番下までスクロールさせる
          var area = document.getElementById('chat-messages');
          if (area) area.scrollTop = area.scrollHeight;
        }
      });
    }

    // Settings tabs
    app.querySelectorAll('.tabs-list button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.settingsTab = btn.getAttribute('data-tab');
        render();
      });
    });
    app.querySelectorAll('[data-delete]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = parseInt(btn.getAttribute('data-delete'), 10);
        if (confirm('このスタッフを削除してもよろしいですか？')) {
          state.staffList = state.staffList.filter(function (s) { return s.id !== id; });
          render();
        }
      });
    });
  }

  window.addEventListener('hashchange', render);
  if (!window.location.hash || window.location.hash === '#') window.location.hash = '/';
  render();

  // 自動同期用ポーリング (デモ用)
  setInterval(function() {
    var needRender = false;
    
    // メッセージの同期監視
    if (window.location.hash === '#/messages') {
      var oldMsgLen = state.messages.length;
      var msgs = lsSync.getMessages();
      if (msgs.length !== oldMsgLen) {
        needRender = true;
      }
    }
    
    // カレンダーの同期監視（山田太郎の詳細画面を開いている時）
    if (window.location.hash.startsWith('#/patients/1')) {
      var lsRecs = lsSync.getRecords();
      if (state._lastRecCount !== lsRecs.length) {
        state._lastRecCount = lsRecs.length;
        needRender = true;
      }
    }

    if (needRender) {
      render();
    }
  }, 2000);
})();