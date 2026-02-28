import { useLocation } from 'react-router';
import { Bird, Star, Award, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import BottomNav from '../components/BottomNav';

export default function GameScreen() {
  const location = useLocation();
  const { records } = useAppContext();
  const newRecord = location.state?.newRecord;

  // 連続記録日数を計算（簡易版）
  const consecutiveDays = records.filter((r) => r.evaluation === 'good').length;
  const totalRecords = records.length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pastel-yellow to-pastel-orange pb-24 pt-safe">
      {/* ヘッダー */}
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold text-center">ぴよぴたゲーム</h1>
      </div>

      {/* コンテンツ */}
      <div className="flex-1 px-6 py-6 flex flex-col items-center">
        {/* 新規記録の祝福メッセージ */}
        {newRecord && (
          <div className="w-full max-w-md bg-white rounded-2xl p-6 mb-6 shadow-lg animate-bounce">
            <div className="flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-bright-yellow mr-2" />
              <p className="text-lg font-bold text-primary">記録完了！</p>
              <Sparkles className="w-6 h-6 text-bright-yellow ml-2" />
            </div>
            <p className="text-center text-sm text-foreground/70">
              今日もがんばったね！ ひよこが喜んでるよ 🐣
            </p>
          </div>
        )}

        {/* ひよこキャラクター */}
        <div className="relative mb-8">
          <div className="w-48 h-48 bg-bright-yellow rounded-full flex items-center justify-center shadow-2xl">
            <Bird className="w-32 h-32 text-bright-orange" strokeWidth={2} />
          </div>
          
          {/* レベル表示 */}
          <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg border-4 border-white">
            <div className="text-center">
              <p className="text-xs">Lv.</p>
              <p className="text-xl font-bold">{Math.floor(totalRecords / 5) + 1}</p>
            </div>
          </div>
        </div>

        {/* ステータス */}
        <div className="w-full max-w-md space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Star className="w-6 h-6 text-bright-yellow mr-2" />
                <span className="font-medium">連続記録</span>
              </div>
              <span className="text-2xl font-bold text-primary">{consecutiveDays}日</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-bright-yellow to-bright-orange h-full transition-all duration-500"
                style={{ width: `${Math.min((consecutiveDays / 30) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-right">
              次の目標: 30日
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Award className="w-6 h-6 text-primary mr-2" />
                <span className="font-medium">総記録回数</span>
              </div>
              <span className="text-2xl font-bold text-primary">{totalRecords}回</span>
            </div>
          </div>

          {/* 達成バッジ */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-medium mb-4 flex items-center">
              <Sparkles className="w-5 h-5 text-bright-yellow mr-2" />
              獲得バッジ
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {totalRecords >= 1 && (
                <div className="flex flex-col items-center p-3 bg-pastel-yellow rounded-xl">
                  <span className="text-3xl mb-1">🌟</span>
                  <span className="text-xs text-center">はじめの一歩</span>
                </div>
              )}
              {consecutiveDays >= 3 && (
                <div className="flex flex-col items-center p-3 bg-pastel-yellow rounded-xl">
                  <span className="text-3xl mb-1">🔥</span>
                  <span className="text-xs text-center">3日連続</span>
                </div>
              )}
              {totalRecords >= 10 && (
                <div className="flex flex-col items-center p-3 bg-pastel-yellow rounded-xl">
                  <span className="text-3xl mb-1">🏆</span>
                  <span className="text-xs text-center">10回達成</span>
                </div>
              )}
              {totalRecords < 10 && (
                <div className="flex flex-col items-center p-3 bg-muted/30 rounded-xl opacity-50">
                  <span className="text-3xl mb-1">🔒</span>
                  <span className="text-xs text-center">未獲得</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 励ましメッセージ */}
        <div className="mt-8 text-center">
          <p className="text-foreground/80 font-medium">
            {consecutiveDays >= 7
              ? '素晴らしい！この調子で続けよう！ 💪'
              : '毎日コツコツ記録して、ひよこを育てよう！ 🌱'}
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
