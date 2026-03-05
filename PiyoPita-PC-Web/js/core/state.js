/**
 * PC版 UI 状態
 */

import { initialStaff, mockContacts } from '../data/mock.js';

export const state = {
  staffList: initialStaff.map((s) => ({ ...s })),
  contacts: mockContacts.map((c) => ({ ...c })),
  selectedContactId: (mockContacts[0] && mockContacts[0].id) || '1',
  messageInput: '',
  qrModalOpen: false,
  messages: [],
  detailYear: 2026,
  detailMonth: 2,
  searchTerm: '',
  deviceFilter: '',
  settingsTab: 'clinic',
  photoModalDate: null,
  photoModalTime: null,
  photoModalStatus: null,
  lastPath: '',
  _lastRecCount: undefined
};

export function getSelectedContact() {
  return state.contacts.find((c) => c.id === state.selectedContactId) || state.contacts[0];
}

export function setSelectedContact(id) {
  state.selectedContactId = id;
}

