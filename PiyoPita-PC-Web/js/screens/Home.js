import { ic } from '../lib/icons.js';
import { getEventIcon } from '../lib/utils.js';
import { timelineEvents, alertPatients } from '../data/mock.js';

export function renderHome() {
  const eventsHtml = timelineEvents
    .map(function (ev) {
      const icon = getEventIcon(ev.type);
      return (
        '<div class="timeline-item' +
        (ev.isNew ? ' new' : '') +
        '" data-patient="' +
        ev.patientId +
        '" data-type="' +
        ev.type +
        '">' +
        '<div class="icon-wrap">' +
        icon +
        '</div>' +
        '<div class="body">' +
        '<div class="meta">' +
        ev.date +
        ' ' +
        ev.time +
        (ev.isNew ? '<span class="new-badge">NEW</span>' : '') +
        '</div>' +
        '<p class="content">' +
        ev.content +
        '</p>' +
        '</div>' +
        '<span class="arrow">' +
        ic.chevronRight +
        '</span>' +
        '</div>'
      );
    })
    .join('');

  let alertHtml = '';
  ['red', 'orange', 'yellow'].forEach(function (level) {
    const label =
      level === 'red' ? '5日以上 (要緊急連絡)' : level === 'orange' ? '3〜4日 (要注意)' : '2日 (確認推奨)';
    const list = alertPatients[level];
    alertHtml +=
      '<div class="alert-section">' +
      '<div class="section-label ' +
      level +
      '">' +
      label +
      '</div>' +
      list
        .map(function (p) {
          return (
            '<div class="alert-row ' +
            level +
            '" data-id="' +
            p.id +
            '">' +
            '<div class="left">' +
            '<div class="avatar">' +
            p.name[0] +
            '</div>' +
            '<div><div class="name">' +
            p.name +
            '</div><div class="last">最終装着: ' +
            p.last +
            '</div></div>' +
            '</div>' +
            '<span class="days ' +
            level +
            '">' +
            p.days +
            '日</span>' +
            '</div>'
          );
        })
        .join('') +
      '</div>';
  });

  return (
    '<div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem">' +
    '<div><h1 class="page-title">ホーム</h1><p class="page-desc">最新のお知らせと患者の状況を確認できます</p></div>' +
    '<div class="date-badge">本日: 2026年2月21日 (土)</div>' +
    '</div>' +
    '<div class="home-grid">' +
    '<div class="card" style="grid-column: span 2">' +
    '<div class="card-header"><h3 class="card-title">' +
    ic.clock +
    'お知らせタイムライン</h3></div>' +
    '<div class="card-content" style="padding:0">' +
    eventsHtml +
    '</div>' +
    '<div class="card-footer" style="text-align:center">' +
    '<button type="button" class="btn btn-ghost" onclick="showMockToast(\'すべてのお知らせ一覧を開きます\')">すべてのお知らせを見る</button>' +
    '</div>' +
    '</div>' +
    '<div class="card">' +
    '<div class="card-header danger">' +
    '<h3 class="card-title danger">' +
    ic.alert +
    '連続未装着アラート</h3>' +
    '<p class="card-description danger">2日以上装着記録がない患者リスト</p>' +
    '</div>' +
    '<div class="card-content" style="padding:0;flex:1;overflow-y:auto">' +
    alertHtml +
    '</div>' +
    '</div>' +
    '</div>'
  );
}

