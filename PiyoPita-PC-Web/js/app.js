(function () {
  'use strict';

  var AUTH_KEY = 'isAuthenticated';

  function isAuthenticated() {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  }

  function setAuthenticated(value) {
    if (value) sessionStorage.setItem(AUTH_KEY, 'true');
    else sessionStorage.removeItem(AUTH_KEY);
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

  // Mock data
  var timelineEvents = [
    { id: 1, type: 'achievement', date: '2025/12/31', time: '20:15', content: '長谷川元洋くんが本日の装置装着時間を達成しました', patientId: '1', isNew: true },
    { id: 2, type: 'message', date: '2025/12/30', time: '14:30', content: '長谷川太郎くんからメッセージを受信しました', patientId: '2', isNew: true },
    { id: 3, type: 'registration', date: '2025/12/28', time: '09:45', content: '堀伊吹さんが新規登録されました', patientId: '3', isNew: false },
    { id: 4, type: 'achievement', date: '2025/12/27', time: '19:20', content: '山田花子ちゃんが3日連続で目標を達成しました！', patientId: '4', isNew: false },
    { id: 5, type: 'message', date: '2025/12/26', time: '11:00', content: '鈴木一郎くんから装置の不具合に関する相談があります', patientId: '5', isNew: false }
  ];

  var alertPatients = {
    red: [{ id: '6', name: '佐藤 健太', days: 5, last: '2/16' }],
    orange: [{ id: '7', name: '高橋 美咲', days: 3, last: '2/18' }],
    yellow: [{ id: '8', name: '山本 陸', days: 2, last: '2/19' }, { id: '9', name: '中村 陽菜', days: 2, last: '2/19' }, { id: '10', name: '小林 翔太', days: 2, last: '2/19' }]
  };

  var mockPatients = [
    { id: '1', lastName: '長谷川', firstName: '元洋', age: 8, device: 'インビザライン', chartNo: 'C00101', status: '良好' },
    { id: '2', lastName: '長谷川', firstName: '太郎', age: 10, device: '拡大床', chartNo: 'C00102', status: '注意' },
    { id: '3', lastName: '堀', firstName: '伊吹', age: 7, device: 'プレオルソ', chartNo: 'C00103', status: '新規' },
    { id: '4', lastName: '山田', firstName: '花子', age: 9, device: 'マイオブレース', chartNo: 'C00104', status: '良好' },
    { id: '5', lastName: '佐藤', firstName: '健太', age: 11, device: '拡大床', chartNo: 'C00105', status: '警告' },
    { id: '6', lastName: '高橋', firstName: '美咲', age: 8, device: 'インビザライン', chartNo: 'C00106', status: '注意' },
    { id: '7', lastName: '伊藤', firstName: '翼', age: 6, device: 'ムーシールド', chartNo: 'C00107', status: '良好' }
  ];

  var chartData = [
    { name: '1月', rate: 85 },
    { name: '2月', rate: 92 },
    { name: '3月', rate: 78 },
    { name: '4月', rate: 95 },
    { name: '5月', rate: 88 },
    { name: '6月', rate: 90 }
  ];

  var calendarDays = [];
  for (var i = 1; i <= 28; i++) {
    var r = Math.random();
    calendarDays.push({
      day: i,
      date: '2026-02-' + (i < 10 ? '0' + i : i),
      status: r > 0.8 ? 'blue' : r > 0.6 ? 'green' : r > 0.3 ? 'yellow' : 'red'
    });
  }

  var mockContacts = [
    { id: '1', name: '長谷川 太郎', lastMessage: 'ありがとうございました！', time: '14:30', unread: 2, avatar: 'HT' },
    { id: '2', name: '佐藤 健太', lastMessage: '装置が少し痛いです...', time: '昨日', unread: 0, avatar: 'SK' },
    { id: '3', name: '鈴木 一郎', lastMessage: '次回の予約について', time: '2日前', unread: 0, avatar: 'SI' },
    { id: '4', name: '田中 美咲', lastMessage: '写真送りました', time: '1週間前', unread: 0, avatar: 'TM' }
  ];

  var mockMessages = [
    { id: 1, sender: 'doctor', text: '長谷川さん、こんにちは。装置の調子はいかがですか？', time: '14:00' },
    { id: 2, sender: 'patient', text: '先生、こんにちは！昨日から少し違和感がありますが、頑張って着けています。', time: '14:15' },
    { id: 3, sender: 'doctor', text: '素晴らしいですね。慣れるまで少し時間がかかるかもしれませんが、無理せず続けてください。痛みが強くなるようならまた連絡してください。', time: '14:20' },
    { id: 4, sender: 'patient', text: 'わかりました！ありがとうございます！', time: '14:30' }
  ];

  var initialStaff = [
    { id: 1, name: '堀幹 太郎', role: '院長', email: 'horimiki@example.com', status: 'active' },
    { id: 2, name: '佐藤 花子', role: '歯科衛生士', email: 'sato@example.com', status: 'active' },
    { id: 3, name: '鈴木 一郎', role: '受付', email: 'suzuki@example.com', status: 'inactive' }
  ];

  var state = { staffList: initialStaff.slice(), selectedContact: mockContacts[0], messageInput: '', qrModalOpen: false };

  // Icons (simplified SVG)
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
    phone: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    video: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2" ry="2"/></svg>',
    more: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',
    building: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/></svg>',
    user: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    lock: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    mapPin: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    mail: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>',
    shield: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    plus: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    edit2: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
    trash: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>'
  };

  function getEventIcon(type) {
    if (type === 'achievement') return ic.check;
    if (type === 'message') return ic.messageSq;
    if (type === 'registration') return ic.userPlus;
    return ic.clock;
  }

  function statusClass(s) {
    if (s === '良好') return 'good';
    if (s === '注意') return 'warning';
    if (s === '警告') return 'danger';
    if (s === '新規') return 'info';
    return '';
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
              '<a href="#">アカウントの追加申請</a>' +
              '<a href="#">パスワード再発行申請</a>' +
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
            '<button type="button" class="btn">' + ic.edit + '<span>情報編集</span></button>' +
            '<span class="header-divider"></span>' +
            '<div class="header-icons">' +
              '<button type="button"><span class="badge red"></span>' + ic.bell + '</button>' +
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
          '<button type="button" class="btn-download">画像をダウンロード</button>' +
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
          '<button type="button" class="btn btn-ghost">すべてのお知らせを見る</button>' +
        '</div>' +
      '</div>' +
      '<div class="card">' +
        '<div class="card-header danger">' +
          '<h3 class="card-title danger">' + ic.alert + '連続未装着アラート</h3>' +
          '<p class="card-description danger">2日以上装着記録がない患者リスト</p>' +
        '</div>' +
        '<div class="card-content" style="padding:0;flex:1;overflow-y:auto">' + alertHtml + '</div>' +
        '<div class="card-footer">' +
          '<button type="button" class="btn btn-outline btn-danger">対象者全員にメッセージ</button>' +
        '</div>' +
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
      return '<tr data-id="' + p.id + '">' +
        '<td class="chart-no">' + p.chartNo + '</td>' +
        '<td><div class="patient-name">' + p.lastName + ' ' + p.firstName + '</div><div class="patient-kana">はせがわ もとひろ</div></td>' +
        '<td>' + p.age + '歳</td>' +
        '<td><span class="device-tag">' + p.device + '</span></td>' +
        '<td><span class="status-badge ' + statusClass(p.status) + '">' + p.status + '</span></td>' +
        '<td style="text-align:right">' + ic.chevronRight + '</td>' +
      '</tr>';
    }).join('');
    var empty = filtered.length === 0 ? '<div class="empty-state">' + ic.file + '<p>該当する患者が見つかりませんでした</p></div>' : '';

    return '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">' +
      '<div><h1 class="page-title">患者検索</h1><p class="page-desc">カルテNo.や氏名から患者を検索します</p></div>' +
      '<button type="button" class="btn btn-success">' + ic.userPlusBtn + '新規患者登録</button>' +
    '</div>' +
    '<div class="card search-card" style="margin-bottom:1.5rem">' +
      '<div class="card-content">' +
        '<div class="form-grid">' +
          '<div class="form-group" style="grid-column: span 2">' +
            '<label>検索ワード (氏名・カルテNo)</label>' +
            '<div class="search-wrap"><span class="icon">' + ic.search + '</span><input type="text" id="search-input" placeholder="例: 長谷川 / C00101" value="' + (searchTerm || '') + '"/></div>' +
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
          '<button type="button" class="btn btn-primary">検索</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="table-wrap">' +
      (empty || ('<table class="staff-table"><thead><tr><th style="width:8rem">カルテNo.</th><th>氏名</th><th style="width:6rem">年齢</th><th>使用装置</th><th style="width:8rem">状態</th><th style="width:6rem">詳細</th></tr></thead><tbody>' + rows + '</tbody></table>')) +
    '</div>';
  }

  function renderPatientDetail(id) {
    var chartBars = chartData.map(function (d) {
      var cls = d.rate > 90 ? 'good' : d.rate > 80 ? 'mid' : 'low';
      return '<div class="chart-bar-wrap"><div class="chart-bar ' + cls + '" style="height:' + (d.rate * 2) + 'px"></div><span class="chart-bar-label">' + d.name + '</span></div>';
    }).join('');

    var calHtml = '<div class="calendar-grid">';
    calHtml += '<div class="calendar-day empty"></div><div class="calendar-day empty"></div>';
    calendarDays.forEach(function (d) {
      calHtml += '<button type="button" class="calendar-day" data-date="' + d.date + '"><span>' + d.day + '</span><span class="day-dot ' + d.status + '"></span></button>';
    });
    calHtml += '</div>';

    return '<div class="detail-header">' +
      '<div class="back">' +
        '<button type="button" id="detail-back">' + ic.chevronLeft + '</button>' +
        '<div>' +
          '<h1>長谷川 元洋 <span class="age-badge">8歳</span> <span class="chart-no">カルテNo: C00101</span></h1>' +
          '<p class="last-visit">最終来院日: 2025/12/15</p>' +
        '</div>' +
      '</div>' +
      '<div class="detail-actions">' +
        '<button type="button" class="btn btn-outline">' + ic.calendar + '来院予約</button>' +
        '<button type="button" class="btn btn-primary">' + ic.save + '変更を保存</button>' +
      '</div>' +
    '</div>' +
    '<div class="card device-panel" style="margin-bottom:1.5rem">' +
      '<div class="card-header" style="background:rgba(248,250,252,0.5);border-bottom:1px solid var(--border-light);padding:1rem">' +
        '<h3 class="card-title">' + ic.clock + '装置設定</h3>' +
      '</div>' +
      '<div class="card-content">' +
        '<div class="form-grid">' +
          '<div class="form-group"><label>使用装置</label><select><option>インビザライン</option><option>拡大床</option><option>プレオルソ</option></select></div>' +
          '<div class="form-group"><label>使用開始日</label><input type="date" value="2025-01-15"/></div>' +
          '<button type="button" class="btn btn-outline">設定を反映 (アプリへ送信)</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:2fr 1fr;gap:1.5rem;margin-bottom:1.5rem">' +
      '<div class="card">' +
        '<div class="card-header"><h3 class="card-title">治療進捗状況</h3><p class="card-description">現在の装置の装着期間と全体の進捗</p></div>' +
        '<div class="card-content">' +
          '<div class="progress-section">' +
            '<div class="progress-header"><span>現在の装置: インビザライン #3</span><span>1年2ヶ月 / 予定2年</span></div>' +
            '<div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:58%"></div></div>' +
            '<div class="progress-footer"><span>開始: 2024/12/01</span><span>終了予定: 2026/12/01</span></div>' +
          '</div>' +
          '<h4 style="font-size:0.875rem;font-weight:700;margin:1rem 0 0.5rem">装置履歴</h4>' +
          '<div class="history-list">' +
            '<div class="history-item current"><span class="dot red"></span><div class="body"><div class="title">インビザライン #3 (現在)</div><div class="date">2026/01/15 - 現在</div></div><span class="status red">装着中</span></div>' +
            '<div class="history-item done"><span class="dot blue"></span><div class="body"><div class="title">インビザライン #2</div><div class="date">2025/12/01 - 2026/01/14</div></div><span class="status blue">完了</span></div>' +
            '<div class="history-item done older"><span class="dot blue"></span><div class="body"><div class="title">インビザライン #1</div><div class="date">2025/11/01 - 2025/11/30</div></div><span class="status blue">完了</span></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="card chart-card">' +
        '<div class="card-header"><h3 class="card-title">装着達成率</h3><p class="card-description">月ごとの目標達成日数割合</p></div>' +
        '<div class="card-content" style="height:300px">' +
          '<div class="chart-bars">' + chartBars + '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="card">' +
      '<div class="card-header" style="display:flex;justify-content:space-between;align-items:center">' +
        '<h3 class="card-title">装着カレンダー (2026年2月)</h3>' +
        '<div class="calendar-legend">' +
          '<span><span class="dot" style="background:var(--blue)"></span>完璧</span>' +
          '<span><span class="dot" style="background:var(--green)"></span>良好</span>' +
          '<span><span class="dot" style="background:#eab308"></span>注意</span>' +
          '<span><span class="dot" style="background:var(--red)"></span>未達</span>' +
        '</div>' +
      '</div>' +
      '<div class="card-content">' +
        '<div style="grid-template-columns:repeat(7,1fr);gap:0.5rem;margin-bottom:0.5rem;text-align:center;font-size:0.875rem;color:var(--muted);font-weight:500;display:grid">日 月 火 水 木 金 土</div>' +
        calHtml +
      '</div>' +
    '</div>' +
    (state.photoModalDate ? renderPhotoModal(state.photoModalDate) : '');
  }

  function renderPhotoModal(date) {
    return '<div id="photo-modal" class="modal-overlay">' +
      '<div class="modal-content">' +
        '<div class="modal-header"><h2>' + date + ' の装着記録</h2></div>' +
        '<div class="modal-body">' +
          '<div class="photo-wrap">' +
            '<img src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&h=400&fit=crop" alt="Mouth"/>' +
            '<span class="photo-caption">撮影時刻: 20:15</span>' +
          '</div>' +
          '<div class="stats-grid">' +
            '<div class="stat-box"><div class="label">装着時間</div><div class="value">12h 30m</div></div>' +
            '<div class="stat-box"><div class="label">評価</div><div class="value blue">Good!</div></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderMessages() {
    var contact = state.selectedContact;
    var listHtml = mockContacts.map(function (c) {
      return '<button type="button" class="contact-item' + (c.id === contact.id ? ' active' : '') + '" data-id="' + c.id + '">' +
        '<div class="avatar">' + c.avatar + (c.unread > 0 ? '<span class="unread">' + c.unread + '</span>' : '') + '</div>' +
        '<div class="body">' +
          '<div style="display:flex;justify-content:space-between;margin-bottom:0.25rem"><span class="name">' + c.name + '</span><span class="time">' + c.time + '</span></div>' +
          '<p class="preview">' + c.lastMessage + '</p>' +
        '</div>' +
      '</button>';
    }).join('');

    var msgHtml = mockMessages.map(function (m) {
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
            '<div><div class="name">' + contact.name + '</div><div class="online"><span class="dot"></span>オンライン</div></div>' +
          '</div>' +
          '<div class="actions">' +
            '<button type="button">' + ic.phone + '</button>' +
            '<button type="button">' + ic.video + '</button>' +
            '<button type="button">' + ic.more + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="chat-messages">' + msgHtml + '</div>' +
        '<div class="chat-input-wrap">' +
          '<div class="row">' +
            '<input type="text" placeholder="メッセージを入力..." id="message-input" value="' + (state.messageInput || '') + '"/>' +
            '<button type="button" class="btn-send">' + ic.send + '</button>' +
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
          '<button type="button">' + ic.edit2 + '</button>' +
          '<button type="button" class="danger" data-delete="' + s.id + '">' + ic.trash + '</button>' +
        '</td></tr>';
    }).join('');

    return '<div class="settings-header">' +
      '<div><h1 class="page-title">設定</h1><p class="page-desc">医院情報やアカウント設定を管理します</p></div>' +
      '<button type="button" class="btn btn-primary">' + ic.save + '変更を保存</button>' +
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
        '<div class="card-footer" style="border-top:1px solid var(--border-light);padding:1rem;display:flex;justify-content:flex-end"><button type="button" class="btn btn-outline">パスワードを変更</button></div>' +
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
          '<button type="button" class="btn btn-primary btn-sm">' + ic.plus + 'スタッフ追加</button>' +
        '</div>' +
        '<div class="card-content">' +
          '<table class="staff-table"><thead><tr><th>氏名</th><th>役割</th><th>メールアドレス</th><th>ステータス</th><th style="text-align:right">操作</th></tr></thead><tbody>' + staffRows + '</tbody></table>' +
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

    var content = '';
    if (seg.base === '/' || seg.base === '') {
      content = renderHome();
    } else if (seg.base === '/patients' && seg.id) {
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

    app.innerHTML = renderDashboard(content, seg.base);

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
    app.querySelectorAll('.table-wrap tbody tr').forEach(function (tr) {
      tr.addEventListener('click', function () { navigateTo('/patients/' + tr.getAttribute('data-id')); });
    });

    // Patient detail
    var detailBack = app.querySelector('#detail-back');
    if (detailBack) detailBack.addEventListener('click', function () { window.history.back(); });
    app.querySelectorAll('.calendar-day[data-date]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.photoModalDate = btn.getAttribute('data-date');
        render();
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
})();
