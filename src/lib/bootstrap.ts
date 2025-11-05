import { useAppStore } from '../app/store/useAppStore';
import type { User, Post, Encouragement } from './types';
import { getTodayString } from './utils/date';

/**
 * 初回起動時にダミーデータを投入するブート処理
 */
export const bootstrapData = () => {
  const store = useAppStore.getState();

  // ユーザーを作成
  const users: User[] = [
    store.createUser({ name: 'さくら' }),
    store.createUser({ name: 'たろう' }),
    store.createUser({ name: 'みお' }),
    store.createUser({ name: 'ゆうき' }),
  ];

  // 現在のユーザーを設定（最初のユーザー）
  if (users[0]) {
    store.setCurrentUser(users[0].id);
  }

  // 投稿を作成
  const now = Date.now();
  const posts: Post[] = [
    store.createPost({
      userId: users[0].id,
      content: '今日は少し疲れました。でも、頑張って前向きにいきたいです。\n応援してくれる人がいると思うと、心が温かくなります。',
      createdAt: now - 2 * 60 * 60 * 1000, // 2時間前
    }),
    store.createPost({
      userId: users[1].id,
      content: '最近、新しいことに挑戦しています。\n最初は不安でしたが、少しずつ楽しくなってきました。\n同じように頑張っている人とつながれたら嬉しいです。',
      createdAt: now - 5 * 60 * 60 * 1000, // 5時間前
    }),
    store.createPost({
      userId: users[2].id,
      content: '誰かに優しくしてもらったことを思い出しました。\nその優しさが、今の私の支えになっています。\nありがとう、という言葉は本当に大切ですね。',
      createdAt: now - 8 * 60 * 60 * 1000, // 8時間前
    }),
    store.createPost({
      userId: users[3].id,
      content: '今日は小さな成功体験がありました。\n自分を褒めることも大切だなと感じました。\nみんなも自分の小さな努力を認めてあげてくださいね。',
      createdAt: now - 12 * 60 * 60 * 1000, // 12時間前
    }),
  ];

  // 励ましメッセージを作成
  if (posts[0] && users[1]) {
    const encouragement1 = store.createEncouragement({
      postId: posts[0].id,
      userId: users[1].id,
      content: 'お疲れさまです！前向きな気持ち、素晴らしいです。あなたの頑張りは必ず誰かの支えになっています。',
      createdAt: now - 1.5 * 60 * 60 * 1000,
    });

    // ありがとうチェックとKindCoin発行
    if (users[0]) {
      store.thankEncouragement(encouragement1.id);
      store.createTransaction({
        fromUserId: posts[0].userId,
        toUserId: users[1].id,
        amount: 5,
        type: 'encouragement',
        relatedId: encouragement1.id,
      });
      store.createBloom({
        userId: users[1].id,
        fromUserId: users[0].id,
        postId: posts[0].id,
        encouragementId: encouragement1.id,
      });
    }
  }

  if (posts[1] && users[2]) {
    store.createEncouragement({
      postId: posts[1].id,
      userId: users[2].id,
      content: '新しい挑戦、素敵です！一歩ずつ進むことが大切ですね。応援しています。',
      createdAt: now - 4 * 60 * 60 * 1000,
    });
  }

  if (posts[2] && users[0]) {
    const encouragement3 = store.createEncouragement({
      postId: posts[2].id,
      userId: users[0].id,
      content: '優しさの循環、本当に大切ですね。あなたもきっと誰かに優しさを届けています。',
      createdAt: now - 7 * 60 * 60 * 1000,
    });

    // ありがとうチェックとKindCoin発行
    if (users[2]) {
      store.thankEncouragement(encouragement3.id);
      store.createTransaction({
        fromUserId: posts[2].userId,
        toUserId: users[0].id,
        amount: 5,
        type: 'encouragement',
        relatedId: encouragement3.id,
      });
      store.createBloom({
        userId: users[0].id,
        fromUserId: users[2].id,
        postId: posts[2].id,
        encouragementId: encouragement3.id,
      });
    }
  }

  // 共感カレンダーにエントリを追加
  const today = getTodayString();
  if (users[0]) {
    store.incrementCalendarEntry(users[0].id, today);
  }
  if (users[1]) {
    store.incrementCalendarEntry(users[1].id, today);
  }

  // Kind Missionを作成
  if (users[0]) {
    store.createMission({
      userId: users[0].id,
      date: today,
      description: '誰かに優しい言葉をかける',
      completed: true,
    });
    store.createMission({
      userId: users[0].id,
      date: today,
      description: '感謝の気持ちを伝える',
      completed: false,
    });
  }

  console.log('✅ ダミーデータの投入が完了しました');
};

