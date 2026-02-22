import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Building2, UserCircle2, Calendar, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function RegistrationScreen() {
  const navigate = useNavigate();
  const { setPatientInfo } = useAppContext();
  
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    birthDate: '',
  });

  // モックの医院情報
  const clinicInfo = {
    clinicName: 'ほりみき歯科',
    doctorName: '堀 美喜',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.birthDate) {
      alert('必須項目を入力してください');
      return;
    }

    setPatientInfo({
      name: formData.name,
      nickname: formData.nickname || formData.name,
      birthDate: new Date(formData.birthDate),
      clinicName: clinicInfo.clinicName,
      doctorName: clinicInfo.doctorName,
    });

    navigate('/calendar');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pb-safe pt-safe">
      {/* ヘッダー */}
      <div className="px-6 py-4 flex items-center border-b border-border">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 p-2 hover:bg-secondary rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl">患者情報の登録</h1>
      </div>

      {/* コンテンツ */}
      <form onSubmit={handleSubmit} className="flex-1 px-6 py-6 space-y-6">
        {/* 医院情報表示 */}
        <div className="bg-gradient-to-br from-pastel-yellow to-pastel-orange rounded-2xl p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <Sparkles className="w-5 h-5 text-bright-orange mr-2" />
            <span className="text-sm font-medium text-bright-orange">連携先</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <Building2 className="w-5 h-5 text-foreground/70 mr-3" />
              <div>
                <p className="text-xs text-foreground/60">医院名</p>
                <p className="font-medium">{clinicInfo.clinicName}</p>
              </div>
            </div>
            <div className="flex items-center">
              <UserCircle2 className="w-5 h-5 text-foreground/70 mr-3" />
              <div>
                <p className="text-xs text-foreground/60">担当医</p>
                <p className="font-medium">{clinicInfo.doctorName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 患者情報入力 */}
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">
              患者名 <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="山田 太郎"
              className="w-full px-4 py-3 bg-input-background border-2 border-pastel-orange rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              ニックネーム <span className="text-xs text-muted-foreground">(任意)</span>
            </label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              placeholder="たろう / もっちゃん など"
              className="w-full px-4 py-3 bg-input-background border-2 border-pastel-orange rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              アプリ内で表示される名前です
            </p>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              生年月日 <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-input-background border-2 border-pastel-orange rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
        </div>

        {/* 注意事項 */}
        <div className="bg-pastel-yellow/30 rounded-xl p-4">
          <p className="text-xs text-foreground/70">
            <strong>※ 登録後の変更について</strong>
            <br />
            登録後、患者名と生年月日は変更できません。
            ニックネームは設定画面から変更可能です。
          </p>
        </div>
      </form>

      {/* 登録ボタン */}
      <div className="px-6 py-4 border-t border-border bg-white">
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-primary hover:bg-bright-orange text-primary-foreground py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-95"
        >
          歯科医師と連携
        </button>
      </div>
    </div>
  );
}
