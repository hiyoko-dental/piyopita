/**
 * アプリ状態（患者・医院・記録・メッセージ）
 */
import { lsSync } from '../lib/storage.js';
import { defaultClinicInfo } from '../lib/constants.js';

export const state = {
  patientInfo: null,
  clinicInfo: {
    clinicId: defaultClinicInfo.clinicId,
    doctorId: defaultClinicInfo.doctorId,
    clinicName: defaultClinicInfo.clinicName,
    doctorName: defaultClinicInfo.doctorName
  },
  records: [],
  messages: [],
  lastRouteState: null
};

export function initData() {
  const loadedRecords = lsSync.getRecords();
  if (loadedRecords.length > 0) {
    state.records = loadedRecords.map(r => {
      r.date = new Date(r.date);
      return r;
    });
  } else {
    state.records = [
      { id: '1', date: new Date(2026, 1, 10), evaluation: 'good', time: '07:15', isTimeModified: false },
      { id: '2', date: new Date(2026, 1, 11), evaluation: 'good', time: '07:20', isTimeModified: false },
      { id: '3', date: new Date(2026, 1, 12), evaluation: 'normal', time: '08:30', isTimeModified: true },
      { id: '4', date: new Date(2026, 1, 13), evaluation: 'peeled', time: '07:00', isTimeModified: false }
    ];
    lsSync.saveRecords(state.records);
  }
  state.messages = lsSync.getMessages();
}

export function setPatientInfo(info) {
  state.patientInfo = info;
}

export function setClinicInfo(info) {
  state.clinicInfo = {
    clinicId: info.clinicId !== undefined ? String(info.clinicId) : (state.clinicInfo && state.clinicInfo.clinicId) || defaultClinicInfo.clinicId,
    doctorId: info.doctorId !== undefined ? String(info.doctorId) : (state.clinicInfo && state.clinicInfo.doctorId) || defaultClinicInfo.doctorId,
    clinicName: info.clinicName || defaultClinicInfo.clinicName,
    doctorName: info.doctorName || defaultClinicInfo.doctorName
  };
}

export function addRecord(record) {
  state.records = state.records.concat([record]);
  lsSync.saveRecords(state.records);
}

export function addMessage(text) {
  const now = new Date();
  const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
  state.messages.push({ id: Date.now(), sender: 'patient', text, time: timeStr });
  lsSync.saveMessages(state.messages);
}

export function getRecordByDate(date) {
  return state.records.find(r =>
    r.date.getFullYear() === date.getFullYear() &&
    r.date.getMonth() === date.getMonth() &&
    r.date.getDate() === date.getDate()
  );
}
