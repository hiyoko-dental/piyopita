import { icons } from '../lib/icons.js';
import { state } from '../core/state.js';
import { renderBottomNav } from './BottomNav.js';

export function renderGame(routeState) {
  const newRecord = routeState.newRecord === '1';
  const consecutiveDays = state.records.filter(r => r.evaluation === 'good').length;
  const totalRecords = state.records.length;
  const level = Math.floor(totalRecords / 5) + 1;
  const progress = Math.min((consecutiveDays / 30) * 100, 100);

  return '<div class="screen game-screen">' +
    '<div class="game-header"><h1>ぴよぴたゲーム</h1></div>' +
    '<div class="game-content">' +
      (newRecord ? '<div class="new-record-banner">' +
        '<div class="title-row">' + icons.sparkles + '<span>記録完了！</span>' + icons.sparkles + '</div>' +
        '<p>今日もがんばったね！ ひよこが喜んでるよ 🐣</p></div>' : '') +
      '<div class="game-character">' +
        '<div class="circle">' + icons.bird.replace('width="24" height="24"','width="128" height="128"') + '</div>' +
        '<div class="level-badge"><span class="lv">Lv.</span><span class="num">' + level + '</span></div>' +
      '</div>' +
      '<div class="game-stats">' +
        '<div class="game-stat-card">' +
          '<div class="row"><div class="left">' + icons.star + '<span>連続記録</span></div><span class="right">' + consecutiveDays + '日</span></div>' +
          '<div class="progress-bar"><div class="progress-fill" style="width:' + progress + '%"></div></div>' +
          '<p class="progress-hint">次の目標: 30日</p>' +
        '</div>' +
        '<div class="game-stat-card">' +
          '<div class="row"><div class="left">' + icons.award.replace('<svg ', '<svg class="primary" ') + '<span>総記録回数</span></div><span class="right">' + totalRecords + '回</span></div>' +
        '</div>' +
        '<div class="game-stat-card">' +
          '<h3>' + icons.sparkles + ' 獲得バッジ</h3>' +
          '<div class="badges-grid">' +
            (totalRecords >= 1 ? '<div class="badge-item"><span class="emoji">🌟</span><span>はじめの一歩</span></div>' : '') +
            (consecutiveDays >= 3 ? '<div class="badge-item"><span class="emoji">🔥</span><span>3日連続</span></div>' : '') +
            (totalRecords >= 10 ? '<div class="badge-item"><span class="emoji">🏆</span><span>10回達成</span></div>' : '<div class="badge-item locked"><span class="emoji">🔒</span><span>未獲得</span></div>') +
          '</div>' +
        '</div>' +
      '</div>' +
      '<p class="game-message">' + (consecutiveDays >= 7 ? '素晴らしい！この調子で続けよう！ 💪' : '毎日コツコツ記録して、ひよこを育てよう！ 🌱') + '</p>' +
    '</div>' +
    renderBottomNav('game') +
  '</div>';
}
