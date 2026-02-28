import { useNavigate } from 'react-router';
import { ArrowLeft, AlertCircle, Camera } from 'lucide-react';

export default function DeviceInfoScreen() {
  const navigate = useNavigate();

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
        <h1 className="text-xl">使用装置について</h1>
      </div>

      {/* コンテンツ */}
      <div className="flex-1 px-6 py-6 space-y-6">
        {/* 装置名 */}
        <div className="bg-gradient-to-br from-pastel-yellow to-pastel-orange rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-2">バイオネータ</h2>
          <p className="text-center text-sm text-foreground/70">Bionator</p>
        </div>

        {/* 装置写真 */}
        <div className="bg-white rounded-2xl p-4 border-2 border-pastel-orange shadow-md">
          <p className="text-sm text-muted-foreground mb-3">装置の写真</p>
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl aspect-video flex items-center justify-center">
            <Camera className="w-12 h-12 text-muted-foreground" />
            <p className="ml-2 text-muted-foreground">装置画像</p>
          </div>
        </div>

        {/* 歯科医師からの注意点 */}
        <div className="bg-white rounded-2xl p-6 border-2 border-pastel-orange shadow-md">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-5 h-5 text-primary mr-2" />
            <h3 className="font-bold">歯科医師からの注意点</h3>
          </div>
          
          <div className="space-y-4 text-sm leading-relaxed">
            <div>
              <p className="font-medium mb-2">◆ 装着方法</p>
              <p className="text-foreground/80 pl-4">
                下顎の前歯にプラスチックが食い込むように装着してください。
                正しく装着できているか、鏡で確認しましょう。
              </p>
            </div>

            <div>
              <p className="font-medium mb-2">◆ 使用時間</p>
              <p className="text-foreground/80 pl-4">
                1日12時間以上の装着を目標にしてください。
                就寝時の装着が効果的です。
              </p>
            </div>

            <div>
              <p className="font-medium mb-2">◆ お手入れ方法</p>
              <p className="text-foreground/80 pl-4">
                使用後は必ず水洗いし、専用ケースに保管してください。
                週に1回は専用洗浄剤で洗浄しましょう。
              </p>
            </div>

            <div>
              <p className="font-medium mb-2">◆ 注意事項</p>
              <p className="text-foreground/80 pl-4">
                • 装着したまま飲食しないでください<br />
                • 熱湯での洗浄は変形の原因になります<br />
                • 紛失・破損した場合はすぐにご連絡ください
              </p>
            </div>
          </div>
        </div>

        {/* シールについて */}
        <div className="bg-[#4CAF50]/10 border-2 border-[#4CAF50] rounded-xl p-4">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-5 h-5 text-[#4CAF50] mr-2" />
            <h3 className="font-bold text-[#4CAF50]">装置シールについて</h3>
          </div>
          <p className="text-sm text-foreground/80">
            装置に貼られているシールは、装着状況を確認するための
            特殊なシールです。シールが剥がれた場合は、
            記録時に「シールが剥がれた」ボタンを押してください。
          </p>
        </div>

        {/* 医院情報 */}
        <div className="bg-white rounded-2xl p-6 border-2 border-pastel-orange shadow-md">
          <h3 className="font-bold mb-3">ご不明な点は医院までお問い合わせください</h3>
          <div className="space-y-2 text-sm">
            <div className="flex">
              <span className="text-muted-foreground w-20">医院名</span>
              <span className="font-medium">ほりみき歯科</span>
            </div>
            <div className="flex">
              <span className="text-muted-foreground w-20">担当医</span>
              <span className="font-medium">堀 美喜</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
