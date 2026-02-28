import { useNavigate, useLocation } from 'react-router';
import { QrCode, Calendar, Gamepad2, Menu } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/record-qr', icon: QrCode, label: 'QR' },
    { path: '/calendar', icon: Calendar, label: 'CALENDAR' },
    { path: '/game', icon: Gamepad2, label: 'GAME' },
    { path: '/menu', icon: Menu, label: 'MENU' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border pb-safe z-50 shadow-lg">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary bg-pastel-yellow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
