(function () {
  'use strict';

  // --- State (in-memory for demo) ---
  var defaultClinicInfo = { clinicId: '', doctorId: '', clinicName: 'ほりみき歯科', doctorName: '堀 美喜' };
  
  var dummyDB = {
    clinics: {
      '123456': 'ほりみき歯科',
      '987654': 'ぴよぴた小児歯科'
    },
    doctors: {
      'doctor01': '堀 美喜',
      'doctor02': '山田 太郎'
    }
  };

  var state = {
    patientInfo: null,
    clinicInfo: {
      clinicId: defaultClinicInfo.clinicId,
      doctorId: defaultClinicInfo.doctorId,
      clinicName: defaultClinicInfo.clinicName,
      doctorName: defaultClinicInfo.doctorName
    },
    records: [
      { id: '1', date: new Date(2026, 1, 10), evaluation: 'good', time: '07:15', isTimeModified: false },
      { id: '2', date: new Date(2026, 1, 11), evaluation: 'good', time: '07:20', isTimeModified: false },
      { id: '3', date: new Date(2026, 1, 12), evaluation: 'normal', time: '08:30', isTimeModified: true },
      { id: '4', date: new Date(2026, 1, 13), evaluation: 'peeled', time: '07:00', isTimeModified: false }
    ],
    lastRouteState: null
  };

  function setPatientInfo(info) {
    state.patientInfo = info;
  }

  function setClinicInfo(info) {
    state.clinicInfo = {
      clinicId: info.clinicId !== undefined ? String(info.clinicId) : (state.clinicInfo && state.clinicInfo.clinicId) || defaultClinicInfo.clinicId,
      doctorId: info.doctorId !== undefined ? String(info.doctorId) : (state.clinicInfo && state.clinicInfo.doctorId) || defaultClinicInfo.doctorId,
      clinicName: info.clinicName || defaultClinicInfo.clinicName,
      doctorName: info.doctorName || defaultClinicInfo.doctorName
    };
  }

  function addRecord(record) {
    state.records = state.records.concat([record]);
  }

  function getRecordByDate(date) {
    return state.records.find(function (r) {
      return r.date.getFullYear() === date.getFullYear() &&
        r.date.getMonth() === date.getMonth() &&
        r.date.getDate() === date.getDate();
    });
  }

  // --- Routing (hash) ---
  var routes = {
    '': 'Top',
    'terms': 'Terms',
    'qr-scan': 'QRScan',
    'manual-clinic': 'ManualClinic',
    'registration': 'Registration',
    'calendar': 'Calendar',
    'record-qr': 'RecordQR',
    'record-confirm': 'RecordConfirm',
    'game': 'Game',
    'menu': 'Menu',
    'device-info': 'DeviceInfo'
  };

  function getPath() {
    var hash = window.location.hash.slice(1) || '';
    var q = hash.indexOf('?');
    return q >= 0 ? hash.slice(0, q) : hash;
  }

  function getRouteState() {
    var path = getPath();
    var query = {};
    var idx = (window.location.hash || '').indexOf('?');
    if (idx >= 0) {
      var params = new URLSearchParams(window.location.hash.slice(idx));
      params.forEach(function (v, k) { query[k] = v; });
    }
    return { path: path, evaluation: query.evaluation || null, from: query.from || null, query: query };
  }

  function navigateTo(path, query) {
    var q = query ? '?' + new URLSearchParams(query).toString() : '';
    window.location.hash = (path || '') + q;
  }

  function render() {
    var rs = getRouteState();
    var path = rs.path;
    var screenName = routes[path] || 'Top';
    var app = document.getElementById('app');
    if (!app) return;

    var html = '';
    if (screenName === 'Top') html = renderTop();
    else if (screenName === 'Terms') html = renderTerms();
    else if (screenName === 'QRScan') html = renderQRScan();
    else if (screenName === 'ManualClinic') html = renderManualClinic(rs);
    else if (screenName === 'Registration') html = renderRegistration();
    else if (screenName === 'Calendar') html = renderCalendar();
    else if (screenName === 'RecordQR') html = renderRecordQR();
    else if (screenName === 'RecordConfirm') html = renderRecordConfirm(rs.evaluation);
    else if (screenName === 'Game') html = renderGame(rs);
    else if (screenName === 'Menu') html = renderMenu();
    else if (screenName === 'DeviceInfo') html = renderDeviceInfo();
    else html = renderTop();

    app.innerHTML = html;
    bindEvents(app, rs);
  }

  function bindEvents(app, routeState) {
    var path = routeState.path;

    // Back buttons
    app.querySelectorAll('[data-back]').forEach(function (el) {
      el.addEventListener('click', function () { window.history.back(); });
    });

    // Navigate
    app.querySelectorAll('[data-nav]').forEach(function (el) {
      var to = el.getAttribute('data-nav');
      var query = el.getAttribute('data-query');
      el.addEventListener('click', function () {
        navigateTo(to, query ? (function () { var p = {}; query.split('&').forEach(function (s) { var kv = s.split('='); p[kv[0]] = kv[1]; }); return p; })() : null);
      });
    });

    // Terms agree
    var agreeCb = app.querySelector('#terms-agree');
    var agreeBtn = app.querySelector('#terms-submit');
    if (agreeCb && agreeBtn) {
      agreeBtn.disabled = !agreeCb.checked;
      agreeCb.addEventListener('change', function () {
        agreeBtn.disabled = !agreeCb.checked;
        if (agreeCb.checked) agreeBtn.textContent = '歯科医師と連携開始';
        else agreeBtn.textContent = '同意してください';
      });
      agreeBtn.addEventListener('click', function () {
        if (!agreeBtn.disabled) {
          navigateTo('qr-scan');
        }
      });
    }

    // Manual clinic form
    var manualClinicForm = app.querySelector('#manual-clinic-form');
    if (manualClinicForm) {
      var clinicIdInput = app.querySelector('#manual-clinic-id');
      var doctorIdInput = app.querySelector('#manual-doctor-id');
      var resultBox = app.querySelector('#manual-search-result');
      var errorMsg = app.querySelector('#manual-search-error');
      var clinicNameEl = app.querySelector('#result-clinic-name');
      var doctorNameEl = app.querySelector('#result-doctor-name');
      var submitBtn = app.querySelector('#manual-submit-btn');

      var foundClinicName = '';
      var foundDoctorName = '';

      function checkIds() {
        var cid = clinicIdInput.value.trim();
        var did = doctorIdInput.value.trim();
        
        if (cid === '' || did === '') {
          resultBox.classList.add('hidden');
          errorMsg.classList.add('hidden');
          submitBtn.disabled = true;
          return;
        }

        var cName = dummyDB.clinics[cid];
        var dName = dummyDB.doctors[did];

        if (cName && dName) {
          foundClinicName = cName;
          foundDoctorName = dName;
          clinicNameEl.textContent = cName;
          doctorNameEl.textContent = dName;
          resultBox.classList.remove('hidden');
          errorMsg.classList.add('hidden');
          submitBtn.disabled = false;
        } else {
          resultBox.classList.add('hidden');
          errorMsg.classList.remove('hidden');
          submitBtn.disabled = true;
        }
      }

      clinicIdInput.addEventListener('input', checkIds);
      doctorIdInput.addEventListener('input', checkIds);
      checkIds();

      manualClinicForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (submitBtn.disabled) return;
        
        setClinicInfo({
          clinicId: clinicIdInput.value.trim(),
          doctorId: doctorIdInput.value.trim(),
          clinicName: foundClinicName,
          doctorName: foundDoctorName
        });
        
        if (routeState.from === 'registration') {
          window.history.back();
        } else {
          navigateTo('registration');
        }
      });
    }

    // Edit Clinic
    var clinicEditBtn = app.querySelector('#clinic-edit-btn');
    if (clinicEditBtn) {
      clinicEditBtn.addEventListener('click', function () {
        navigateTo('manual-clinic', { from: 'registration' });
      });
    }

    // Registration form
    var regForm = app.querySelector('#registration-form');
    if (regForm) {
      regForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var c = state.clinicInfo || defaultClinicInfo;
        var name = (app.querySelector('#reg-name') || {}).value.trim();
        var nickname = (app.querySelector('#reg-nickname') || {}).value.trim();
        var birthDate = (app.querySelector('#reg-birth') || {}).value;
        if (!name || !birthDate) {
          alert('患者名と生年月日を入力してください');
          return;
        }
        setPatientInfo({
          name: name,
          nickname: nickname || name,
          birthDate: new Date(birthDate),
          clinicName: c.clinicName,
          doctorName: c.doctorName
        });
        navigateTo('calendar');
      });
    }

    // QR Scan (初回連携用)
    function doQRScanSuccess() {
      var hint = app.querySelector('#qr-hint');
      var tapHint = app.querySelector('.qr-tap-hint');
      var success = app.querySelector('#qr-success');
      var cantReadBtn = app.querySelector('#qr-cant-read-btn');
      if (hint) hint.textContent = 'スキャン成功！';
      if (tapHint) tapHint.classList.add('hidden');
      if (cantReadBtn) cantReadBtn.classList.add('hidden');
      if (success) success.classList.remove('hidden');
      setClinicInfo(defaultClinicInfo);
      setTimeout(function () { navigateTo('registration'); }, 500);
    }

    var qrArea = app.querySelector('#qr-area-tappable');
    if (qrArea) {
      qrArea.addEventListener('click', function (e) {
        if (e.target.closest('#qr-cant-read-btn') || e.target.closest('.header')) return;
        var successEl = app.querySelector('#qr-success');
        if (successEl && !successEl.classList.contains('hidden')) return;
        doQRScanSuccess();
      });
    }

    var cantReadBtn = app.querySelector('#qr-cant-read-btn');
    if (cantReadBtn) {
      cantReadBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        navigateTo('manual-clinic');
      });
    }

    // Record QR (日々の記録用)
    var recordQrArea = app.querySelector('#record-qr-area-tappable');
    if (recordQrArea) {
      recordQrArea.addEventListener('click', function (e) {
        if (e.target.closest('#peeled-btn') || e.target.closest('.record-qr-header') || e.target.closest('.bottom-nav')) return;

        var successEl = app.querySelector('#record-qr-success');
        if (successEl && !successEl.classList.contains('hidden')) return;

        var hint = app.querySelector('#record-qr-hint');
        var tapHint = app.querySelector('.qr-tap-hint');
        if (hint) hint.textContent = 'スキャン成功！';
        if (tapHint) tapHint.classList.add('hidden');
        if (successEl) successEl.classList.remove('hidden');

        setTimeout(function () { navigateTo('record-confirm', { evaluation: 'good' }); }, 500);
      });
    }

    var peeledBtn = app.querySelector('#peeled-btn');
    if (peeledBtn) {
      peeledBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        navigateTo('record-confirm', { evaluation: 'peeled' });
      });
    }

    // Record confirm
    var timeEditToggle = app.querySelector('#time-edit-toggle');
    var timeEditBlock = app.querySelector('#time-edit-block');
    var timeDisplay = app.querySelector('#time-display');
    var timeInput = app.querySelector('#record-time-input');
    if (timeEditToggle && timeEditBlock && timeDisplay) {
      timeEditToggle.addEventListener('click', function () {
        var isOpen = timeEditBlock.classList.toggle('hidden');
        timeEditToggle.innerHTML = isOpen ? '閉じる' : (icons.clock + ' 時刻を修正');
        timeDisplay.classList.toggle('hidden', isOpen);
      });
    }
    if (timeInput) {
      timeInput.addEventListener('change', function () {
        var modifiedSpan = app.querySelector('#time-modified-span');
        if (modifiedSpan) modifiedSpan.classList.remove('hidden');
        var timeDisplay = app.querySelector('#time-display');
        if (timeDisplay) timeDisplay.textContent = timeInput.value + ' ';
      });
    }

    var confirmSaveBtn = app.querySelector('#confirm-save');
    if (confirmSaveBtn) {
      confirmSaveBtn.addEventListener('click', function () {
        var evalVal = routeState.evaluation || 'good';
        var timeInputEl = app.querySelector('#record-time-input');
        var time = timeInputEl ? timeInputEl.value : (function () { var n = new Date(); return ('' + n.getHours()).padStart(2, '0') + ':' + ('' + n.getMinutes()).padStart(2, '0'); })();
        var modSpan = app.querySelector('#time-modified-span');
        var modified = modSpan && !modSpan.classList.contains('hidden');
        addRecord({
          id: String(Date.now()),
          date: new Date(),
          evaluation: evalVal,
          time: time,
          isTimeModified: modified
        });
        navigateTo('game', { newRecord: '1' });
      });
    }

    // Calendar
    var prevMonth = app.querySelector('#prev-month');
    var nextMonth = app.querySelector('#next-month');
    if (prevMonth) prevMonth.addEventListener('click', function () { state.calendarMonth = (state.calendarMonth || 1) - 1; render(); });
    if (nextMonth) nextMonth.addEventListener('click', function () { state.calendarMonth = (state.calendarMonth || 1) + 1; render(); });

    app.querySelectorAll('[data-record-id]').forEach(function (el) {
      el.addEventListener('click', function () {
        var id = el.getAttribute('data-record-id');
        if (!id) return;
        var rec = state.records.find(function (r) { return r.id === id; });
        if (rec) state.selectedRecord = rec;
        render();
      });
    });

    var modalClose = app.querySelector('#modal-close');
    if (modalClose) {
      modalClose.addEventListener('click', function () {
        state.selectedRecord = null;
        render();
      });
    }
    var modalOverlay = app.querySelector('#modal-overlay');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) { state.selectedRecord = null; render(); }
      });
    }

    // Menu logout
    var logoutBtn = app.querySelector('#menu-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        if (confirm('ログアウトしますか？')) {
          state.patientInfo = null;
          navigateTo('');
        }
      });
    }

    // Placeholder alerts
    app.querySelectorAll('[data-alert]').forEach(function (el) {
      el.addEventListener('click', function () {
        var msg = el.getAttribute('data-alert') || '準備中です';
        alert(msg);
      });
    });
  }

  // --- Icons (inline SVG strings) ---
  var icons = {
    bird: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/></svg>',
    arrowLeft: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>',
    externalLink: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    qrCode: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h1v4h4v-4h1"/><path d="M14 17h3"/></svg>',
    scan: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/></svg>',
    building: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 0 2-2V4"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>',
    user: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>',
    calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    sparkles: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>',
    clock: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    camera: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>',
    check: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
    star: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    award: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
    menu: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>',
    alertCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    chevronLeft: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>',
    chevronRight: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>',
    x: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    logOut: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
    stethoscope: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2H5Z"/><path d="M5 9a6 6 0 0 0 6 6v4"/><path d="M15 9a6 6 0 0 0 6 6v4"/><path d="M19 6v3"/><path d="M21 9h-2"/><path d="M19 15h2"/></svg>',
    helpCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
    bell: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
    gamepad: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg>',
    edit: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>'
  };

  var MONTHS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  var WEEKDAYS = ['日','月','火','水','木','金','土'];

  function evalColor(e) {
    return { good: '#4A90E2', normal: '#FFD700', bad: '#FF6B6B', peeled: '#4CAF50' }[e] || '#666';
  }
  function evalLabel(e) {
    return { good: '完全脱色', normal: '装着中', bad: '未実施', peeled: 'シール剥がれ' }[e] || '';
  }

  function renderTop() {
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

  function renderTerms() {
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

  function renderQRScan() {
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

  function renderManualClinic(routeState) {
    var c = state.clinicInfo || defaultClinicInfo;
    var backNav = (routeState && routeState.from === 'registration') ? 'registration' : 'qr-scan';
    var submitLabel = backNav === 'registration' ? '反映して患者情報の登録に戻る' : '患者情報の登録へ進む';
    var backAttr = 'data-back';
    
    return '<div class="screen">' +
      '<header class="header">' +
        '<button type="button" class="btn-icon" ' + backAttr + '>' + icons.arrowLeft + '</button>' +
        '<h1>医院情報を手動で入力</h1>' +
      '</header>' +
      '<form id="manual-clinic-form" class="form-content">' +
        '<p class="manual-clinic-desc">医院IDと歯科医師IDを入力してください。該当する医院情報が自動で表示されます。</p>' +
        '<div class="form-group"><label>医院ID <span class="required">*</span></label><input type="text" id="manual-clinic-id" placeholder="例: 123456" value="' + (c.clinicId || '').replace(/"/g, '&quot;') + '"/></div>' +
        '<div class="form-group"><label>歯科医師ID <span class="required">*</span></label><input type="text" id="manual-doctor-id" placeholder="例: doctor01" value="' + (c.doctorId || '').replace(/"/g, '&quot;') + '"/></div>' +
        '<div id="manual-search-error" class="search-error-msg hidden">該当する医院または担当医が見つかりません。</div>' +
        '<div id="manual-search-result" class="clinic-card hidden" style="margin-top: 1.5rem;">' +
          '<div class="badge">' + icons.building + ' 検索結果</div>' +
          '<div class="clinic-row"><span>' + icons.building + '</span><div><p class="label">医院名</p><p class="value" id="result-clinic-name"></p></div></div>' +
          '<div class="clinic-row"><span>' + icons.user + '</span><div><p class="label">担当医</p><p class="value" id="result-doctor-name"></p></div></div>' +
        '</div>' +
        '<div class="reg-footer" style="border-top:none;padding-top:1rem">' +
          '<button type="submit" id="manual-submit-btn" class="btn-primary" disabled>' + submitLabel + '</button>' +
        '</div>' +
      '</form>' +
    '</div>';
  }

  function renderRegistration() {
    var c = state.clinicInfo || defaultClinicInfo;
    return '<div class="screen">' +
      '<header class="header">' +
        '<button type="button" class="btn-icon" data-back>' + icons.arrowLeft + '</button>' +
        '<h1>患者情報の登録</h1>' +
      '</header>' +
      '<form id="registration-form" class="form-content">' +
        '<div class="clinic-card">' +
          '<div class="clinic-card-header">' +
            '<div class="badge">' + icons.sparkles + ' 連携先</div>' +
            '<button type="button" class="clinic-edit-btn" id="clinic-edit-btn" title="医院情報を編集">' + icons.edit + '</button>' +
          '</div>' +
          '<div class="clinic-row"><span>' + icons.building + '</span><div><p class="label">医院名</p><p class="value">' + (c.clinicName || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') + '</p></div></div>' +
          '<div class="clinic-row"><span>' + icons.user + '</span><div><p class="label">担当医</p><p class="value">' + (c.doctorName || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') + '</p></div></div>' +
        '</div>' +
        '<div class="form-group"><label>患者名 <span class="required">*</span></label><input type="text" id="reg-name" placeholder="山田 太郎" required/></div>' +
        '<div class="form-group"><label>ニックネーム <span class="optional">(任意)</span></label><input type="text" id="reg-nickname" placeholder="たろう / もっちゃん など"/><p class="hint">アプリ内で表示される名前です</p></div>' +
        '<div class="form-group"><label>生年月日 <span class="required">*</span></label><input type="date" id="reg-birth" required/></div>' +
        '<div class="note-box"><p><strong>※ 登録後の変更について</strong><br/>登録後、患者名と生年月日は変更できません。ニックネームは設定画面から変更可能です。</p></div>' +
      '</form>' +
      '<div class="reg-footer"><button type="submit" form="registration-form" class="btn-primary">歯科医師と連携</button></div>' +
    '</div>';
  }

  function renderCalendar() {
    var year = 2026;
    var month = (state.calendarMonth !== undefined) ? state.calendarMonth : 1;
    if (month < 0) { year--; month = 11; }
    if (month > 11) { year++; month = 0; }
    state.calendarMonth = month;
    state.calendarYear = year;

    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var firstDay = new Date(year, month, 1).getDay();
    var today = new Date(2026, 1, 17);

    var daysHtml = '';
    for (var i = 0; i < firstDay; i++) daysHtml += '<div class="day-cell empty"></div>';
    for (var d = 1; d <= daysInMonth; d++) {
      var date = new Date(year, month, d);
      var rec = state.records.find(function (r) {
        return r.date.getFullYear() === year && r.date.getMonth() === month && r.date.getDate() === d;
      });
      var isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
      var cls = 'day-cell';
      if (isToday) cls += ' today';
      if (rec) cls += ' has-record';
      var dot = rec ? '<span class="dot ' + rec.evaluation + '"></span>' : '';
      daysHtml += '<button type="button" class="' + cls + '" data-record-id="' + (rec ? rec.id : '') + '">' + d + dot + '</button>';
    }

    var selected = state.selectedRecord;
    var modalHtml = '';
    if (selected) {
      modalHtml = '<div id="modal-overlay" class="modal-overlay">' +
        '<div class="modal-panel">' +
          '<div class="modal-header"><h3>記録詳細</h3><button type="button" id="modal-close" class="modal-close">' + icons.x + '</button></div>' +
          '<div class="info-block"><p class="label">日付</p><p class="value">' + selected.date.getFullYear() + '年' + (selected.date.getMonth()+1) + '月' + selected.date.getDate() + '日</p></div>' +
          '<div class="info-block"><p class="label">評価</p><div class="value-row"><span class="dot" style="background:' + evalColor(selected.evaluation) + '"></span><span>' + evalLabel(selected.evaluation) + '</span></div></div>' +
          '<div class="info-block"><p class="label">記録時刻</p><div class="value-row">' + icons.clock + ' <span>' + selected.time + (selected.isTimeModified ? ' <span class="text-muted">(修正済)</span>' : '') + '</span></div></div>' +
        '</div></div>';
    }

    return '<div class="screen calendar-screen">' +
      '<div class="calendar-header">' +
        '<div class="user"><span>▼</span><strong>' + (state.patientInfo ? state.patientInfo.nickname : 'ゲスト') + '</strong></div>' +
        '<div class="calendar-nav">' +
          '<button type="button" id="prev-month">' + icons.chevronLeft + '</button>' +
          '<h2>' + year + '年 ' + MONTHS[month] + '</h2>' +
          '<button type="button" id="next-month">' + icons.chevronRight + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="calendar-body">' +
        '<div class="weekdays">' +
          WEEKDAYS.map(function (w, i) {
            var c = i === 0 ? 'sun' : i === 6 ? 'sat' : 'other';
            return '<div class="' + c + '">' + w + '</div>';
          }).join('') +
        '</div>' +
        '<div class="days-grid">' + daysHtml + '</div>' +
        '<div class="legend">' +
          '<div class="legend-item"><span class="dot good"></span>完全脱色</div>' +
          '<div class="legend-item"><span class="dot normal"></span>装着中</div>' +
          '<div class="legend-item"><span class="dot bad"></span>未実施</div>' +
          '<div class="legend-item"><span class="dot peeled"></span>シール剥がれ</div>' +
        '</div>' +
      '</div>' + modalHtml +
      renderBottomNav('calendar') +
    '</div>';
  }

  function renderRecordQR() {
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

  function renderRecordConfirm(evaluation) {
    evaluation = evaluation || 'good';
    var now = new Date();
    var timeStr = ('' + now.getHours()).padStart(2, '0') + ':' + ('' + now.getMinutes()).padStart(2, '0');
    var evalInfos = { good: { color: '#4A90E2', label: '完全脱色', icon: '✨' }, normal: { color: '#FFD700', label: '装着中', icon: '⏱️' }, peeled: { color: '#4CAF50', label: 'シール剥がれ', icon: '⚠️' }, bad: { color: '#FF6B6B', label: '未実施', icon: '❌' } };
    var info = evalInfos[evaluation] || evalInfos.good;
    return '<div class="screen">' +
      '<header class="header">' +
        '<button type="button" class="btn-icon" data-nav="record-qr">' + icons.arrowLeft + '</button>' +
        '<h1>記録の確認</h1>' +
      '</header>' +
      '<div class="confirm-content">' +
        '<div class="preview-box">' + icons.camera + '<span>撮影イメージ</span></div>' +
        '<div class="eval-card"><p class="label">評価</p><div class="value-row">' +
          '<span class="dot" style="width:1.5rem;height:1.5rem;border-radius:50%;background:' + info.color + '"></span>' +
          '<span class="icon-emoji">' + info.icon + '</span><span class="text">' + info.label + '</span></div></div>' +
        '<div class="eval-card"><p class="label">撮影日</p><p class="value">' + now.getFullYear() + '年' + (now.getMonth()+1) + '月' + now.getDate() + '日</p></div>' +
        '<div class="eval-card">' +
          '<div class="time-edit-row"><p class="label" style="margin:0">撮影時刻</p><button type="button" class="link" id="time-edit-toggle">' + icons.clock + ' 時刻を修正</button></div>' +
          '<div id="time-edit-block" class="hidden"><input type="time" id="record-time-input" value="' + timeStr + '"/></div>' +
          '<p id="time-display" class="value">' + timeStr + ' <span id="time-modified-span" class="hidden">(修正済)</span></p>' +
        '</div>' +
        (evaluation === 'peeled' ? '<div class="peeled-note"><p><strong>シール剥がれについて</strong><br/>次回来院時に歯科医師にお伝えください。新しいシールを貼り直す必要があります。</p></div>' : '') +
      '</div>' +
      '<div class="confirm-actions">' +
        '<button type="button" class="btn-primary" id="confirm-save">' + icons.check + ' 決定</button>' +
        '<button type="button" class="btn-outline" data-nav="record-qr">再撮影</button>' +
      '</div>' +
    '</div>';
  }

  function renderGame(routeState) {
    var newRecord = routeState.newRecord === '1';
    var consecutiveDays = state.records.filter(function (r) { return r.evaluation === 'good'; }).length;
    var totalRecords = state.records.length;
    var level = Math.floor(totalRecords / 5) + 1;
    var progress = Math.min((consecutiveDays / 30) * 100, 100);
    return '<div class="screen game-screen">' +
      '<div class="game-header"><h1>ぴよぴたゲーム</h1></div>' +
      '<div class="game-content">' +
        (newRecord ? '<div class="new-record-banner">' +
          '<div class="title-row">' + icons.sparkles + '<span>記録完了！</span>' + icons.sparkles + '</div>' +
          '<p>今日もがんばったね！ ひよこが喜んでるよ 🐣</p></div>' : '') +
        '<div class="game-character">' +
          '<div class="circle">' + icons.bird.replace('width="24" height="24"','width="128" height="128"') + '</div>' +
          '<div class="level-badge"><span class="lv">Lv.</span><span class="num">' + level + '</span></div>' +
        '</div>' +
        '<div class="game-stats">' +
          '<div class="game-stat-card">' +
            '<div class="row"><div class="left">' + icons.star + '<span>連続記録</span></div><span class="right">' + consecutiveDays + '日</span></div>' +
            '<div class="progress-bar"><div class="progress-fill" style="width:' + progress + '%"></div></div>' +
            '<p class="progress-hint">次の目標: 30日</p>' +
          '</div>' +
          '<div class="game-stat-card">' +
            '<div class="row"><div class="left">' + icons.award.replace('<svg ', '<svg class="primary" ') + '<span>総記録回数</span></div><span class="right">' + totalRecords + '回</span></div>' +
          '</div>' +
          '<div class="game-stat-card">' +
            '<h3>' + icons.sparkles + ' 獲得バッジ</h3>' +
            '<div class="badges-grid">' +
              (totalRecords >= 1 ? '<div class="badge-item"><span class="emoji">🌟</span><span>はじめの一歩</span></div>' : '') +
              (consecutiveDays >= 3 ? '<div class="badge-item"><span class="emoji">🔥</span><span>3日連続</span></div>' : '') +
              (totalRecords >= 10 ? '<div class="badge-item"><span class="emoji">🏆</span><span>10回達成</span></div>' : '<div class="badge-item locked"><span class="emoji">🔒</span><span>未獲得</span></div>') +
            '</div>' +
          '</div>' +
        '</div>' +
        '<p class="game-message">' + (consecutiveDays >= 7 ? '素晴らしい！この調子で続けよう！ 💪' : '毎日コツコツ記録して、ひよこを育てよう！ 🌱') + '</p>' +
      '</div>' +
      renderBottomNav('game') +
    '</div>';
  }

  function renderMenu() {
    var name = (state.patientInfo && state.patientInfo.nickname) ? state.patientInfo.nickname : 'ゲスト';
    var clinic = (state.patientInfo && state.patientInfo.clinicName) ? state.patientInfo.clinicName : '未登録';
    return '<div class="screen menu-screen">' +
      '<div class="menu-header">' +
        '<div class="profile">' +
          '<div class="avatar">' + icons.bird + '</div>' +
          '<div><h1>' + name + '</h1><p>' + clinic + '</p></div>' +
        '</div>' +
      '</div>' +
      '<div class="menu-list">' +
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

  function renderDeviceInfo() {
    return '<div class="screen">' +
      '<header class="header">' +
        '<button type="button" class="btn-icon" data-back>' + icons.arrowLeft + '</button>' +
        '<h1>使用装置について</h1>' +
      '</header>' +
      '<div class="device-content">' +
        '<div class="device-title-card"><h2>バイオネータ</h2><p>Bionator</p></div>' +
        '<div class="device-section"><p class="text-muted" style="margin:0 0 0.75rem">装置の写真</p><div class="photo-placeholder">' + icons.camera + '装置画像</div></div>' +
        '<div class="device-section">' +
          '<div class="section-title">' + icons.alertCircle + '<h3>歯科医師からの注意点</h3></div>' +
          '<div class="item"><p class="item-title">◆ 装着方法</p><p class="item-body">下顎の前歯にプラスチックが食い込むように装着してください。正しく装着できているか、鏡で確認しましょう。</p></div>' +
          '<div class="item"><p class="item-title">◆ 使用時間</p><p class="item-body">1日12時間以上の装着を目標にしてください。就寝時の装着が効果的です。</p></div>' +
          '<div class="item"><p class="item-title">◆ お手入れ方法</p><p class="item-body">使用後は必ず水洗いし、専用ケースに保管してください。週に1回は専用洗浄剤で洗浄しましょう。</p></div>' +
          '<div class="item"><p class="item-title">◆ 注意事項</p><p class="item-body">• 装着したまま飲食しないでください<br/>• 熱湯での洗浄は変形の原因になります<br/>• 紛失・破損した場合はすぐにご連絡ください</p></div>' +
        '</div>' +
        '<div class="device-section green">' +
          '<div class="section-title">' + icons.alertCircle + '<h3>装置シールについて</h3></div>' +
          '<p class="item-body">装置に貼られているシールは、装着状況を確認するための特殊なシールです。シールが剥がれた場合は、記録時に「シールが剥がれた」ボタンを押してください。</p>' +
        '</div>' +
        '<div class="device-section"><h3>ご不明な点は医院までお問い合わせください</h3><div class="item"><p class="item-body"><span class="text-muted">医院名</span> ほりみき歯科</p><p class="item-body"><span class="text-muted">担当医</span> 堀 美喜</p></div></div>' +
      '</div>' +
    '</div>';
  }

  function renderBottomNav(active) {
    var items = [
      { path: 'record-qr', icon: icons.qrCode, label: 'QR' },
      { path: 'calendar', icon: icons.calendar, label: 'CALENDAR' },
      { path: 'game', icon: icons.gamepad, label: 'GAME' },
      { path: 'menu', icon: icons.menu, label: 'MENU' }
    ];
    return '<nav class="bottom-nav"><div class="bottom-nav-inner">' +
      items.map(function (it) {
        var cls = 'bottom-nav-item' + (active === it.path ? ' active' : '');
        return '<button type="button" class="' + cls + '" data-nav="' + it.path + '">' + it.icon + '<span>' + it.label + '</span></button>';
      }).join('') +
    '</div></nav>';
  }

  window.addEventListener('hashchange', render);
  if (!window.location.hash) window.location.hash = '';
  render();
})();