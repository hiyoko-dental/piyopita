import { ic } from '../lib/icons.js';
import { lsSync } from '../lib/storage.js';
import { mockPatients } from '../data/mock.js';

function renderPhotoModal(date, time, status) {
  const evalLabels = {
    good: '完全脱色',
    normal: '不十分',
    bad: 'ほぼ脱色なし',
    peeled: 'シール剥がれ'
  };
  const evalColors = {
    good: '#4A90E2',
    normal: '#FFD700',
    bad: '#FF6B6B',
    peeled: '#4CAF50'
  };
  const label = evalLabels[status] || '未記録';
  const color = evalColors[status] || '#666';

  return (
    '<div id="photo-modal" class="modal-overlay">' +
    '<div class="modal-content">' +
    '<div class="modal-header"><h2>' +
    date +
    ' の装着記録</h2></div>' +
    '<div class="modal-body">' +
    '<div class="photo-wrap" style="aspect-ratio:16/9; background:var(--muted-bg); border-radius:var(--radius); display:flex; align-items:center; justify-content:center; color:var(--muted); margin-bottom:1rem; flex-direction:column;">' +
    ic.camera +
    '<span style="margin-top:0.5rem; font-weight:500;">撮影イメージ</span>' +
    '</div>' +
    '<div class="stats-grid">' +
    '<div class="stat-box"><div class="label">記録時刻</div><div class="value">' +
    (time || '--:--') +
    '</div></div>' +
    '<div class="stat-box"><div class="label">評価</div><div class="value" style="color:' +
    color +
    '">' +
    label +
    '</div></div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>'
  );
}

