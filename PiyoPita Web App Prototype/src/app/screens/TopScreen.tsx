import { useNavigate } from 'react-router';
import { Bird, Database, Mail } from 'lucide-react';

export default function TopScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-safe pt-safe">
      {/* ロゴ */}
      <div className="flex flex-col items-center my-32">
        <div className="w-32 h-32 mb-6 bg-bright-yellow rounded-full flex items-center justify-center shadow-lg">
          <Bird className="w-20 h-20 text-bright-orange" strokeWidth={2} />
        </div>
        <h1 className="text-4xl font-bold text-bright-orange mb-2">ぴよぴた</h1>
        <p className="text-sm text-muted-foreground">PiyoPita</p>
        <p className="text-xs text-center mt-2 text-foreground/70">
          歯科矯正を楽しく続けよう！
        </p>
      </div>

      {/* メインボタン */}
      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={() => navigate('/terms')}
          className="w-full bg-primary hover:bg-bright-orange text-primary-foreground py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-95"
        >
          歯科医師との連携
        </button>

        <button
          onClick={() => alert('データ引継ぎ機能は準備中です')}
          className="w-full bg-white hover:bg-secondary text-foreground py-4 px-6 rounded-2xl border-2 border-pastel-orange shadow-md transition-all active:scale-95"
        >
          データ引継ぎ
        </button>

        <button
          onClick={() => alert('お問い合わせフォームは準備中です')}
          className="w-full bg-white hover:bg-secondary text-foreground py-4 px-6 rounded-2xl border-2 border-pastel-orange shadow-md transition-all active:scale-95"
        >
          お問い合わせ
        </button>
      </div>

      {/* フッター */}
      <div className="mt-auto pt-8 text-xs text-center text-muted-foreground">
        <p>© 2026 PiyoPita. All rights reserved.</p>
      </div>
    </div>
  );
}
