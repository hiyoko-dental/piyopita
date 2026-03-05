import { icons } from '../lib/icons.js';

export function renderRecordConfirm(evaluation) {
  evaluation = evaluation || 'good';
  const now = new Date();
  const dateStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
  const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
  const displayDateStr = now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日 ';

  const evalInfos = { good: { color: '#4A90E2', label: '完全脱色', icon: '✨' }, normal: { color: '#FFD700', label: '不十分', icon: '⏱️' }, peeled: { color: '#4CAF50', label: 'シール剥がれ', icon: '⚠️' }, bad: { color: '#FF6B6B', label: 'ほぼ脱色なし', icon: '❌' } };
  const info = evalInfos[evaluation] || evalInfos.good;

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
      '<div class="eval-card">' +
        '<div class="time-edit-row">' +
          '<p class="label" style="margin:0">撮影日時</p>' +
          '<button type="button" class="link" id="datetime-edit-toggle">' + icons.clock + ' 日時を修正</button>' +
        '</div>' +
        '<div id="datetime-edit-block" class="hidden" style="margin-bottom:0.75rem; display:flex; gap:0.5rem;">' +
          '<input type="date" id="record-date-input" style="flex:1;" />' +
          '<input type="time" id="record-time-input" style="width:auto;" />' +
        '</div>' +
        '<p id="datetime-display" class="value" data-original-date="' + dateStr + '" data-original-time="' + timeStr + '">' +
          '<span id="display-date">' + displayDateStr + '</span>' +
          '<span id="display-time">' + timeStr + '</span>' +
          '<span id="datetime-modified-span" class="hidden text-destructive" style="font-size:0.8rem; margin-left:0.5rem;">(修正済)</span>' +
        '</p>' +
      '</div>' +
      (evaluation === 'peeled' ? '<div class="peeled-note"><p><strong>シール剥がれについて</strong><br/>次回来院時に歯科医師にお伝えください。新しいシールを貼り直す必要があります。</p></div>' : '') +
    '</div>' +
    '<div class="confirm-actions">' +
      '<button type="button" class="btn-primary" id="confirm-save">' + icons.check + ' 決定</button>' +
      '<button type="button" class="btn-outline" data-nav="record-qr">再撮影</button>' +
    '</div>' +
  '</div>';
}