export function renderPatientDetail(
  id,
  { detailYear, detailMonth, photoModalDate, photoModalTime, photoModalStatus }
) {
  let p = mockPatients.find(function (pt) {
    return pt.id === id;
  });
  if (!p) {
    p = mockPatients[0];
  }

  const year = detailYear;
  const month = detailMonth;

  const daysInMonth = new Date(year, month, 0).getDate();

  const calendarDays = [];
  const lsRecords = p.id === '1' ? lsSync.getRecords() : [];

  for (let i = 1; i <= daysInMonth; i++) {
    const dStr = year + '-' + String(month).padStart(2, '0') + '-' + String(i).padStart(2, '0');
    let status = '';
    let recTime = '';

    if (p.id === '1') {
      const rec = lsRecords.find(function (r) {
        const rd = new Date(r.date);
        return rd.getDate() === i && rd.getMonth() + 1 === month && rd.getFullYear() === year;
      });
      if (rec) {
        status = rec.evaluation;
        recTime = rec.time;
      }
    } else {
      const r = Math.random();
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

  const firstDay = new Date(year, month - 1, 1).getDay();
  let calHtml = '<div class="calendar-grid">';
  for (let j = 0; j < firstDay; j++) {
    calHtml += '<div class="calendar-day empty"></div>';
  }
  calendarDays.forEach(function (d) {
    const emptyClass = d.status === '' ? ' empty-record' : '';
    calHtml +=
      '<button type="button" class="calendar-day' +
      emptyClass +
      '" data-date="' +
      d.date +
      '" data-time="' +
      d.time +
      '" data-status="' +
      d.status +
      '"><span>' +
      d.day +
      '</span>' +
      (d.status ? '<span class="day-dot ' + d.status + '"></span>' : '') +
      '</button>';
  });
  calHtml += '</div>';

  const stats = { good: 0, normal: 0, peeled: 0, bad: 0, empty: 0 };
  calendarDays.forEach(function (d) {
    if (d.status === 'good') stats.good++;
    else if (d.status === 'normal') stats.normal++;
    else if (d.status === 'peeled') stats.peeled++;
    else if (d.status === 'bad') stats.bad++;
    else stats.empty++;
  });

  const totalDays = daysInMonth;
  const recordedDays = stats.good + stats.normal + stats.peeled + stats.bad;
  const achieveRate = Math.round((recordedDays / totalDays) * 100) || 0;

  const goodDeg = (stats.good / totalDays) * 100;
  const normalDeg = (stats.normal / totalDays) * 100;
  const peeledDeg = (stats.peeled / totalDays) * 100;
  const badDeg = (stats.bad / totalDays) * 100;

  const deg1 = goodDeg;
  const deg2 = deg1 + normalDeg;
  const deg3 = deg2 + peeledDeg;
  const deg4 = deg3 + badDeg;

  const conicGradient =
    'conic-gradient(' +
    '#4A90E2 0% ' +
    deg1 +
    '%, ' +
    '#FFD700 ' +
    deg1 +
    '% ' +
    deg2 +
    '%, ' +
    '#4CAF50 ' +
    deg2 +
    '% ' +
    deg3 +
    '%, ' +
    '#FF6B6B ' +
    deg3 +
    '% ' +
    deg4 +
    '%, ' +
    '#e2e8f0 ' +
    deg4 +
    '% 100%)';

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  const monthSelectorHtml =
    '<div style="display:flex; align-items:center; gap:0.5rem; margin-bottom: 0.5rem;">' +
    '<button type="button" class="btn btn-ghost month-nav" style="padding:0.25rem" data-y="' +
    prevYear +
    '" data-m="' +
    prevMonth +
    '">' +
    ic.chevronLeft +
    '</button>' +
    '<span style="font-weight:700; font-size:1rem; width:120px; text-align:center; white-space:nowrap;">' +
    year +
    '年' +
    month +
    '月</span>' +
    '<button type="button" class="btn btn-ghost month-nav" style="padding:0.25rem" data-y="' +
    nextYear +
    '" data-m="' +
    nextMonth +
    '">' +
    ic.chevronRight +
    '</button>' +
    '</div>';

  const pieChartHtml =
    '<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap: 1rem;">' +
    monthSelectorHtml +
    '<div style="position:relative; width:140px; height:140px; border-radius:50%; background:' +
    conicGradient +
    '; flex-shrink: 0;">' +
    '<div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:96px; height:96px; background:var(--card); border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);">' +
    '<span style="font-size:0.75rem; color:var(--muted); font-weight:500;">装着率</span>' +
    '<span style="font-size:1.5rem; font-weight:bold; color:var(--fg); line-height:1.2;">' +
    achieveRate +
    '%</span>' +
    '</div>' +
    '</div>' +
    '<div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; font-size:0.75rem; color:var(--muted); margin-top:0.5rem; width: 100%; padding: 0 1rem;">' +
    '<div style="display:flex; align-items:center; justify-content:space-between; gap:0.25rem;"><span><span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#4A90E2; margin-right:4px;"></span>完全脱色:</span> <b>' +
    stats.good +
    '日</b></div>' +
    '<div style="display:flex; align-items:center; justify-content:space-between; gap:0.25rem;"><span><span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#FFD700; margin-right:4px;"></span>不十分:</span> <b>' +
    stats.normal +
    '日</b></div>' +
    '<div style="display:flex; align-items:center; justify-content:space-between; gap:0.25rem;"><span><span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#4CAF50; margin-right:4px;"></span>剥離:</span> <b>' +
    stats.peeled +
    '日</b></div>' +
    '<div style="display:flex; align-items:center; justify-content:space-between; gap:0.25rem;"><span><span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#FF6B6B; margin-right:4px;"></span>脱色なし:</span> <b>' +
    stats.bad +
    '日</b></div>' +
    '</div>' +
    '<div style="font-size:0.75rem; color:var(--muted); text-align:center; width: 100%; border-top: 1px solid var(--border-light); padding-top:0.5rem;">未記録: ' +
    stats.empty +
    '日</div>' +
    '</div>';

  return (
    '<div class="detail-header">' +
    '<div class="back">' +
    '<button type="button" id="detail-back">' +
    ic.chevronLeft +
    '</button>' +
    '<div>' +
    '<h1>' +
    p.lastName +
    ' ' +
    p.firstName +
    ' <span class="age-badge">' +
    p.age +
    '歳</span> <span class="chart-no">カルテNo: ' +
    p.chartNo +
    '</span></h1>' +
    '<p class="last-visit">最終来院日: 2026/01/15</p>' +
    '</div>' +
    '</div>' +
    '<div class="detail-actions">' +
    '<button type="button" class="btn btn-outline" onclick="showMockToast(\'来院予約画面を開きます\')">' +
    ic.calendar +
    '来院予約</button>' +
    '<button type="button" class="btn btn-primary" onclick="showMockToast(\'変更を保存しました\')">' +
    ic.save +
    '変更を保存</button>' +
    '</div>' +
    '</div>' +
    '<div class="card device-panel" style="margin-bottom:1.5rem">' +
    '<div class="card-header" style="background:rgba(248,250,252,0.5);border-bottom:1px solid var(--border-light);padding:1rem">' +
    '<h3 class="card-title">' +
    ic.clock +
    '装置設定</h3>' +
    '</div>' +
    '<div class="card-content">' +
    '<div class="form-grid" style="grid-template-columns: 1fr 1fr 1fr auto;">' +
    '<div class="form-group"><label>使用装置</label><select>' +
    '<option' +
    (p.device === 'インビザライン' ? ' selected' : '') +
    '>インビザライン</option>' +
    '<option' +
    (p.device === '拡大床' ? ' selected' : '') +
    '>拡大床</option>' +
    '<option' +
    (p.device === 'プレオルソ' ? ' selected' : '') +
    '>プレオルソ</option>' +
    '<option' +
    (p.device === 'マイオブレース' ? ' selected' : '') +
    '>マイオブレース</option>' +
    '<option' +
    (p.device === 'ムーシールド' ? ' selected' : '') +
    '>ムーシールド</option>' +
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
    '<div class="progress-header"><span>現在の装置: ' +
    p.device +
    ' #3</span><span>1年2ヶ月 / 予定2年</span></div>' +
    '<div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:58%"></div></div>' +
    '<div class="progress-footer"><span>開始: 2024/12/01</span><span>終了予定: 2026/12/01</span></div>' +
    '</div>' +
    '<h4 style="font-size:0.875rem;font-weight:700;margin:1rem 0 0.5rem">装置履歴</h4>' +
    '<div class="history-list">' +
    '<div class="history-item current"><span class="dot red"></span><div class="body"><div class="title">' +
    p.device +
    ' #3 (現在)</div><div class="date">2026/01/15 - 現在</div></div><span class="status red">装着中</span></div>' +
    '<div class="history-item done"><span class="dot blue"></span><div class="body"><div class="title">' +
    p.device +
    ' #2</div><div class="date">2025/12/01 - 2026/01/14</div></div><span class="status blue">完了</span></div>' +
    '<div class="history-item done older"><span class="dot blue"></span><div class="body"><div class="title">' +
    p.device +
    ' #1</div><div class="date">2025/11/01 - 2025/11/30</div></div><span class="status blue">完了</span></div>' +
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
    '<h3 class="card-title">装着カレンダー (' +
    year +
    '年' +
    month +
    '月)</h3>' +
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
    (photoModalDate ? renderPhotoModal(photoModalDate, photoModalTime, photoModalStatus) : '')
  );
}

