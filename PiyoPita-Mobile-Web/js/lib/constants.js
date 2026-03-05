/**
 * 定数・評価ラベル（カレンダー・記録・PC連携で共通）
 */
export const MONTHS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
export const WEEKDAYS = ['日','月','火','水','木','金','土'];

export function evalColor(e) {
  return { good: '#4A90E2', normal: '#FFD700', bad: '#FF6B6B', peeled: '#4CAF50' }[e] || '#666';
}

export function evalLabel(e) {
  return { good: '完全脱色', normal: '不十分', bad: 'ほぼ脱色なし', peeled: 'シール剥がれ' }[e] || '';
}

export const defaultClinicInfo = { clinicId: '', doctorId: '', clinicName: 'ほりみき歯科', doctorName: '堀 美喜' };

export const dummyDB = {
  clinics: {
    '123456': 'ほりみき歯科',
    '987654': 'ぴよぴた小児歯科'
  },
  doctors: {
    'doctor01': '堀 美喜',
    'doctor02': '山田 太郎'
  }
};
