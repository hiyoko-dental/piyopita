/**
 * 共通ユーティリティ
 */

import { ic } from './icons.js';

export function getEventIcon(type) {
  if (type === 'achievement') return ic.check;
  if (type === 'message') return ic.messageSq;
  if (type === 'registration') return ic.userPlus;
  return ic.clock;
}

export function evalLabel(status) {
  return (
    {
      good: '完全脱色',
      normal: '不十分',
      bad: 'ほぼ脱色なし',
      peeled: 'シール剥がれ'
    }[status] || '未記録'
  );
}

export function evalColor(status) {
  return (
    {
      good: '#4A90E2',
      normal: '#FFD700',
      bad: '#FF6B6B',
      peeled: '#4CAF50'
    }[status] || '#666'
  );
}

