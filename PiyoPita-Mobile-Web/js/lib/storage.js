/**
 * LocalStorage 同期（モバイル・PC間で記録・メッセージを共有）
 */
export const lsSync = {
  getRecords() {
    return JSON.parse(localStorage.getItem('piyopita_records') || '[]');
  },
  saveRecords(records) {
    localStorage.setItem('piyopita_records', JSON.stringify(records));
  },
  getMessages() {
    let msgs = localStorage.getItem('piyopita_messages');
    if (!msgs) {
      msgs = [{ id: 1, sender: 'doctor', text: 'こんにちは。装置の調子はいかがですか？', time: '14:00' }];
      localStorage.setItem('piyopita_messages', JSON.stringify(msgs));
      return msgs;
    }
    return JSON.parse(msgs);
  },
  saveMessages(msgs) {
    localStorage.setItem('piyopita_messages', JSON.stringify(msgs));
  }
};
