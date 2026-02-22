import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search, ChevronRight, UserPlus, FileText } from 'lucide-react';

const mockPatients = [
  { id: '1', lastName: '長谷川', firstName: '元洋', age: 8, device: 'インビザライン', chartNo: 'C00101', status: '良好' },
  { id: '2', lastName: '長谷川', firstName: '太郎', age: 10, device: '拡大床', chartNo: 'C00102', status: '注意' },
  { id: '3', lastName: '堀', firstName: '伊吹', age: 7, device: 'プレオルソ', chartNo: 'C00103', status: '新規' },
  { id: '4', lastName: '山田', firstName: '花子', age: 9, device: 'マイオブレース', chartNo: 'C00104', status: '良好' },
  { id: '5', lastName: '佐藤', firstName: '健太', age: 11, device: '拡大床', chartNo: 'C00105', status: '警告' },
  { id: '6', lastName: '高橋', firstName: '美咲', age: 8, device: 'インビザライン', chartNo: 'C00106', status: '注意' },
  { id: '7', lastName: '伊藤', firstName: '翼', age: 6, device: 'ムーシールド', chartNo: 'C00107', status: '良好' },
];

export function PatientSearchPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('');

  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = 
      patient.lastName.includes(searchTerm) || 
      patient.firstName.includes(searchTerm) ||
      patient.chartNo.includes(searchTerm);
    const matchesDevice = deviceFilter ? patient.device === deviceFilter : true;
    return matchesSearch && matchesDevice;
  });

  const handleRowClick = (id: string) => {
    navigate(`/patients/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">患者検索</h1>
          <p className="text-slate-500">カルテNo.や氏名から患者を検索します</p>
        </div>
        <Button className="gap-2 bg-green-600 hover:bg-green-700 shadow-md">
          <UserPlus size={18} />
          新規患者登録
        </Button>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-700">検索ワード (氏名・カルテNo)</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input 
                  placeholder="例: 長谷川 / C00101" 
                  className="pl-10" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">使用装置</label>
              <select 
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                value={deviceFilter}
                onChange={(e) => setDeviceFilter(e.target.value)}
              >
                <option value="">すべて</option>
                <option value="インビザライン">インビザライン</option>
                <option value="拡大床">拡大床</option>
                <option value="プレオルソ">プレオルソ</option>
                <option value="マイオブレース">マイオブレース</option>
                <option value="ムーシールド">ムーシールド</option>
              </select>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold">
              検索
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold">
            <tr>
              <th className="p-4 w-32">カルテNo.</th>
              <th className="p-4">氏名</th>
              <th className="p-4 w-24">年齢</th>
              <th className="p-4">使用装置</th>
              <th className="p-4 w-32">状態</th>
              <th className="p-4 w-24">詳細</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPatients.map((patient) => (
              <tr 
                key={patient.id} 
                onClick={() => handleRowClick(patient.id)}
                className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
              >
                <td className="p-4 font-mono text-slate-500">{patient.chartNo}</td>
                <td className="p-4">
                  <div className="font-bold text-slate-800">{patient.lastName} {patient.firstName}</div>
                  <div className="text-xs text-slate-400">はせがわ もとひろ</div>
                </td>
                <td className="p-4">{patient.age}歳</td>
                <td className="p-4">
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                    {patient.device}
                  </span>
                </td>
                <td className="p-4">
                  {patient.status === '良好' && (
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">良好</span>
                  )}
                  {patient.status === '注意' && (
                    <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">注意</span>
                  )}
                  {patient.status === '警告' && (
                    <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">警告</span>
                  )}
                  {patient.status === '新規' && (
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">新規</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPatients.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            <FileText size={48} className="mx-auto mb-4 opacity-20" />
            <p>該当する患者が見つかりませんでした</p>
          </div>
        )}
      </div>
    </div>
  );
}
