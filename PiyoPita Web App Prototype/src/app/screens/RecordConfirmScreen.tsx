import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft, Clock, Camera, Check } from 'lucide-react';
import { useAppContext, EvaluationType } from '../context/AppContext';

export default function RecordConfirmScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addRecord } = useAppContext();
  
  const evaluation = (location.state?.evaluation as EvaluationType) || 'good';
  
  const now = new Date();
  const [recordDate] = useState(now);
  const [recordTime, setRecordTime] = useState(
    `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  );
  const [isTimeModified, setIsTimeModified] = useState(false);
  const [showTimeEdit, setShowTimeEdit] = useState(false);

  const getEvaluationInfo = (evaluationType: EvaluationType) => {
    switch (evaluationType) {
      case 'good':
        return { color: 'bg-[#4A90E2]', label: '完全脱色', icon: '✨' };
      case 'normal':
        return { color: 'bg-[#FFD700]', label: '装着中', icon: '⏱️' };
      case 'peeled':
        return { color: 'bg-[#4CAF50]', label: 'シール剥がれ', icon: '⚠️' };
      default:
        return { color: 'bg-[#FF6B6B]', label: '未実施', icon: '❌' };
    }
  };

  const evalInfo = getEvaluationInfo(evaluation);

  const handleTimeChange = (newTime: string) => {
    setRecordTime(newTime);
    setIsTimeModified(true);
  };

  const handleSave = () => {
    const newRecord = {
      id: Date.now().toString(),
      date: recordDate,
      evaluation,
      time: recordTime,
      isTimeModified,
    };

    addRecord(newRecord);
    navigate('/game', { state: { newRecord: true } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pb-safe pt-safe">
      {/* ヘッダー */}
      <div className="px-6 py-4 flex items-center border-b border-border">
        <button
          onClick={() => navigate('/record-qr')}
          className="mr-3 p-2 hover:bg-secondary rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl">記録の確認</h1>
      </div>

      {/* コンテンツ */}
      <div className="flex-1 px-6 py-6 space-y-6">
        {/* 写真プレビュー */}
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl aspect-video flex items-center justify-center overflow-hidden">
          <Camera className="w-16 h-16 text-muted-foreground" />
          <p className="ml-3 text-muted-foreground">撮影イメージ</p>
        </div>

        {/* 評価 */}
        <div className="bg-white rounded-2xl p-6 border-2 border-pastel-orange shadow-md">
          <p className="text-sm text-muted-foreground mb-2">評価</p>
          <div className="flex items-center">
            <div className={`w-6 h-6 rounded-full ${evalInfo.color} mr-3`} />
            <span className="text-2xl mr-2">{evalInfo.icon}</span>
            <span className="text-xl font-bold">{evalInfo.label}</span>
          </div>
        </div>

        {/* 日時情報 */}
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-6 border-2 border-pastel-orange shadow-md">
            <p className="text-sm text-muted-foreground mb-2">撮影日</p>
            <p className="text-lg font-medium">
              {recordDate.getFullYear()}年{recordDate.getMonth() + 1}月{recordDate.getDate()}日
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-pastel-orange shadow-md">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">撮影時刻</p>
              <button
                onClick={() => setShowTimeEdit(!showTimeEdit)}
                className="flex items-center text-xs text-primary hover:text-bright-orange transition-colors"
              >
                <Clock className="w-4 h-4 mr-1" />
                {showTimeEdit ? '閉じる' : '時刻を修正'}
              </button>
            </div>
            
            {showTimeEdit ? (
              <div className="flex items-center space-x-2">
                <input
                  type="time"
                  value={recordTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="flex-1 px-4 py-2 bg-input-background border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            ) : (
              <p className="text-lg font-medium">
                {recordTime}
                {isTimeModified && (
                  <span className="text-sm text-muted-foreground ml-2">(修正済)</span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* 注意事項 */}
        {evaluation === 'peeled' && (
          <div className="bg-[#4CAF50]/10 border-2 border-[#4CAF50] rounded-xl p-4">
            <p className="text-sm">
              <strong className="text-[#4CAF50]">シール剥がれについて</strong>
              <br />
              次回来院時に歯科医師にお伝えください。
              新しいシールを貼り直す必要があります。
            </p>
          </div>
        )}
      </div>

      {/* ボタン */}
      <div className="px-6 py-4 border-t border-border bg-white space-y-3">
        <button
          onClick={handleSave}
          className="w-full bg-primary hover:bg-bright-orange text-primary-foreground py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center"
        >
          <Check className="w-5 h-5 mr-2" />
          決定
        </button>
        <button
          onClick={() => navigate('/record-qr')}
          className="w-full bg-white hover:bg-secondary text-foreground py-3 px-6 rounded-2xl border-2 border-pastel-orange transition-all active:scale-95"
        >
          再撮影
        </button>
      </div>
    </div>
  );
}