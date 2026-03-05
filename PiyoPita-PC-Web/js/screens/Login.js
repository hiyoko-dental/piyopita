export function renderLogin() {
  return (
    '<div class="login-page">' +
    '<div class="login-logo">' +
    '<div class="icon">P</div>' +
    '<h1>ぴよぴた</h1>' +
    '<p>小児歯科矯正患者管理システム</p>' +
    '</div>' +
    '<div class="login-card">' +
    '<div class="login-card-header">' +
    '<h2>ログイン</h2>' +
    '<p>医院IDとパスワードを入力してください</p>' +
    '</div>' +
    '<form id="login-form">' +
    '<div class="login-card-body">' +
    '<div class="form-group"><label for="clinicId">医院ID</label><input id="clinicId" placeholder="123456" required/></div>' +
    '<div class="form-group"><label for="doctorId">歯科医師ID</label><input id="doctorId" placeholder="doctor01" required/></div>' +
    '<div class="form-group"><label for="password">パスワード</label><input id="password" type="password" required/></div>' +
    '</div>' +
    '<div class="login-card-footer">' +
    '<button type="submit" class="btn-primary">ログイン</button>' +
    '<div class="login-links">' +
    '<a href="#" onclick="showMockToast(\'アカウント追加申請フォームへ移動します\')">アカウントの追加申請</a>' +
    '<a href="#" onclick="showMockToast(\'パスワード再発行申請フォームへ移動します\')">パスワード再発行申請</a>' +
    '</div>' +
    '</div>' +
    '</form>' +
    '</div>' +
    '<footer class="login-footer">© 2026 PiyoPita System. All rights reserved.</footer>' +
    '</div>'
  );
}

