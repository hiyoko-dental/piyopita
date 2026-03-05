import { icons } from '../lib/icons.js';
import { state } from '../core/state.js';
import { MONTHS, WEEKDAYS } from '../lib/constants.js';
import { evalColor, evalLabel } from '../lib/constants.js';
import { renderBottomNav } from './BottomNav.js';

export function renderCalendar() {
  const today = new Date();
  let year = state.calendarYear || today.getFullYear();
  let month = state.calendarMonth !== undefined ? state.calendarMonth : today.getMonth();

  if (month < 0) { year--; month = 11; }
  if (month > 11) { year++; month = 0; }
  state.calendarMonth = month;
  state.calendarYear = year;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  let daysHtml = '';
  for (let i = 0; i < firstDay; i++) daysHtml += '<div class="day-cell empty"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const rec = state.records.find(r =>
      r.date.getFullYear() === year && r.date.getMonth() === month && r.date.getDate() === d
    );
    const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    let cls = 'day-cell';
    if (isToday) cls += ' today';
    if (rec) cls += ' has-record';
    const dot = rec ? '<span class="dot ' + rec.evaluation + '"></span>' : '';
    daysHtml += '<button type="button" class="' + cls + '" data-record-id="' + (rec ? rec.id : '') + '">' + d + dot + '</button>';
  }

  const selected = state.selectedRecord;
  let modalHtml = '';
  if (selected) {
    modalHtml = '<div id="modal-overlay" class="modal-overlay">' +
      '<div class="modal-panel">' +
        '<div class="modal-header"><h3>記録詳細</h3><button type="button" id="modal-close" class="modal-close">' + icons.x + '</button></div>' +
        '<div class="modal-image-preview">' + icons.camera + '<span>撮影イメージ</span></div>' +
        '<div class="info-block"><p class="label">日付</p><p class="value">' + selected.date.getFullYear() + '年' + (selected.date.getMonth()+1) + '月' + selected.date.getDate() + '日</p></div>' +
        '<div class="info-block"><p class="label">評価</p><div class="value-row"><span class="dot" style="background:' + evalColor(selected.evaluation) + '"></span><span>' + evalLabel(selected.evaluation) + '</span></div></div>' +
        '<div class="info-block"><p class="label">記録時刻</p><div class="value-row">' + icons.clock + ' <span>' + selected.time + (selected.isTimeModified ? ' <span class="text-destructive" style="font-size:0.8rem; margin-left:0.25rem;">(修正済)</span>' : '') + '</span></div></div>' +
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
        WEEKDAYS.map((w, i) => {
          const c = i === 0 ? 'sun' : i === 6 ? 'sat' : 'other';
          return '<div class="' + c + '">' + w + '</div>';
        }).join('') +
      '</div>' +
      '<div class="days-grid">' + daysHtml + '</div>' +
      '<div class="legend">' +
        '<div class="legend-item"><span class="dot good"></span>完全脱色</div>' +
        '<div class="legend-item"><span class="dot normal"></span>不十分</div>' +
        '<div class="legend-item"><span class="dot bad"></span>ほぼ脱色なし</div>' +
        '<div class="legend-item"><span class="dot peeled"></span>シール剥がれ</div>' +
      '</div>' +
    '</div>' + modalHtml +
    renderBottomNav('calendar') +
  '</div>';
}
