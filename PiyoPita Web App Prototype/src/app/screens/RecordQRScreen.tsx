import { useState } from 'react';
import { useNavigate } from 'react-router';
import { X, Scan, AlertCircle } from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function RecordQRScreen() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(true);

  const handleScan = () => {
    setScanning(false);
    setTimeout(() => {
      navigate('/record-confirm', { state: { evaluation: 'good' } });
    }, 500);
  };

  const handlePeeled = () => {
    navigate('/record-confirm', { state: { evaluation: 'peeled' } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-black pb-24 pt-safe">
      {/* ヘッダー */}
      <div className="px-6 py-4 flex items-center justify-between absolute top-0 left-0 right-0 z-10 pt-safe">
        <h1 className="text-xl text-white">記録する</h1>
        <button
          onClick={() => navigate('/calendar')}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* カメラビュー（シミュレーション） */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* グレー背景（カメラの代わり） */}
        <div className="absolute inset-0 bg-gray-800" />

        {/* スキャン枠 */}
        <div className="relative z-10 w-72 h-72">
          <div className="w-full h-full border-4 border-white rounded-3xl relative overflow-hidden">
            {/* コーナーマーク */}
            <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-bright-yellow rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-bright-yellow rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-bright-yellow rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-bright-yellow rounded-br-2xl" />

            {/* スキャン成功表示 */}
            {!scanning && (
              <div className="absolute inset-0 bg-bright-yellow/30 flex items-center justify-center">
                <div className="bg-bright-yellow rounded-full p-6 animate-pulse">
                  <Scan className="w-16 h-16 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 説明テキスト */}
        <p className="mt-8 text-white text-center px-6 z-10 leading-relaxed">
          {scanning
            ? '装置のQRコードを\n枠内に合わせてください'
            : 'スキャン成功！'}
        </p>

        {/* スキャンボタン（デモ用） */}
        {scanning && (
          <button
            onClick={handleScan}
            className="mt-8 bg-bright-yellow hover:bg-bright-orange text-white py-4 px-8 rounded-full shadow-2xl transition-all active:scale-95 z-10 font-medium"
          >
            撮影する
          </button>
        )}

        {/* シール剥がれボタン */}
        <button
          onClick={handlePeeled}
          className="absolute bottom-3 right-5 bg-[#4CAF50] hover:bg-[#45a049] text-white py-3 px-6 rounded-full shadow-lg transition-all active:scale-95 z-10 flex items-center"
        >
          <AlertCircle className="w-5 h-5 mr-2" />
          シールが剥がれた？
        </button>
      </div>

      <BottomNav />
    </div>
  );
}