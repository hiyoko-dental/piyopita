import React from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Clock, MessageSquare, UserPlus, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

// Mock Data
const timelineEvents = [
  {
    id: 1,
    type: 'achievement',
    date: '2025/12/31',
    time: '20:15',
    content: '長谷川元洋くんが本日の装置装着時間を達成しました',
    patientId: 'P001',
    isNew: true,
  },
  {
    id: 2,
    type: 'message',
    date: '2025/12/30',
    time: '14:30',
    content: '長谷川太郎くんからメッセージを受信しました',
    patientId: 'P002',
    isNew: true,
  },
  {
    id: 3,
    type: 'registration',
    date: '2025/12/28',
    time: '09:45',
    content: '堀伊吹さんが新規登録されました',
    patientId: 'P003',
    isNew: false,
  },
  {
    id: 4,
    type: 'achievement',
    date: '2025/12/27',
    time: '19:20',
    content: '山田花子ちゃんが3日連続で目標を達成しました！',
    patientId: 'P004',
    isNew: false,
  },
  {
    id: 5,
    type: 'message',
    date: '2025/12/26',
    time: '11:00',
    content: '鈴木一郎くんから装置の不具合に関する相談があります',
    patientId: 'P005',
    isNew: false,
  },
];

export function HomePage() {
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <CheckCircle2 className="text-green-500" size={20} />;
      case 'message':
        return <MessageSquare className="text-blue-500" size={20} />;
      case 'registration':
        return <UserPlus className="text-purple-500" size={20} />;
      default:
        return <Clock className="text-slate-400" size={20} />;
    }
  };

  const handleEventClick = (event: typeof timelineEvents[0]) => {
    if (event.type === 'message') {
      navigate('/messages');
    } else {
      navigate(`/patients/${event.patientId}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">ホーム</h1>
          <p className="text-slate-500">最新のお知らせと患者の状況を確認できます</p>
        </div>
        <div className="text-sm text-slate-400 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-100">
          本日: 2026年2月21日 (土)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timeline */}
        <Card className="lg:col-span-2 border-slate-200 shadow-md">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="flex items-center gap-2">
              <Clock className="text-blue-600" size={20} />
              お知らせタイムライン
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {timelineEvents.map((event) => (
                <div 
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className={clsx(
                    "flex items-center gap-4 p-4 hover:bg-slate-50 cursor-pointer transition-colors group",
                    event.isNew && "bg-blue-50/30"
                  )}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 group-hover:border-blue-200 group-hover:bg-white transition-colors">
                    {getIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-400">
                        {event.date} {event.time}
                      </span>
                      {event.isNew && (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                      {event.content}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-400" />
                </div>
              ))}
            </div>
          </CardContent>
          <div className="p-4 border-t border-slate-100 text-center">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600">
              すべてのお知らせを見る
            </Button>
          </div>
        </Card>

        {/* Alert / Warning List */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-md h-full flex flex-col">
            <CardHeader className="bg-red-50/50 border-b border-red-100">
              <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                <AlertTriangle size={20} className="text-red-600" />
                連続未装着アラート
              </CardTitle>
              <CardDescription className="text-red-600/80">
                2日以上装着記録がない患者リスト
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto">
              {/* High Risk: 5 days or more */}
              <div className="bg-red-100 px-4 py-1.5 text-xs font-bold text-red-800 border-y border-red-200 sticky top-0 z-10">
                5日以上 (要緊急連絡)
              </div>
              <div className="divide-y divide-red-100 bg-red-50/30">
                {[
                  { id: 'P006', name: '佐藤 健太', days: 5, last: '2/16' },
                ].map((patient) => (
                  <div 
                    key={patient.id} 
                    onClick={() => navigate(`/patients/${patient.id}`)}
                    className="p-3 flex items-center justify-between hover:bg-red-100/50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-white text-red-600 flex items-center justify-center font-bold text-sm border border-red-200 shadow-sm">
                        {patient.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm group-hover:text-red-700">{patient.name}</div>
                        <div className="text-xs text-red-600/80">最終装着: {patient.last}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-200 text-red-800">
                        {patient.days}日
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Medium Risk: 3-4 days */}
              <div className="bg-orange-100 px-4 py-1.5 text-xs font-bold text-orange-800 border-y border-orange-200 sticky top-0 z-10 mt-[-1px]">
                3〜4日 (要注意)
              </div>
              <div className="divide-y divide-orange-100 bg-orange-50/30">
                {[
                  { id: 'P007', name: '高橋 美咲', days: 3, last: '2/18' },
                ].map((patient) => (
                  <div 
                    key={patient.id} 
                    onClick={() => navigate(`/patients/${patient.id}`)}
                    className="p-3 flex items-center justify-between hover:bg-orange-100/50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-white text-orange-600 flex items-center justify-center font-bold text-sm border border-orange-200 shadow-sm">
                        {patient.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm group-hover:text-orange-700">{patient.name}</div>
                        <div className="text-xs text-orange-600/80">最終装着: {patient.last}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-orange-200 text-orange-800">
                        {patient.days}日
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Low Risk: 2 days */}
              <div className="bg-yellow-100 px-4 py-1.5 text-xs font-bold text-yellow-800 border-y border-yellow-200 sticky top-0 z-10 mt-[-1px]">
                2日 (確認推奨)
              </div>
              <div className="divide-y divide-yellow-100 bg-yellow-50/30">
                {[
                  { id: 'P008', name: '山本 陸', days: 2, last: '2/19' },
                  { id: 'P009', name: '中村 陽菜', days: 2, last: '2/19' },
                  { id: 'P010', name: '小林 翔太', days: 2, last: '2/19' },
                ].map((patient) => (
                  <div 
                    key={patient.id} 
                    onClick={() => navigate(`/patients/${patient.id}`)}
                    className="p-3 flex items-center justify-between hover:bg-yellow-100/50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-white text-yellow-600 flex items-center justify-center font-bold text-sm border border-yellow-200 shadow-sm">
                        {patient.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm group-hover:text-yellow-700">{patient.name}</div>
                        <div className="text-xs text-yellow-600/80">最終装着: {patient.last}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-yellow-200 text-yellow-800">
                        {patient.days}日
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-4 border-t border-slate-100 bg-white">
              <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                対象者全員にメッセージ
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
