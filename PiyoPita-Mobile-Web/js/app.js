/**
 * ぴよぴた モバイル - エントリポイント
 * ルーティング・描画・イベントを集約
 */
import { state, initData, setPatientInfo, setClinicInfo, addRecord, addMessage } from './core/state.js';
import { routes, getPath, getRouteState, navigateTo } from './core/router.js';
import { lsSync } from './lib/storage.js';
import { icons } from './lib/icons.js';
import { defaultClinicInfo, dummyDB } from './lib/constants.js';
import { renderTop } from './screens/Top.js';
import { renderTerms } from './screens/Terms.js';
import { renderQRScan } from './screens/QRScan.js';
import { renderManualClinic } from './screens/ManualClinic.js';
import { renderRegistration } from './screens/Registration.js';
import { renderCalendar } from './screens/Calendar.js';
import { renderRecordQR } from './screens/RecordQR.js';
import { renderRecordConfirm } from './screens/RecordConfirm.js';
import { renderGame } from './screens/Game.js';
import { renderMenu } from './screens/Menu.js';
import { renderDeviceInfo } from './screens/DeviceInfo.js';
import { renderMessages } from './screens/Messages.js';

function render() {
  const rs = getRouteState();
  const path = rs.path;
  const screenName = routes[path] || 'Top';
  const app = document.getElementById('app');
  if (!app) return;

  state.messages = lsSync.getMessages();
  const lsR = lsSync.getRecords();
  if (lsR.length > 0) state.records = lsR.map(r => { r.date = new Date(r.date); return r; });

  let html = '';
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
  else if (screenName === 'Messages') html = renderMessages();
  else html = renderTop();

  app.innerHTML = html;
  bindEvents(app, rs);
}

