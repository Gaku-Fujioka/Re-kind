/**
 * デモ用シードデータ
 * 審査用のワンクリック体験を提供するための初期データ
 * 
 * シナリオ:
 * - A: 投稿者（悩みを投稿）
 * - B: 励ます人（Aに励ましを送る）
 * - C: 見る人（観察者）
 * 
 * フロー:
 * 1. Aが投稿（悩み/夜さみしい）
 * 2. BがAに励ましを送る
 * 3. Aが「ありがとう」を押す → Bのプロフィールに花とコイン1枚
 * 4. Bがコインを寄付 → カレンダーに反映
 */

import { localDB } from './storage/LocalDB';
import { getTodayString } from './utils/date';
import type { User, Post, Encouragement, KindCoin, Bloom } from './types';

/**
 * デモ用シードデータを投入
 * 既にデータがある場合はスキップ
 */
export function seedDemoData(): void {
  const data = localDB.get();
  if (data.users.length > 0 || data.posts.length > 0) {
    console.log('📦 Database already has data, skipping seed');
    return;
  }

  const now = new Date().toISOString();
  const today = getTodayString();

  // ユーザーを作成
  // A: 投稿者
  const userAId = localDB.generateUserId();
  const userA: User = {
    id: userAId,
    name: 'やさしい手 #A001',
    bio: '最近、夜がさみしく感じることがあります。',
    avatarSeed: 'seed_a',
    garden: [],
    wallet: [],
    missions: {
      today,
      completedIds: [],
    },
    calendar: {
      byDate: {},
      streak: 0,
    },
  };

  // B: 励ます人
  const userBId = localDB.generateUserId();
  const userB: User = {
    id: userBId,
    name: 'やさしい手 #B002',
    bio: 'みんなの優しさを広げたいです。',
    avatarSeed: 'seed_b',
    garden: [],
    wallet: [],
    missions: {
      today,
      completedIds: [],
    },
    calendar: {
      byDate: {},
      streak: 0,
    },
  };

  // C: 見る人
  const userCId = localDB.generateUserId();
  const userC: User = {
    id: userCId,
    name: 'やさしい手 #C003',
    bio: '優しさの循環を見守っています。',
    avatarSeed: 'seed_c',
    garden: [],
    wallet: [],
    missions: {
      today,
      completedIds: [],
    },
    calendar: {
      byDate: {},
      streak: 0,
    },
  };

  localDB.saveUser(userA);
  localDB.saveUser(userB);
  localDB.saveUser(userC);

  // 投稿を作成
  // 投稿1: Aの悩み（夜さみしい）
  const post1Id = localDB.generatePostId();
  const post1: Post = {
    id: post1Id,
    authorId: userAId,
    text: '最近、夜がさみしく感じることがあります。\n仕事から帰って、一人で過ごす時間が長くなると、なんだか心が重くなってしまいます。\nでも、こうして気持ちを共有できる場所があることが、少し安心です。',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3時間前
    encouragements: [],
    isResolved: false,
  };

  // 投稿2: Aの悩み（別の投稿）
  const post2Id = localDB.generatePostId();
  const post2: Post = {
    id: post2Id,
    authorId: userAId,
    text: '今日は少し疲れました。\nでも、頑張って前向きにいきたいです。\n応援してくれる人がいると思うと、心が温かくなります。',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1時間前
    encouragements: [],
    isResolved: false,
  };

  localDB.savePost(post1);
  localDB.savePost(post2);

  // BがAに励ましを送る
  const encouragementId = localDB.generateMessageId();
  const encouragement: Encouragement = {
    id: encouragementId,
    postId: post1Id,
    fromUserId: userBId,
    toUserId: userAId,
    text: '夜がさみしい気持ち、よくわかります。\n一人でいる時間も、実は誰かがあなたのことを思っているかもしれません。\n今日も一日、お疲れさまでした。あなたの存在は、きっと誰かの支えになっています。',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2時間前
    thanked: false, // まだ「ありがとう」されていない状態
  };

  localDB.saveEncouragement(post1Id, encouragement);

  // カレンダーに記録
  // Aのカレンダーに記録（投稿）
  localDB.logCalendarAction(userAId, 'daisy');

  // Bのカレンダーに記録（励まし）
  localDB.logCalendarAction(userBId, 'tulip');

  console.log('✅ デモ用シードデータの投入が完了しました');
  console.log('📝 ユーザー情報:');
  console.log(`   A (投稿者): ${userAId} - ${userA.name}`);
  console.log(`   B (励ます人): ${userBId} - ${userB.name}`);
  console.log(`   C (見る人): ${userCId} - ${userC.name}`);
  console.log('');
  console.log('🎯 デモシナリオ（ユーザーが操作可能）:');
  console.log('   1. Aが2件の投稿を作成（悩み/夜さみしい）✅ 完了');
  console.log('   2. BがAに励ましを送信 ✅ 完了（感謝待ち状態）');
  console.log('   3. 👉 Aが「ありがとう」を押す → Bのプロフィールに花とコイン1枚');
  console.log('   4. 👉 Bがコインを寄付 → カレンダーに反映');
}

/**
 * デモデータをリセット（既存データを削除して再シード）
 */
export function resetDemoData(): void {
  localDB.clear();
  seedDemoData();
}

