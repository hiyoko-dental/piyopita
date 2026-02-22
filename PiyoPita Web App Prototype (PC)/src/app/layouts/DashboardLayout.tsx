import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Bell, 
  MessageCircle, 
  QrCode, 
  Edit, 
  Search, 
  Menu
} from 'lucide-react';
import { clsx } from 'clsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';

export function DashboardLayout() {
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'ホーム', icon: LayoutDashboard, path: '/' },
    { label: '患者検索', icon: Users, path: '/patients' },
    { label: '設定', icon: Settings, path: '/settings' },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            P
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">ぴよぴた</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium",
                  isActive 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                )}
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
          >
            <LogOut size={20} />
            ログアウト
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">医院名:</span>
            <span className="font-bold text-slate-800">ほりみき矯正歯科医院様</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 text-slate-600 border-slate-200 hover:bg-slate-50"
                onClick={() => setIsQrModalOpen(true)}
              >
                <QrCode size={16} />
                <span className="hidden sm:inline">歯科医院情報QR</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 text-slate-600 border-slate-200 hover:bg-slate-50"
              >
                <Edit size={16} />
                <span className="hidden sm:inline">情報編集</span>
              </Button>
            </div>

            <div className="h-6 w-px bg-slate-200 mx-1"></div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 text-slate-500 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <button 
                onClick={() => navigate('/messages')}
                className="relative p-2 text-slate-500 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
              >
                <MessageCircle size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
            
            <div className="ml-2 w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
               <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop" alt="Doctor" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-slate-50 p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* QR Code Modal */}
      <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-slate-800">歯科医院情報QRコード</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6 space-y-6">
            <div className="bg-white p-4 rounded-xl border-2 border-slate-100 shadow-sm">
              {/* Dummy QR Code */}
              <div className="w-48 h-48 bg-slate-800 flex items-center justify-center text-white text-xs rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-0.5 opacity-20">
                  {[...Array(36)].map((_, i) => (
                    <div key={i} className={`bg-white ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
                  ))}
                </div>
                <QrCode size={64} className="relative z-10" />
              </div>
            </div>
            <p className="text-center text-slate-500 text-sm">
              患者用アプリ「ぴよぴた」でこのQRコードを読み取ると、<br/>医院情報が自動的に連携されます。
            </p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg shadow-md transition-all">
              画像をダウンロード
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
