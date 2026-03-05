import { icons } from '../lib/icons.js';
import { state } from '../core/state.js';

export function renderMessages() {
  const msgHtml = state.messages.map(m =>
    '<div class="chat-msg ' + m.sender + '"><div class="chat-bubble">' + m.text + '</div><div class="chat-time">' + m.time + '</div></div>'
  ).join('');

  return '<div class="screen messages-screen">' +
    '<header class="header">' +
      '<button class="btn-icon" data-nav="menu">' + icons.arrowLeft + '</button>' +
      '<h1>メッセージ</h1>' +
    '</header>' +
    '<div class="chat-area" id="chat-area">' + msgHtml + '</div>' +
    '<div class="chat-input-area">' +
      '<input type="text" id="chat-input" placeholder="メッセージを入力..."/>' +
      '<button id="chat-send">' + icons.send + '</button>' +
    '</div>' +
  '</div>';
}
