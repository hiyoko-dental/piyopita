import { ic } from '../lib/icons.js';
import { mockMessagesMap } from '../data/mock.js';

export function renderMessages({ contacts, selectedContactId, messages, messageInput }) {
  const contact =
    contacts.find((c) => c.id === selectedContactId) || (contacts.length > 0 ? contacts[0] : null);

  const listHtml = contacts
    .map(function (c) {
      const msgs = c.id === '1' ? messages : mockMessagesMap[c.id] || [];
      let lastMessage;
      let time;
      if (msgs.length > 0) {
        const lastMsg = msgs[msgs.length - 1];
        lastMessage = lastMsg.text;
        time = lastMsg.time;
      } else {
        lastMessage = 'メッセージはありません';
        time = '';
      }

      return (
        '<button type="button" class="contact-item' +
        (contact && c.id === contact.id ? ' active' : '') +
        '" data-id="' +
        c.id +
        '">' +
        '<div class="avatar">' +
        c.avatar +
        '</div>' +
        '<div class="body">' +
        '<div style="display:flex;justify-content:space-between;margin-bottom:0.25rem"><span class="name">' +
        c.name +
        '</span><span class="time">' +
        time +
        '</span></div>' +
        '<p class="preview">' +
        lastMessage +
        '</p>' +
        '</div>' +
        '</button>'
      );
    })
    .join('');

  const msgsToRender =
    contact && contact.id === '1' ? messages : mockMessagesMap[contact && contact.id] || [];

  const msgHtml = msgsToRender
    .map(function (m) {
      return (
        '<div class="chat-msg ' +
        m.sender +
        '">' +
        '<span class="time">' +
        m.time +
        '</span>' +
        '<div class="bubble ' +
        m.sender +
        '">' +
        m.text +
        '</div>' +
        '</div>'
      );
    })
    .join('');

  return (
    '<div class="messages-layout">' +
    '<div class="contacts-panel">' +
    '<div class="search-wrap"><span class="icon">' +
    ic.search +
    '</span><input type="text" placeholder="患者を検索"/></div>' +
    '<div class="contact-list">' +
    listHtml +
    '</div>' +
    '</div>' +
    '<div class="chat-panel">' +
    '<div class="chat-header">' +
    '<div class="user-info">' +
    (contact
      ? '<div class="avatar">' + contact.avatar + '</div><div><div class="name">' + contact.name + '</div></div>'
      : '') +
    '</div>' +
    '<div class="actions">' +
    '<button type="button" onclick="showMockToast(\'詳細メニューを開きます\')">' +
    ic.more +
    '</button>' +
    '</div>' +
    '</div>' +
    '<div class="chat-messages" id="chat-messages">' +
    msgHtml +
    '</div>' +
    '<div class="chat-input-wrap">' +
    '<div class="row">' +
    '<input type="text" placeholder="メッセージを入力..." id="message-input" value="' +
    (messageInput || '') +
    '"/>' +
    '<button type="button" class="btn-send" id="btn-send">' +
    ic.send +
    '</button>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>'
  );
}

