import { icons } from '../lib/icons.js';
import { state } from '../core/state.js';
import { defaultClinicInfo } from '../lib/constants.js';

export function renderManualClinic(routeState) {
  const c = state.clinicInfo || defaultClinicInfo;
  const backNav = (routeState && routeState.from === 'registration') ? 'registration' : 'qr-scan';
  const submitLabel = backNav === 'registration' ? '反映して患者情報の登録に戻る' : '患者情報の登録へ進む';
  const backAttr = 'data-back';

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
