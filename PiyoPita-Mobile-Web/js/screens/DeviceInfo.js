import { icons } from '../lib/icons.js';

export function renderDeviceInfo() {
  return '<div class="screen">' +
    '<header class="header">' +
      '<button type="button" class="btn-icon" data-back>' + icons.arrowLeft + '</button>' +
      '<h1>使用装置について</h1>' +
    '</header>' +
    '<div class="device-content">' +
      '<div class="device-title-card"><h2>バイオネータ</h2><p>Bionator</p></div>' +
      '<div class="device-section"><p class="text-muted" style="margin:0 0 0.75rem">装置の写真</p><div class="photo-placeholder">' + icons.camera + '装置画像</div></div>' +
      '<div class="device-section">' +
        '<div class="section-title">' + icons.alertCircle + '<h3>歯科医師からの注意点</h3></div>' +
        '<div class="item"><p class="item-title">◆ 装着方法</p><p class="item-body">下顎の前歯にプラスチックが食い込むように装着してください。正しく装着できているか、鏡で確認しましょう。</p></div>' +
        '<div class="item"><p class="item-title">◆ 使用時間</p><p class="item-body">1日12時間以上の装着を目標にしてください。就寝時の装着が効果的です。</p></div>' +
        '<div class="item"><p class="item-title">◆ お手入れ方法</p><p class="item-body">使用後は必ず水洗いし、専用ケースに保管してください。週に1回は専用洗浄剤で洗浄しましょう。</p></div>' +
        '<div class="item"><p class="item-title">◆ 注意事項</p><p class="item-body">• 装着したまま飲食しないでください<br/>• 熱湯での洗浄は変形の原因になります<br/>• 紛失・破損した場合はすぐにご連絡ください</p></div>' +
      '</div>' +
      '<div class="device-section green">' +
        '<div class="section-title">' + icons.alertCircle + '<h3>装置シールについて</h3></div>' +
        '<p class="item-body">装置に貼られているシールは、装着状況を確認するための特殊なシールです。シールが剥がれた場合は、記録時に「シールが剥がれた」ボタンを押してください。</p>' +
      '</div>' +
      '<div class="device-section"><h3>ご不明な点は医院までお問い合わせください</h3><div class="item"><p class="item-body"><span class="text-muted">医院名</span> ほりみき歯科</p><p class="item-body"><span class="text-muted">担当医</span> 堀 美喜</p></div></div>' +
    '</div>' +
  '</div>';
}
