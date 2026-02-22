import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ChevronLeft, Save, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { clsx } from 'clsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

// Mock Data for Charts
const chartData = [
  { name: '1月', rate: 85 },
  { name: '2月', rate: 92 },
  { name: '3月', rate: 78 },
  { name: '4月', rate: 95 },
  { name: '5月', rate: 88 },
  { name: '6月', rate: 90 },
];

// Mock Data for Calendar
const calendarDays = Array.from({ length: 30 }, (_, i) => {
  const status = Math.random();
  let color = 'bg-slate-200'; // Default
  if (status > 0.8) color = 'bg-blue-500'; // Good
  else if (status > 0.6) color = 'bg-green-500'; // Excellent
  else if (status > 0.3) color = 'bg-yellow-400'; // Fair
  else color = 'bg-red-500'; // Poor

  return { day: i + 1, status: color, date: `2026-02-${String(i+1).padStart(2, '0')}` };
});

export function PatientDetailPage() {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setIsPhotoModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header / Basic Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100" onClick={() => window.history.back()}>
            <ChevronLeft size={24} className="text-slate-500" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800">長谷川 元洋</h1>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">8歳</span>
              <span className="text-slate-400 text-sm">カルテNo: C00101</span>
            </div>
            <p className="text-slate-500 text-sm">最終来院日: 2025/12/15</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <CalendarIcon size={16} />
            来院予約
          </Button>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Save size={16} />
            変更を保存
          </Button>
        </div>
      </div>

      {/* Device Settings Panel */}
      <Card className="border-slate-200 shadow-sm bg-white">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
          <CardTitle className="text-base font-bold text-slate-700 flex items-center gap-2">
            <Clock size={18} className="text-blue-500" />
            装置設定
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">使用装置</label>
              <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                <option>インビザライン</option>
                <option>拡大床</option>
                <option>プレオルソ</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">使用開始日</label>
              <Input type="date" defaultValue="2025-01-15" />
            </div>
            <Button variant="secondary" className="w-full text-slate-600 bg-slate-100 hover:bg-slate-200">
              設定を反映 (アプリへ送信)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Bar & History */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>治療進捗状況</CardTitle>
            <CardDescription>現在の装置の装着期間と全体の進捗</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-slate-700">
                <span>現在の装置: インビザライン #3</span>
                <span>1年2ヶ月 / 予定2年</span>
              </div>
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[58%] rounded-full relative">
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50"></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>開始: 2024/12/01</span>
                <span>終了予定: 2026/12/01</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-700">装置履歴</h4>
              <div className="space-y-2">
                <div className="flex items-center p-3 bg-red-50 rounded-lg border border-red-100">
                  <span className="w-3 h-3 rounded-full bg-red-500 mr-3"></span>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-800">インビザライン #3 (現在)</div>
                    <div className="text-xs text-slate-500">2026/01/15 - 現在</div>
                  </div>
                  <span className="text-sm font-bold text-red-600">装着中</span>
                </div>
                <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100 opacity-70">
                  <span className="w-3 h-3 rounded-full bg-blue-500 mr-3"></span>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-800">インビザライン #2</div>
                    <div className="text-xs text-slate-500">2025/12/01 - 2026/01/14</div>
                  </div>
                  <span className="text-sm font-bold text-blue-600">完了</span>
                </div>
                 <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100 opacity-50">
                  <span className="w-3 h-3 rounded-full bg-blue-500 mr-3"></span>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-800">インビザライン #1</div>
                    <div className="text-xs text-slate-500">2025/11/01 - 2025/11/30</div>
                  </div>
                  <span className="text-sm font-bold text-blue-600">完了</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evaluation Chart */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>装着達成率</CardTitle>
            <CardDescription>月ごとの目標達成日数割合</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{fontSize: 12}} stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12}} stroke="#94a3b8" axisLine={false} tickLine={false} unit="%" />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.rate > 90 ? '#3b82f6' : entry.rate > 80 ? '#22c55e' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Section */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>装着カレンダー (2026年2月)</CardTitle>
            <div className="flex gap-4 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500"></span>完璧</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500"></span>良好</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-400"></span>注意</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span>未達</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm text-slate-400 font-medium">
            <div>日</div><div>月</div><div>火</div><div>水</div><div>木</div><div>金</div><div>土</div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for start of month */}
            <div className="aspect-square bg-slate-50 rounded-lg"></div>
            <div className="aspect-square bg-slate-50 rounded-lg"></div>
            
            {calendarDays.map((day) => (
              <button
                key={day.day}
                onClick={() => handleDateClick(day.date)}
                className="aspect-square relative rounded-lg border border-slate-100 hover:border-blue-300 transition-all group flex flex-col items-center justify-center gap-1 bg-white hover:shadow-md"
              >
                <span className="text-xs font-semibold text-slate-600 group-hover:text-blue-600">{day.day}</span>
                <span className={clsx("w-3 h-3 rounded-full", day.status)}></span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Photo Modal */}
      <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedDate} の装着記録</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
             <div className="aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center relative">
               <img 
                 src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&h=400&fit=crop" 
                 alt="Mouth Scan" 
                 className="object-cover w-full h-full"
               />
               <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                 撮影時刻: 20:15
               </div>
             </div>
             <div className="grid grid-cols-2 gap-4 text-sm">
               <div className="bg-slate-50 p-3 rounded-lg">
                 <div className="text-slate-500 text-xs">装着時間</div>
                 <div className="font-bold text-slate-800 text-lg">12h 30m</div>
               </div>
               <div className="bg-slate-50 p-3 rounded-lg">
                 <div className="text-slate-500 text-xs">評価</div>
                 <div className="font-bold text-blue-600 text-lg">Good!</div>
               </div>
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
