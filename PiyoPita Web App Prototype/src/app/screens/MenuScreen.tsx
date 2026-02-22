import { useNavigate } from 'react-router';
import {
  User,
  Stethoscope,
  HelpCircle,
  Bell,
  LogOut,
  ChevronRight,
  Bird,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import BottomNav from '../components/BottomNav';

export default function MenuScreen() {
  const navigate = useNavigate();
  const { patientInfo } = useAppContext();

  const menuItems = [
    {
      icon: User,
      label: 'アカウント設定',
      description: 'プロフィール・ニックネーム変更',
      action: () => alert('アカウント設定画面は準備中です'),
    },
    {
      icon: Stethoscope,
      label: '使用装置について',
      description: '装置の使い方・注意点',
      action: () => navigate('/device-info'),
    },
    {
      icon: HelpCircle,
      label: 'ヘルプ',
      description: '使い方・よくある質問',
      action: () => alert('ヘルプ画面は準備中です'),
    },
    {
      icon: Bell,
      label: 'お知らせ',
      description: '新機能・更新情報',
      action: () => alert('お知らせ画面は準備中です'),
    },
  ];

  const handleLogout = () => {
    if (confirm('ログアウトしますか？')) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pb-24 pt-safe">
      {/* ヘッダー */}
      <div className="px-6 py-6 bg-gradient-to-br from-pastel-yellow to-pastel-orange">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-bright-yellow rounded-full flex items-center justify-center mr-4 shadow-lg">
            <Bird className="w-10 h-10 text-bright-orange" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{patientInfo?.nickname || 'ゲスト'}</h1>
            <p className="text-sm text-foreground/70">
              {patientInfo?.clinicName || '未登録'}
            </p>
          </div>
        </div>
      </div>

      {/* メニューリスト */}
      <div className="flex-1 px-6 py-6 space-y-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={item.action}
              className="w-full bg-white hover:bg-secondary rounded-2xl p-4 flex items-center justify-between border-2 border-pastel-orange shadow-sm transition-all active:scale-98"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-pastel-yellow rounded-xl flex items-center justify-center mr-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          );
        })}

        {/* ログアウトボタン */}
        <button
          onClick={handleLogout}
          className="w-full bg-white hover:bg-destructive/10 rounded-2xl p-4 flex items-center justify-between border-2 border-destructive/30 shadow-sm transition-all active:scale-98 mt-6"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center mr-4">
              <LogOut className="w-6 h-6 text-destructive" />
            </div>
            <div className="text-left">
              <p className="font-medium text-destructive">ログアウト</p>
              <p className="text-xs text-muted-foreground">アプリからログアウトします</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-destructive/70" />
        </button>
      </div>

      {/* アプリ情報 */}
      <div className="px-6 py-4 text-center">
        <p className="text-xs text-muted-foreground mb-1">ぴよぴた (PiyoPita)</p>
        <p className="text-xs text-muted-foreground">Version 1.0.0</p>
        <p className="text-xs text-muted-foreground mt-2">© 2026 PiyoPita. All rights reserved.</p>
      </div>

      <BottomNav />
    </div>
  );
}
