import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function TermsScreen() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background pb-safe pt-safe">
      {/* ヘッダー */}
      <div className="px-6 py-4 flex items-center border-b border-border">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 p-2 hover:bg-secondary rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl">利用規約の確認</h1>
      </div>

      {/* コンテンツ */}
      <div className="flex-1 px-6 py-6 space-y-4">
        <p className="text-sm text-foreground/80">
          ぴよぴたをご利用いただくには、以下の規約への同意が必要です。
        </p>

        {/* 利用規約リンク */}
        <button
          onClick={() => alert('利用規約の詳細ページを開きます')}
          className="w-full bg-white border-2 border-pastel-orange rounded-xl p-4 flex items-center justify-between hover:bg-secondary transition-colors"
        >
          <span className="font-medium">利用規約</span>
          <ExternalLink className="w-5 h-5 text-primary" />
        </button>

        {/* プライバシーポリシーリンク */}
        <button
          onClick={() => alert('プライバシーポリシーの詳細ページを開きます')}
          className="w-full bg-white border-2 border-pastel-orange rounded-xl p-4 flex items-center justify-between hover:bg-secondary transition-colors"
        >
          <span className="font-medium">プライバシーポリシー</span>
          <ExternalLink className="w-5 h-5 text-primary" />
        </button>

        {/* 同意チェックボックス */}
        <div className="mt-8 bg-white rounded-xl p-4 border-2 border-pastel-orange">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-2 border-primary text-primary focus:ring-primary accent-primary"
            />
            <span className="text-sm">
              利用規約およびプライバシーポリシーを確認し、同意します
            </span>
          </label>
        </div>

        {/* 注意事項 */}
        <div className="mt-6 bg-pastel-yellow/30 rounded-xl p-4">
          <p className="text-xs text-foreground/70">
            <strong>※ 注意事項</strong>
            <br />
            この連携により、歯科医師があなたの装置装着記録を確認できるようになります。
          </p>
        </div>
      </div>

      {/* 連携開始ボタン */}
      <div className="px-6 py-4 border-t border-border bg-white">
        <button
          onClick={() => navigate('/qr-scan')}
          disabled={!agreed}
          className={`w-full py-4 px-6 rounded-2xl shadow-lg transition-all ${
            agreed
              ? 'bg-primary text-primary-foreground hover:bg-bright-orange active:scale-95'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          {agreed ? '歯科医師と連携開始' : '同意してください'}
        </button>
      </div>
    </div>
  );
}
