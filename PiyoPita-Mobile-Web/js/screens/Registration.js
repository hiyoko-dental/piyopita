import { icons } from '../lib/icons.js';
import { state } from '../core/state.js';
import { defaultClinicInfo } from '../lib/constants.js';

export function renderRegistration() {
  const c = state.clinicInfo || defaultClinicInfo;

  let yearOptions = '<option value="">年</option>';
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 1900; y--) {
    yearOptions += '<option value="' + y + '">' + y + '年</option>';
  }
  let monthOptions = '<option value="">月</option>';
  for (let m = 1; m <= 12; m++) {
    monthOptions += '<option value="' + m + '">' + m + '月</option>';
  }
  let dayOptions = '<option value="">日</option>';
  for (let d = 1; d <= 31; d++) {
    dayOptions += '<option value="' + d + '">' + d + '日</option>';
  }

  const esc = (s) => (s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

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
        '<div class="clinic-row"><span>' + icons.building + '</span><div><p class="label">医院名</p><p class="value">' + esc(c.clinicName) + '</p></div></div>' +
        '<div class="clinic-row"><span>' + icons.user + '</span><div><p class="label">担当医</p><p class="value">' + esc(c.doctorName) + '</p></div></div>' +
      '</div>' +
      '<div class="form-group"><label>患者名 <span class="required">*</span></label><input type="text" id="reg-name" placeholder="山田 太郎" required/></div>' +
      '<div class="form-group"><label>ニックネーム <span class="optional">(任意)</span></label><input type="text" id="reg-nickname" placeholder="たろう / もっちゃん など"/><p class="hint">アプリ内で表示される名前です</p></div>' +
      '<div class="form-group">' +
        '<label>生年月日 <span class="required">*</span></label>' +
        '<div class="date-select-group">' +
          '<select id="reg-birth-year" required>' + yearOptions + '</select>' +
          '<select id="reg-birth-month" required>' + monthOptions + '</select>' +
          '<select id="reg-birth-day" required>' + dayOptions + '</select>' +
        '</div>' +
      '</div>' +
      '<div class="note-box"><p><strong>※ 登録後の変更について</strong><br/>登録後、患者名と生年月日は変更できません。ニックネームは設定画面から変更可能です。</p></div>' +
    '</form>' +
    '<div class="reg-footer"><button type="submit" form="registration-form" class="btn-primary">歯科医師と連携</button></div>' +
  '</div>';
}
