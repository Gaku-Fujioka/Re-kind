/**
 * 日替わりミッション生成
 * 疑似乱数と日付で安定化（同じ日は同じミッション）
 */

import type { Mission } from './types';
import { getTodayString } from './utils/date';

// ミッションのテンプレート
const missionTemplates: Omit<Mission, 'id'>[] = [
  {
    title: '3行で励まそう',
    description: '誰かの投稿に、3行以上の励ましメッセージを送ってみましょう。',
    action: 'send_encouragement',
    daily: true,
    rewardCoins: 1,
  },
  {
    title: '誰かの投稿に共感',
    description: '気持ちに共感した投稿を見つけて、共感のボタンを押してみましょう。',
    action: 'send_empathy',
    daily: true,
    rewardCoins: 1,
  },
  {
    title: 'コインを1枚使う',
    description: 'KindCoinを1枚使って、誰かに花を贈るか、寄付をしてみましょう。',
    action: 'spend_coin',
    daily: true,
    rewardCoins: 1,
  },
  {
    title: '感謝を伝える',
    description: '励ましメッセージに「ありがとう」を送って、花とコインを贈りましょう。',
    action: 'thank',
    daily: true,
    rewardCoins: 1,
  },
  {
    title: '今日の気持ちを投稿',
    description: '今の気持ちや悩みを投稿して、誰かとつながりましょう。',
    action: 'send_encouragement',
    daily: true,
    rewardCoins: 1,
  },
  {
    title: '誰かの投稿に寄り添う',
    description: '困っている人の投稿を見つけて、優しい言葉をかけましょう。',
    action: 'send_encouragement',
    daily: true,
    rewardCoins: 1,
  },
  {
    title: '優しい言葉を選ぶ',
    description: 'ネガティブな気持ちも、優しい言葉に変換して投稿してみましょう。',
    action: 'send_encouragement',
    daily: true,
    rewardCoins: 1,
  },
];

/**
 * 日付から疑似乱数を生成（同じ日付なら同じ数値を返す）
 */
const seededRandom = (seed: string): number => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash) / 2147483647; // Normalize to 0-1
};

/**
 * 配列からランダムに要素を選択（疑似乱数使用）
 */
const selectRandom = <T,>(arr: T[], seed: string, count: number): T[] => {
  const selected: T[] = [];
  const available = [...arr];
  let currentSeed = seed;

  for (let i = 0; i < Math.min(count, available.length); i++) {
    const random = seededRandom(currentSeed);
    const index = Math.floor(random * available.length);
    selected.push(available[index]);
    available.splice(index, 1);
    currentSeed = `${seed}_${i}`;
  }

  return selected;
};

/**
 * 今日のミッションを生成（1〜3件）
 */
export const generateTodayMissions = (): Mission[] => {
  const today = getTodayString();
  
  // 日付から疑似乱数を生成（1〜3の範囲）
  const missionCount = Math.floor(seededRandom(today) * 3) + 1; // 1, 2, または3
  
  // ミッションを選択
  const selected = selectRandom(
    missionTemplates,
    today,
    missionCount
  );

  // IDを付与して返す
  return selected.map((template, index) => ({
    ...template,
    id: `mission_${today}_${index}`,
  }));
};

/**
 * ミッションの読み上げテキストを生成
 */
export const getMissionReadAloudText = (mission: Mission): string => {
  return `${mission.title}。${mission.description}。完了すると、KindCoinが1枚もらえます。`;
};

