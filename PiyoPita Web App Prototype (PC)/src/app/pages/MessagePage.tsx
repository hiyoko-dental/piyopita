import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search, Send, MoreVertical, Phone, Video } from 'lucide-react';
import { clsx } from 'clsx';

// Mock Data
const mockContacts = [
  { id: '1', name: '長谷川 太郎', lastMessage: 'ありがとうございました！', time: '14:30', unread: 2, avatar: 'HT' },
  { id: '2', name: '佐藤 健太', lastMessage: '装置が少し痛いです...', time: '昨日', unread: 0, avatar: 'SK' },
  { id: '3', name: '鈴木 一郎', lastMessage: '次回の予約について', time: '2日前', unread: 0, avatar: 'SI' },
  { id: '4', name: '田中 美咲', lastMessage: '写真送りました', time: '1週間前', unread: 0, avatar: 'TM' },
];

const mockMessages = [
  { id: 1, sender: 'doctor', text: '長谷川さん、こんにちは。装置の調子はいかがですか？', time: '14:00' },
  { id: 2, sender: 'patient', text: '先生、こんにちは！昨日から少し違和感がありますが、頑張って着けています。', time: '14:15' },
  { id: 3, sender: 'doctor', text: '素晴らしいですね。慣れるまで少し時間がかかるかもしれませんが、無理せず続けてください。痛みが強くなるようならまた連絡してください。', time: '14:20' },
  { id: 4, sender: 'patient', text: 'わかりました！ありがとうございます！', time: '14:30' },
];

export function MessagePage() {
  const [selectedContact, setSelectedContact] = useState(mockContacts[0]);
  const [messageInput, setMessageInput] = useState('');

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Left Pane: Contact List */}
      <Card className="w-80 flex flex-col border-slate-200 shadow-sm overflow-hidden bg-white">
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input placeholder="患者を検索" className="pl-9 bg-slate-50 border-slate-100 focus:bg-white" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={clsx(
                "w-full p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50",
                selectedContact.id === contact.id && "bg-blue-50/50 hover:bg-blue-50"
              )}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                  {contact.avatar}
                </div>
                {contact.unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full border-2 border-white">
                    {contact.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-slate-800 text-sm truncate">{contact.name}</span>
                  <span className="text-xs text-slate-400">{contact.time}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{contact.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Right Pane: Chat Area */}
      <Card className="flex-1 flex flex-col border-slate-200 shadow-sm overflow-hidden bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
              {selectedContact.avatar}
            </div>
            <div>
              <div className="font-bold text-slate-800">{selectedContact.name}</div>
              <div className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                オンライン
              </div>
            </div>
          </div>
          <div className="flex gap-2 text-slate-400">
            <Button variant="ghost" size="icon" className="hover:text-blue-600">
              <Phone size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="hover:text-blue-600">
              <Video size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical size={20} />
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {mockMessages.map((msg) => (
            <div
              key={msg.id}
              className={clsx(
                "flex max-w-[80%]",
                msg.sender === 'doctor' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={clsx(
                "p-4 rounded-2xl text-sm shadow-sm",
                msg.sender === 'doctor' 
                  ? "bg-blue-600 text-white rounded-br-none" 
                  : "bg-white text-slate-800 border border-slate-100 rounded-bl-none"
              )}>
                {msg.text}
              </div>
              <div className="text-xs text-slate-400 self-end mx-2 pb-1">
                {msg.time}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="flex gap-2">
            <Input 
              placeholder="メッセージを入力..." 
              className="flex-1 bg-slate-50 border-slate-200 focus:bg-white"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
              <Send size={18} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