function bindEvents(app, routeState) {
  const path = routeState.path;

  app.querySelectorAll('[data-back]').forEach(el => {
    el.addEventListener('click', () => { window.history.back(); });
  });

  app.querySelectorAll('[data-nav]').forEach(el => {
    const to = el.getAttribute('data-nav');
    const query = el.getAttribute('data-query');
    el.addEventListener('click', () => {
      navigateTo(to, query ? (() => { const p = {}; query.split('&').forEach(s => { const kv = s.split('='); p[kv[0]] = kv[1]; }); return p; })() : null);
    });
  });

  const agreeCb = app.querySelector('#terms-agree');
  const agreeBtn = app.querySelector('#terms-submit');
  if (agreeCb && agreeBtn) {
    agreeBtn.disabled = !agreeCb.checked;
    agreeCb.addEventListener('change', () => {
      agreeBtn.disabled = !agreeCb.checked;
      agreeBtn.textContent = agreeCb.checked ? '歯科医師と連携開始' : '同意してください';
    });
    agreeBtn.addEventListener('click', () => {
      if (!agreeBtn.disabled) navigateTo('qr-scan');
    });
  }

  const manualClinicForm = app.querySelector('#manual-clinic-form');
  if (manualClinicForm) {
    const clinicIdInput = app.querySelector('#manual-clinic-id');
    const doctorIdInput = app.querySelector('#manual-doctor-id');
    const resultBox = app.querySelector('#manual-search-result');
    const errorMsg = app.querySelector('#manual-search-error');
    const clinicNameEl = app.querySelector('#result-clinic-name');
    const doctorNameEl = app.querySelector('#result-doctor-name');
    const submitBtn = app.querySelector('#manual-submit-btn');
    let foundClinicName = '';
    let foundDoctorName = '';

    function checkIds() {
      const cid = clinicIdInput.value.trim();
      const did = doctorIdInput.value.trim();
      if (cid === '' || did === '') {
        resultBox.classList.add('hidden');
        errorMsg.classList.add('hidden');
        submitBtn.disabled = true;
        return;
      }
      const cName = dummyDB.clinics[cid];
      const dName = dummyDB.doctors[did];
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

    manualClinicForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (submitBtn.disabled) return;
      setClinicInfo({
        clinicId: clinicIdInput.value.trim(),
        doctorId: doctorIdInput.value.trim(),
        clinicName: foundClinicName,
        doctorName: foundDoctorName
      });
      if (routeState.from === 'registration') window.history.back();
      else navigateTo('registration');
    });
  }

  const clinicEditBtn = app.querySelector('#clinic-edit-btn');
  if (clinicEditBtn) {
    clinicEditBtn.addEventListener('click', () => navigateTo('manual-clinic', { from: 'registration' }));
  }

  const regForm = app.querySelector('#registration-form');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const c = state.clinicInfo || defaultClinicInfo;
      const name = (app.querySelector('#reg-name') || {}).value.trim();
      const nickname = (app.querySelector('#reg-nickname') || {}).value.trim();
      const year = (app.querySelector('#reg-birth-year') || {}).value;
      const month = (app.querySelector('#reg-birth-month') || {}).value;
      const day = (app.querySelector('#reg-birth-day') || {}).value;
      if (!name || !year || !month || !day) {
        alert('患者名と生年月日を入力してください');
        return;
      }
      const birthDateStr = year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
      setPatientInfo({
        name,
        nickname: nickname || name,
        birthDate: new Date(birthDateStr),
        clinicName: c.clinicName,
        doctorName: c.doctorName
      });
      navigateTo('calendar');
    });
  }

  const qrArea = app.querySelector('#qr-area-tappable');
  if (qrArea) {
    qrArea.addEventListener('click', (e) => {
      if (e.target.closest('#qr-cant-read-btn') || e.target.closest('.header')) return;
      const successEl = app.querySelector('#qr-success');
      if (successEl && !successEl.classList.contains('hidden')) return;
      const hint = app.querySelector('#qr-hint');
      const tapHint = app.querySelector('.qr-tap-hint');
      const cantReadBtn = app.querySelector('#qr-cant-read-btn');
      if (hint) hint.textContent = 'スキャン成功！';
      if (tapHint) tapHint.classList.add('hidden');
      if (cantReadBtn) cantReadBtn.classList.add('hidden');
      if (successEl) successEl.classList.remove('hidden');
      setClinicInfo(defaultClinicInfo);
      setTimeout(() => navigateTo('registration'), 500);
    });
  }

  const cantReadBtn = app.querySelector('#qr-cant-read-btn');
  if (cantReadBtn) {
    cantReadBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateTo('manual-clinic');
    });
  }

  const recordQrArea = app.querySelector('#record-qr-area-tappable');
  if (recordQrArea) {
    recordQrArea.addEventListener('click', (e) => {
      if (e.target.closest('#peeled-btn') || e.target.closest('.record-qr-header') || e.target.closest('.bottom-nav')) return;
      const successEl = app.querySelector('#record-qr-success');
      if (successEl && !successEl.classList.contains('hidden')) return;
      const hint = app.querySelector('#record-qr-hint');
      const tapHint = app.querySelector('.qr-tap-hint');
      if (hint) hint.textContent = 'スキャン成功！';
      if (tapHint) tapHint.classList.add('hidden');
      if (successEl) successEl.classList.remove('hidden');
      setTimeout(() => navigateTo('record-confirm', { evaluation: 'good' }), 500);
    });
  }

  const peeledBtn = app.querySelector('#peeled-btn');
  if (peeledBtn) {
    peeledBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateTo('record-confirm', { evaluation: 'peeled' });
    });
  }

  const dtEditToggle = app.querySelector('#datetime-edit-toggle');
  const dtEditBlock = app.querySelector('#datetime-edit-block');
  const dtDisplay = app.querySelector('#datetime-display');
  const dateInput = app.querySelector('#record-date-input');
  const timeInput = app.querySelector('#record-time-input');
  const dtModifiedSpan = app.querySelector('#datetime-modified-span');
  const dispDate = app.querySelector('#display-date');
  const dispTime = app.querySelector('#display-time');

  if (dtEditToggle && dtEditBlock && dtDisplay && dateInput && timeInput) {
    dateInput.value = dtDisplay.getAttribute('data-original-date');
    timeInput.value = dtDisplay.getAttribute('data-original-time');

    dtEditToggle.addEventListener('click', () => {
      const isHidden = dtEditBlock.classList.contains('hidden');
      if (isHidden) {
        dtEditBlock.classList.remove('hidden');
        dtEditToggle.innerHTML = '閉じる';
        dispDate.classList.add('hidden');
        dispTime.classList.add('hidden');
      } else {
        dtEditBlock.classList.add('hidden');
        dtEditToggle.innerHTML = icons.clock + ' 日時を修正';
        dispDate.classList.remove('hidden');
        dispTime.classList.remove('hidden');
      }
    });

    function updateDateTime() {
      const origDate = dtDisplay.getAttribute('data-original-date');
      const origTime = dtDisplay.getAttribute('data-original-time');
      const newDate = dateInput.value;
      const newTime = timeInput.value;
      if (newDate !== origDate || newTime !== origTime) {
        if (dtModifiedSpan) dtModifiedSpan.classList.remove('hidden');
      } else {
        if (dtModifiedSpan) dtModifiedSpan.classList.add('hidden');
      }
      const dObj = new Date(newDate);
      if (!isNaN(dObj.getTime())) {
        dispDate.textContent = dObj.getFullYear() + '年' + (dObj.getMonth() + 1) + '月' + dObj.getDate() + '日 ';
      }
      dispTime.textContent = newTime;
    }

    dateInput.addEventListener('change', updateDateTime);
    timeInput.addEventListener('change', updateDateTime);
  }

  const confirmSaveBtn = app.querySelector('#confirm-save');
  if (confirmSaveBtn) {
    confirmSaveBtn.addEventListener('click', () => {
      const evalVal = routeState.evaluation || 'good';
      const dateInputEl = app.querySelector('#record-date-input');
      const timeInputEl = app.querySelector('#record-time-input');
      const finalDateStr = dateInputEl ? dateInputEl.value : '';
      const finalTimeStr = timeInputEl ? timeInputEl.value : '';
      let recordDate = new Date();
      if (finalDateStr) {
        const parts = finalDateStr.split('-');
        if (parts.length === 3) {
          recordDate.setFullYear(parseInt(parts[0], 10));
          recordDate.setMonth(parseInt(parts[1], 10) - 1);
          recordDate.setDate(parseInt(parts[2], 10));
        }
      }
      const modSpan = app.querySelector('#datetime-modified-span');
      const modified = modSpan && !modSpan.classList.contains('hidden');
      addRecord({
        id: String(Date.now()),
        date: recordDate,
        evaluation: evalVal,
        time: finalTimeStr || '00:00',
        isTimeModified: modified
      });
      navigateTo('game', { newRecord: '1' });
    });
  }

  const prevMonth = app.querySelector('#prev-month');
  const nextMonth = app.querySelector('#next-month');
  if (prevMonth) {
    prevMonth.addEventListener('click', () => {
      if (typeof state.calendarMonth !== 'undefined') state.calendarMonth--;
      render();
    });
  }
  if (nextMonth) {
    nextMonth.addEventListener('click', () => {
      if (typeof state.calendarMonth !== 'undefined') state.calendarMonth++;
      render();
    });
  }

  app.querySelectorAll('[data-record-id]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.getAttribute('data-record-id');
      if (!id) return;
      const rec = state.records.find(r => r.id === id);
      if (rec) state.selectedRecord = rec;
      render();
    });
  });

  const modalClose = app.querySelector('#modal-close');
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      state.selectedRecord = null;
      render();
    });
  }
  const modalOverlay = app.querySelector('#modal-overlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) { state.selectedRecord = null; render(); }
    });
  }

  const logoutBtn = app.querySelector('#menu-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('ログアウトしますか？')) {
        state.patientInfo = null;
        navigateTo('');
      }
    });
  }

  const chatSend = app.querySelector('#chat-send');
  const chatInput = app.querySelector('#chat-input');
  if (chatSend && chatInput) {
    chatSend.addEventListener('click', () => {
      if (chatInput.value.trim() !== '') {
        addMessage(chatInput.value.trim());
        render();
        const area = document.getElementById('chat-area');
        if (area) area.scrollTop = area.scrollHeight;
      }
    });
  }

  app.querySelectorAll('[data-alert]').forEach(el => {
    el.addEventListener('click', () => {
      const msg = el.getAttribute('data-alert') || '準備中です';
      alert(msg);
    });
  });
}

initData();
window.addEventListener('hashchange', render);
if (!window.location.hash) window.location.hash = '';
render();

setInterval(() => {
  if (window.location.hash === '#messages' || window.location.hash === '#calendar') {
    const oldMsgLen = state.messages.length;
    state.messages = lsSync.getMessages();
    if (state.messages.length !== oldMsgLen) render();
  }
}, 2000);
