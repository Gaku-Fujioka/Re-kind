import { useAppStore } from '../../app/store/useAppStore';
import { getTodayString } from '../utils/date';

// KindCoin発行（励ましへのありがとう）
export const thankEncouragement = (
  encouragementId: string,
  postId: string
): void => {
  const store = useAppStore.getState();
  const encouragement = store.encouragements.find((e) => e.id === encouragementId);
  const post = store.getPost(postId);

  if (!encouragement || !post) return;

  // ありがとうチェック
  store.thankEncouragement(encouragementId);

  // KindCoin発行（励ました人に5コイン）
  store.createTransaction({
    fromUserId: post.userId, // システムから
    toUserId: encouragement.userId,
    amount: 5,
    type: 'encouragement',
    relatedId: encouragementId,
  });

  // Thank You Bloom（励ました人のプロフィールに花が咲く）
  store.createBloom({
    userId: encouragement.userId,
    fromUserId: post.userId,
    postId,
    encouragementId,
  });

  // 共感カレンダー更新
  const today = getTodayString();
  store.incrementCalendarEntry(encouragement.userId, today);
};

// 花を贈る
export const sendFlower = (
  fromUserId: string,
  toUserId: string,
  amount: number = 10
): boolean => {
  const store = useAppStore.getState();
  const balance = store.getUserBalance(fromUserId);
  if (balance < amount) {
    return false; // 残高不足
  }

  // KindCoin送金
  store.createTransaction({
    fromUserId,
    toUserId,
    amount,
    type: 'flower',
  });

  // Thank You Bloom
  store.createBloom({
    userId: toUserId,
    fromUserId,
  });

  // 共感カレンダー更新
  const today = getTodayString();
  store.incrementCalendarEntry(toUserId, today);

  return true;
};

// 寄付（デモ）
export const donate = (userId: string, amount: number): boolean => {
  const store = useAppStore.getState();
  const balance = store.getUserBalance(userId);
  if (balance < amount) {
    return false; // 残高不足
  }

  // システムアカウントに寄付（デモ）
  store.createTransaction({
    fromUserId: userId,
    toUserId: 'system_donation',
    amount,
    type: 'donation',
  });

  return true;
};

