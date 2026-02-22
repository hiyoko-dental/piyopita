import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '../components/ui/card';
import { ArrowRight, Lock } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, perform authentication here
    sessionStorage.setItem('isAuthenticated', 'true');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg">
          P
        </div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">ぴよぴた</h1>
        <p className="text-slate-500 mt-2">小児歯科矯正患者管理システム</p>
      </div>

      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-slate-800">ログイン</CardTitle>
          <CardDescription className="text-center">
            医院IDとパスワードを入力してください
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="clinicId" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                医院ID
              </label>
              <Input id="clinicId" placeholder="123456" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="doctorId" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                歯科医師ID
              </label>
              <Input id="doctorId" placeholder="doctor01" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                パスワード
              </label>
              <Input id="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full gap-2 text-lg h-12">
              <Lock size={18} />
              ログイン
              <ArrowRight size={18} />
            </Button>
            
            <div className="flex justify-between w-full text-sm text-blue-600">
              <a href="#" className="hover:underline">アカウントの追加申請</a>
              <a href="#" className="hover:underline">パスワード再発行申請</a>
            </div>
          </CardFooter>
        </form>
      </Card>
      
      <footer className="mt-8 text-slate-400 text-sm">
        © 2026 PiyoPita System. All rights reserved.
      </footer>
    </div>
  );
}
