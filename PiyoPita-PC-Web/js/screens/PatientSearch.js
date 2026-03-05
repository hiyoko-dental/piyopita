import { ic } from '../lib/icons.js';
import { mockPatients } from '../data/mock.js';

export function renderPatientSearch(searchTerm, deviceFilter) {
  const filtered = mockPatients.filter(function (p) {
    const matchSearch =
      !searchTerm ||
      (p.lastName + p.firstName).indexOf(searchTerm) >= 0 ||
      p.chartNo.indexOf(searchTerm) >= 0;
    const matchDevice = !deviceFilter || p.device === deviceFilter;
    return matchSearch && matchDevice;
  });

  const rows = filtered
    .map(function (p) {
      return (
        '<tr class="interactive" data-id="' +
        p.id +
        '">' +
        '<td class="chart-no">' +
        p.chartNo +
        '</td>' +
        '<td><div class="patient-name">' +
        p.lastName +
        ' ' +
        p.firstName +
        '</div><div class="patient-kana">' +
        p.kana +
        '</div></td>' +
        '<td>' +
        p.age +
        '歳</td>' +
        '<td><span class="device-tag">' +
        p.device +
        '</span></td>' +
        '<td style="text-align:right">' +
        ic.chevronRight +
        '</td>' +
        '</tr>'
      );
    })
    .join('');

  const empty =
    filtered.length === 0
      ? '<div class="empty-state">' + ic.file + '<p>該当する患者が見つかりませんでした</p></div>'
      : '';

  return (
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">' +
    '<div><h1 class="page-title">患者検索</h1><p class="page-desc">カルテNo.や氏名から患者を検索します</p></div>' +
    '<button type="button" class="btn btn-success" onclick="showMockToast(\'新規患者登録画面を開きます\')">' +
    ic.userPlusBtn +
    '新規患者登録</button>' +
    '</div>' +
    '<div class="card search-card" style="margin-bottom:1.5rem">' +
    '<div class="card-content">' +
    '<div class="form-grid">' +
    '<div class="form-group" style="grid-column: span 2">' +
    '<label>検索ワード (氏名・カルテNo)</label>' +
    '<div class="search-wrap"><span class="icon">' +
    ic.search +
    '</span><input type="text" id="search-input" placeholder="例: 山田 / C00101" value="' +
    (searchTerm || '') +
    '"/></div>' +
    '</div>' +
    '<div class="form-group">' +
    '<label>使用装置</label>' +
    '<select id="device-filter">' +
    '<option value="">すべて</option>' +
    '<option value="インビザライン"' +
    (deviceFilter === 'インビザライン' ? ' selected' : '') +
    '>インビザライン</option>' +
    '<option value="拡大床"' +
    (deviceFilter === '拡大床' ? ' selected' : '') +
    '>拡大床</option>' +
    '<option value="プレオルソ"' +
    (deviceFilter === 'プレオルソ' ? ' selected' : '') +
    '>プレオルソ</option>' +
    '<option value="マイオブレース"' +
    (deviceFilter === 'マイオブレース' ? ' selected' : '') +
    '>マイオブレース</option>' +
    '<option value="ムーシールド"' +
    (deviceFilter === 'ムーシールド' ? ' selected' : '') +
    '>ムーシールド</option>' +
    '</select>' +
    '</div>' +
    '<button type="button" class="btn btn-primary" onclick="showMockToast(\'検索を実行しました\')">検索</button>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div class="card" style="overflow:hidden;">' +
    (empty ||
      '<table class="data-table"><thead><tr><th style="width:8rem">カルテNo.</th><th>氏名</th><th style="width:6rem">年齢</th><th>使用装置</th><th style="width:6rem">詳細</th></tr></thead><tbody>' +
        rows +
        '</tbody></table>') +
    '</div>'
  );
}

