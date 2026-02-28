import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Clock } from 'lucide-react';
import { useAppContext, EvaluationType, Record } from '../context/AppContext';
import BottomNav from '../components/BottomNav';

const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export default function CalendarScreen() {
  const { patientInfo, records } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 17)); // 2026年2月17日
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getEvaluationColor = (evaluation: EvaluationType) => {
    switch (evaluation) {
      case 'good':
        return 'bg-[#4A90E2]';
      case 'normal':
        return 'bg-[#FFD700]';
      case 'bad':
        return 'bg-[#FF6B6B]';
      case 'peeled':
        return 'bg-[#4CAF50]';
    }
  };

  const getEvaluationLabel = (evaluation: EvaluationType) => {
    switch (evaluation) {
      case 'good':
        return '完全脱色';
      case 'normal':
        return '装着中';
      case 'bad':
        return '未実施';
      case 'peeled':
        return 'シール剥がれ';
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // 前月の空白
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    // 日付
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const record = records.find(
        (r) =>
          r.date.getFullYear() === year &&
          r.date.getMonth() === month &&
          r.date.getDate() === day
      );
      const isToday = 
        date.getDate() === new Date(2026, 1, 17).getDate() &&
        date.getMonth() === new Date(2026, 1, 17).getMonth() &&
        date.getFullYear() === new Date(2026, 1, 17).getFullYear();

      days.push(
        <button
          key={day}
          onClick={() => record && setSelectedRecord(record)}
          className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all ${
            isToday
              ? 'bg-pastel-orange ring-2 ring-primary'
              : record
              ? 'hover:bg-secondary'
              : 'hover:bg-muted/30'
          }`}
        >
          <span className={`text-sm ${isToday ? 'font-bold text-primary' : 'text-foreground'}`}>
            {day}
          </span>
          {record && (
            <div
              className={`w-2 h-2 rounded-full mt-1 ${getEvaluationColor(record.evaluation)}`}
            />
          )}
        </button>
      );
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pb-24 pt-safe">
      {/* ヘッダー */}
      <div className="px-6 py-4 bg-gradient-to-br from-pastel-yellow to-pastel-orange">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-sm text-foreground/70 mr-2">▼</span>
            <span className="font-bold text-lg">
              {patientInfo?.nickname || 'ゲスト'}
            </span>
          </div>
        </div>

        {/* 月切り替え */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold">
            {year}年 {MONTHS[month]}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* カレンダー */}
      <div className="px-6 py-6">
        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {WEEKDAYS.map((day, index) => (
            <div
              key={day}
              className={`text-center text-sm font-medium ${
                index === 0 ? 'text-destructive' : index === 6 ? 'text-[#4A90E2]' : 'text-foreground/70'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 日付グリッド */}
        <div className="grid grid-cols-7 gap-2">
          {renderCalendar()}
        </div>

        {/* 凡例 */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#4A90E2] mr-2" />
            <span className="text-xs">完全脱色</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#FFD700] mr-2" />
            <span className="text-xs">装着中</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#FF6B6B] mr-2" />
            <span className="text-xs">未実施</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#4CAF50] mr-2" />
            <span className="text-xs">シール剥がれ</span>
          </div>
        </div>
      </div>

      {/* 記録詳細モーダル */}
      {selectedRecord && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end justify-center z-40 pb-safe"
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="bg-white rounded-t-3xl w-full max-w-lg p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">記録詳細</h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-2 hover:bg-muted rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-muted rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-1">日付</p>
                <p className="font-medium">
                  {selectedRecord.date.getFullYear()}年
                  {selectedRecord.date.getMonth() + 1}月
                  {selectedRecord.date.getDate()}日
                </p>
              </div>

              <div className="bg-muted rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-1">評価</p>
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full mr-2 ${getEvaluationColor(
                      selectedRecord.evaluation
                    )}`}
                  />
                  <p className="font-medium">{getEvaluationLabel(selectedRecord.evaluation)}</p>
                </div>
              </div>

              <div className="bg-muted rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-1">記録時刻</p>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-foreground/70" />
                  <p className="font-medium">
                    {selectedRecord.time}
                    {selectedRecord.isTimeModified && (
                      <span className="text-xs text-muted-foreground ml-2">(修正済)</span>
                    )}
                  </p>
                </div>
              </div>

              {selectedRecord.imageUrl && (
                <div className="bg-muted rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-2">写真</p>
                  <img
                    src={selectedRecord.imageUrl}
                    alt="記録写真"
                    className="w-full rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
