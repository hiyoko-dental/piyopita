import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Save, 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';

// モックデータ: スタッフ一覧
const initialStaff = [
  { id: 1, name: '堀幹 太郎', role: '院長', email: 'horimiki@example.com', status: 'active' },
  { id: 2, name: '佐藤 花子', role: '歯科衛生士', email: 'sato@example.com', status: 'active' },
  { id: 3, name: '鈴木 一郎', role: '受付', email: 'suzuki@example.com', status: 'inactive' },
];

export function SettingsPage() {
  const [staffList, setStaffList] = useState(initialStaff);
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    // 保存処理のシミュレーション
    setTimeout(() => {
      setLoading(false);
      toast.success('設定を保存しました');
    }, 1000);
  };

  const handleDeleteStaff = (id: number) => {
    if (window.confirm('このスタッフを削除してもよろしいですか？')) {
      setStaffList(staffList.filter(staff => staff.id !== id));
      toast.success('スタッフを削除しました');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">設定</h1>
          <p className="text-slate-500 text-sm mt-1">医院情報やアカウント設定を管理します</p>
        </div>
        <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
          <Save className="mr-2 h-4 w-4" />
          {loading ? '保存中...' : '変更を保存'}
        </Button>
      </div>

      <Tabs defaultValue="clinic" className="space-y-6">
        <TabsList className="bg-white p-1 border border-slate-200 shadow-sm w-full sm:w-auto grid grid-cols-3 sm:inline-flex h-auto">
          <TabsTrigger value="clinic" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 py-2.5">
            <Building2 className="mr-2 h-4 w-4" />
            医院情報
          </TabsTrigger>
          <TabsTrigger value="account" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 py-2.5">
            <User className="mr-2 h-4 w-4" />
            アカウント
          </TabsTrigger>
          <TabsTrigger value="staff" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 py-2.5">
            <Shield className="mr-2 h-4 w-4" />
            スタッフ管理
          </TabsTrigger>
        </TabsList>

        {/* 医院情報タブ */}
        <TabsContent value="clinic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">基本情報</CardTitle>
                <CardDescription>医院の基本的な情報を設定します</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clinic-name">医院名</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input id="clinic-name" defaultValue="ほりみき矯正歯科医院" className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">住所</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input id="address" defaultValue="東京都渋谷区神南1-1-1" className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">電話番号</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input id="phone" defaultValue="03-1234-5678" className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">代表メールアドレス</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input id="email" defaultValue="info@horimiki-dental.com" className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">診療時間・休診日</CardTitle>
                <CardDescription>アプリ上で患者に表示される診療時間です</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>平日診療時間</Label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input defaultValue="10:00" className="pl-10" />
                    </div>
                    <span className="text-slate-400">～</span>
                    <div className="relative flex-1">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input defaultValue="19:00" className="pl-10" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>土日祝診療時間</Label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input defaultValue="10:00" className="pl-10" />
                    </div>
                    <span className="text-slate-400">～</span>
                    <div className="relative flex-1">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input defaultValue="17:00" className="pl-10" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>休診日</Label>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {['月', '火', '水', '木', '金', '土', '日', '祝'].map((day) => (
                      <div key={day} className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
                        <Switch id={`day-${day}`} defaultChecked={day === '木' || day === '祝'} />
                        <Label htmlFor={`day-${day}`} className="cursor-pointer">{day}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* アカウントタブ */}
        <TabsContent value="account" className="space-y-6">
          <Card className="border-slate-200 shadow-sm max-w-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">ログイン情報</CardTitle>
              <CardDescription>管理画面へのログインに使用する情報です</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-id">ログインID</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input id="login-id" defaultValue="admin_horimiki" className="pl-10 bg-slate-50" readOnly />
                </div>
                <p className="text-xs text-slate-400">※ログインIDの変更はサポートへお問い合わせください</p>
              </div>
              
              <div className="space-y-2 pt-2">
                <Label htmlFor="current-password">現在のパスワード</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input id="current-password" type="password" className="pl-10" placeholder="••••••••" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">新しいパスワード</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input id="new-password" type="password" className="pl-10" placeholder="新しいパスワード" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">パスワード確認</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input id="confirm-password" type="password" className="pl-10" placeholder="もう一度入力" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t border-slate-100 flex justify-end p-4">
              <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">パスワードを変更</Button>
            </CardFooter>
          </Card>

          <Card className="border-slate-200 shadow-sm max-w-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">通知設定</CardTitle>
              <CardDescription>システムからの通知を受け取る条件を設定します</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">新着メッセージ通知</Label>
                  <p className="text-sm text-slate-500">患者からのメッセージを受信した際に通知します</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">予約リクエスト通知</Label>
                  <p className="text-sm text-slate-500">新しい予約や変更リクエストがあった際に通知します</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">システムからのお知らせ</Label>
                  <p className="text-sm text-slate-500">メンテナンス情報など重要なお知らせを通知します</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* スタッフ管理タブ */}
        <TabsContent value="staff" className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800">スタッフ一覧</CardTitle>
                <CardDescription>管理画面にアクセスできるスタッフを管理します</CardDescription>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                スタッフ追加
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>氏名</TableHead>
                    <TableHead>役割</TableHead>
                    <TableHead>メールアドレス</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffList.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">{staff.name}</TableCell>
                      <TableCell>{staff.role}</TableCell>
                      <TableCell>{staff.email}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={staff.status === 'active' ? 'default' : 'secondary'}
                          className={staff.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}
                        >
                          {staff.status === 'active' ? '有効' : '無効'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-500 hover:text-red-600"
                          onClick={() => handleDeleteStaff(staff.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
