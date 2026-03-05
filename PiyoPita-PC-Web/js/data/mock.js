/**
 * モックデータ（デモ用）
 */
export const mockPatients = [
  { id: '1', lastName: '山田', firstName: '太郎', kana: 'やまだ たろう', age: 8, device: 'インビザライン', chartNo: 'C00101' },
  { id: '2', lastName: '鈴木', firstName: '結衣', kana: 'すずき ゆい', age: 10, device: '拡大床', chartNo: 'C00102' },
  { id: '3', lastName: '佐藤', firstName: '大翔', kana: 'さとう ひろと', age: 7, device: 'プレオルソ', chartNo: 'C00103' },
  { id: '4', lastName: '高橋', firstName: '陽菜', kana: 'たかはし ひな', age: 9, device: 'マイオブレース', chartNo: 'C00104' },
  { id: '5', lastName: '伊藤', firstName: '湊', kana: 'いとう みなと', age: 11, device: '拡大床', chartNo: 'C00105' },
  { id: '6', lastName: '渡辺', firstName: '莉子', kana: 'わたなべ りこ', age: 8, device: 'インビザライン', chartNo: 'C00106' },
  { id: '7', lastName: '山本', firstName: '悠真', kana: 'やまもと ゆうま', age: 6, device: 'ムーシールド', chartNo: 'C00107' },
  { id: '8', lastName: '中村', firstName: '紬', kana: 'なかむら つむぎ', age: 7, device: 'インビザライン', chartNo: 'C00108' },
  { id: '9', lastName: '小林', firstName: '蒼', kana: 'こばやし あお', age: 9, device: 'プレオルソ', chartNo: 'C00109' },
  { id: '10', lastName: '加藤', firstName: '凛', kana: 'かとう りん', age: 8, device: '拡大床', chartNo: 'C00110' }
  ];

export const timelineEvents = [
  { id: 1, type: 'achievement', date: '2026/02/20', time: '20:15', content: '山田太郎くんが本日の装着記録を行いました', patientId: '1', isNew: true },
  { id: 2, type: 'message', date: '2026/02/20', time: '14:30', content: '鈴木結衣ちゃんからメッセージを受信しました', patientId: '2', isNew: true },
  { id: 3, type: 'registration', date: '2026/02/19', time: '09:45', content: '佐藤大翔くんが新規登録されました', patientId: '3', isNew: false },
  { id: 4, type: 'message', date: '2026/02/17', time: '11:00', content: '伊藤湊くんから装置の不具合に関する相談があります', patientId: '5', isNew: false }
  ];

export const alertPatients = {
  red: [{ id: '6', name: '渡辺 莉子', days: 5, last: '2/16' }],
  orange: [{ id: '7', name: '山本 悠真', days: 3, last: '2/18' }],
  yellow: [{ id: '8', name: '中村 紬', days: 2, last: '2/19' }, { id: '9', name: '小林 蒼', days: 2, last: '2/19' }, { id: '10', name: '加藤 凛', days: 2, last: '2/19' }]
  };

export const mockContacts = [
  { id: '1', name: '山田 太郎', lastMessage: '', time: '', unread: 0, avatar: 'TR' },
  { id: '2', name: '鈴木 結衣', lastMessage: '', time: '', unread: 0, avatar: 'SY' },
  { id: '5', name: '伊藤 湊', lastMessage: '', time: '', unread: 0, avatar: 'IM' },
  { id: '4', name: '高橋 陽菜', lastMessage: '', time: '', unread: 0, avatar: 'TH' }
  ];

export const mockMessagesMap = {
  '2': [
    { id: 1, sender: 'doctor', text: 'こんにちは。調子はいかがですか？', time: '14:00' },
    { id: 2, sender: 'patient', text: 'ありがとうございました！', time: '14:30' }
  ],
  '5': [
    { id: 1, sender: 'patient', text: '装置が少し痛いです...', time: '昨日' }
  ],
  '4': [
    { id: 1, sender: 'patient', text: '写真送りました', time: '1週間前' }
  ]
  };

export const initialStaff = [
  { id: 1, name: '堀幹 太郎', role: '院長', email: 'horimiki@example.com', status: 'active' },
  { id: 2, name: '佐藤 花子', role: '歯科衛生士', email: 'sato@example.com', status: 'active' },
  { id: 3, name: '鈴木 一郎', role: '受付', email: 'suzuki@example.com', status: 'inactive' }
  ];
