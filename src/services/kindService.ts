import { repository } from '../storage/repository';
import { getTodayString } from '../utils/date';
import type { Post, Encouragement } from '../types';

// KindCoin発行（励ましへのありがとう）
export const thankEncouragement = (
  encouragementId: string,
  postId: string
): void => {
  const encouragement = repository
    .getEncouragements()
    .find((e) => e.id === encouragementId);
  const post = repository.getPost(postId);

  if (!encouragement || !post) return;

  // ありがとうチェック
  repository.thankEncouragement(encouragementId);

  // KindCoin発行（励ました人に5コイン）
  repository.createTransaction({
    fromUserId: post.userId, // システムから
    toUserId: encouragement.userId,
    amount: 5,
    type: 'encouragement',
    relatedId: encouragementId,
  });

  // Thank You Bloom（励ました人のプロフィールに花が咲く）
  repository.createBloom({
    userId: encouragement.userId,
    fromUserId: post.userId,
    postId,
    encouragementId,
  });

  // 共感カレンダー更新
  const today = getTodayString();
  repository.incrementCalendarEntry(encouragement.userId, today);
};

// 花を贈る
export const sendFlower = (
  fromUserId: string,
  toUserId: string,
  amount: number = 10
): boolean => {
  const balance = repository.getUserBalance(fromUserId);
  if (balance < amount) {
    return false; // 残高不足
  }

  // KindCoin送金
  repository.createTransaction({
    fromUserId,
    toUserId,
    amount,
    type: 'flower',
  });

  // Thank You Bloom
  repository.createBloom({
    userId: toUserId,
    fromUserId,
  });

  // 共感カレンダー更新
  const today = getTodayString();
  repository.incrementCalendarEntry(toUserId, today);

  return true;
};

// 寄付（デモ）
export const donate = (userId: string, amount: number): boolean => {
  const balance = repository.getUserBalance(userId);
  if (balance < amount) {
    return false; // 残高不足
  }

  // システムアカウントに寄付（デモ）
  repository.createTransaction({
    fromUserId: userId,
    toUserId: 'system_donation',
    amount,
    type: 'donation',
  });

  return true;
};

