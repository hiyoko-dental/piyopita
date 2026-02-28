import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, QrCode, Scan } from 'lucide-react';

export default function QRScanScreen() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(true);

  const handleScan = () => {
    setScanning(false);
    // スキャン成功のアニメーションを少し見せてから遷移
    setTimeout(() => {
      navigate('/registration');
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black pb-safe pt-safe">
      {/* ヘッダー */}
      <div className="px-6 py-4 flex items-center absolute top-0 left-0 right-0 z-10 pt-safe">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl text-white">QRコード読み取り</h1>
      </div>

      {/* カメラビュー（シミュレーション） */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* グレー背景（カメラの代わり） */}
        <div className="absolute inset-0 bg-gray-800" />

        {/* スキャン枠 */}
        <div className="relative z-10 w-64 h-64">
          <div className="w-full h-full border-4 border-white rounded-3xl relative overflow-hidden">
            {/* コーナーマーク */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-bright-yellow rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-bright-yellow rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-bright-yellow rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-bright-yellow rounded-br-xl" />

            {/* スキャン成功表示 */}
            {!scanning && (
              <div className="absolute inset-0 bg-bright-yellow/20 flex items-center justify-center">
                <div className="bg-bright-yellow rounded-full p-4">
                  <QrCode className="w-12 h-12 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 説明テキスト */}
        <p className="mt-8 text-white text-center px-6 z-10">
          {scanning
            ? '歯科医院から受け取ったQRコードを\n枠内に合わせてください'
            : 'スキャン成功！'}
        </p>

        {/* スキャンボタン（デモ用） */}
        {scanning && (
          <button
            onClick={handleScan}
            className="mt-8 bg-bright-yellow hover:bg-bright-orange text-white p-6 rounded-full shadow-2xl transition-all active:scale-95 z-10"
          >
            <Scan className="w-8 h-8" />
          </button>
        )}
      </div>

      {/* フッター説明 */}
      <div className="px-6 py-6 text-center z-10">
        <p className="text-xs text-white/70">
          画面をタップまたはボタンを押してスキャンをシミュレートします
        </p>
      </div>
    </div>
  );
}
