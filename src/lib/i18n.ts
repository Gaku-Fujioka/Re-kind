/**
 * 国際化（i18n）文字列辞書
 * MVPでは日本語固定だが、将来英語対応などに差し替え可能な構造
 */

export type Locale = 'ja' | 'en';

// 現在のロケール（MVPでは日本語固定）
const currentLocale: Locale = 'ja';

// 文字列辞書
const translations: Record<Locale, TranslationDict> = {
  ja: {
    // 共通
    common: {
      submit: '送信',
      cancel: 'キャンセル',
      close: '閉じる',
      delete: '削除',
      edit: '編集',
      save: '保存',
      loading: '読み込み中...',
      error: 'エラー',
      success: '成功',
      login: 'ログイン',
      logout: 'ログアウト',
      pleaseLogin: 'ログインしてください',
    },

    // 投稿
    post: {
      createPost: '投稿する',
      postPlaceholder: '例: 最近、仕事で悩みがあります...',
      postLabel: '今の気持ちや悩みを共有してください',
      maxLength: '最大1000文字',
      noPosts: 'まだ投稿がありません',
      noPostsDescription: '最初の投稿をしてみましょう！',
    },

    // 励まし
    encouragement: {
      send: '励ましを送る',
      sendMessage: '励ましを送る',
      messagePlaceholder: '励ましのメッセージを入力してください...',
      messageLabel: 'メッセージ',
      sending: '送信中...',
      thankYou: 'ありがとう 🌸',
      thankYouLabel: 'ありがとうを送る',
      thanked: '感謝済み',
      thankedLabel: '感謝済み',
      empathize: '共感 💫',
      empathizeLabel: '共感を送る',
      oneOnOne: '1対1相談を申し出る',
      oneOnOneLabel: '1対1相談を申し出る',
    },

    // 花・コイン
    bloom: {
      flowerBloomed: '花が咲きました',
      coinIssued: 'KindCoinを1枚獲得しました',
      coinIssuedMultiple: 'KindCoinを{count}枚獲得しました',
      thankYouCoin: 'あなたのありがとうが花とコインになりました',
      noFlowers: 'まだ花は咲いていません',
      noFlowersDescription: '励ましや感謝が届くと、ここに花が咲きます',
      flowerCount: '花壇の花: {count}個',
      thankYouFlowers: '感謝の花: {count}個',
    },

    // カレンダー
    calendar: {
      title: '共感カレンダー',
      streak: 'あなたの優しさストリーク',
      streakDescription: '毎日優しさを記録して、連続記録を伸ばしましょう！',
      streakDays: '{count}日',
      streakLabel: '現在の連続記録は{count}日です',
      greatStreak: '素晴らしい！5日連続達成です！',
      previousMonth: '前月へ',
      nextMonth: '次月へ',
      legend: '凡例',
      actions: '{count}個の行動',
      flowersOnDate: '{date}、{count}個の行動',
      noFlowersOnDate: '{date}',
    },

    // ミッション
    mission: {
      title: '今日のミッション',
      completed: '完了',
      completedLabel: 'ミッションを完了する',
      progress: '{completed}/{total}',
      progressLabel: '完了数: {completed}、総数: {total}',
      allCompleted: 'すべて完了！',
      allCompletedDescription: '今日も素晴らしい優しさをありがとうございます',
      noMissions: '今日のミッションはありません',
      availableCoins: '所持KindCoin: {count}枚',
    },

    // ウォレット
    wallet: {
      title: 'ウォレット',
      ownedCoins: '保有KindCoin',
      coinsCount: '{count}枚',
      donate: '寄付する',
      donateLabel: 'KindCoinを寄付する',
      gift: '贈る',
      giftLabel: 'KindCoinを贈る',
      donationSuccess: '寄付が完了しました',
      giftSuccess: '贈りが完了しました',
      noCoins: 'KindCoinがありません',
    },

    // プロフィール
    profile: {
      title: 'プロフィール',
      profileLabel: 'プロフィール',
      garden: '花壇',
      gardenDescription: '受け取った感謝の花が咲きます',
      recentEncouragements: '最近の励まし',
      recentEncouragementsLabel: '{count}件の励ましメッセージ',
      noEncouragements: 'まだ励ましを送っていません',
      noEncouragementsDescription: '誰かの投稿に励ましを送ると、ここに表示されます',
      connect: '光でつながる',
      connectLabel: '{name}さんと光でつながる',
      connected: 'つながっています',
      connectedLabel: '{name}さんとは既につながっています',
      connectedLabelShort: '既につながっています',
      sendTime: '送信日時: {time}',
      moreEncouragements: '他 {count}件の励まし',
      avatarLabel: '{name}のアバター',
    },

    // テキスト柔軟化
    moderation: {
      sendMode: '送信方法：',
      sendAsIs: 'そのまま送る',
      sendAsIsLabel: 'そのまま送る',
      soften: '少しやわらげる',
      softenLabel: '少しやわらげる',
      softenedText: 'やわらかくした文章：',
    },

    // エラーメッセージ
    error: {
      userNotFound: 'ユーザーが見つかりません',
      postNotFound: '投稿が見つかりません',
      somethingWentWrong: '何か問題が発生しました',
    },
  },

  // 英語版（将来実装用）
  en: {
    common: {
      submit: 'Submit',
      cancel: 'Cancel',
      close: 'Close',
      delete: 'Delete',
      edit: 'Edit',
      save: 'Save',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      login: 'Login',
      logout: 'Logout',
      pleaseLogin: 'Please log in',
    },
    post: {
      createPost: 'Create Post',
      postPlaceholder: 'Example: I have been feeling worried about work recently...',
      postLabel: 'Share your feelings or concerns',
      maxLength: 'Max 1000 characters',
      noPosts: 'No posts yet',
      noPostsDescription: 'Let\'s create the first post!',
    },
    encouragement: {
      send: 'Send Encouragement',
      sendMessage: 'Send Encouragement',
      messagePlaceholder: 'Enter your message of encouragement...',
      messageLabel: 'Message',
      sending: 'Sending...',
      thankYou: 'Thank You 🌸',
      thankYouLabel: 'Send thank you',
      thanked: 'Thanked',
      thankedLabel: 'Thanked',
      empathize: 'Empathize 💫',
      empathizeLabel: 'Send empathy',
      oneOnOne: 'Request 1-on-1 Consultation',
      oneOnOneLabel: 'Request 1-on-1 consultation',
    },
    bloom: {
      flowerBloomed: 'A flower bloomed',
      coinIssued: 'You received 1 KindCoin',
      coinIssuedMultiple: 'You received {count} KindCoins',
      thankYouCoin: 'Your thank you became a flower and coin',
      noFlowers: 'No flowers yet',
      noFlowersDescription: 'When encouragement or thanks arrive, flowers will bloom here',
      flowerCount: 'Garden flowers: {count}',
      thankYouFlowers: 'Thank you flowers: {count}',
    },
    calendar: {
      title: 'Empathy Calendar',
      streak: 'Your Kindness Streak',
      streakDescription: 'Record kindness every day and extend your streak!',
      streakDays: '{count} days',
      streakLabel: 'Current streak: {count} days',
      greatStreak: 'Great! You\'ve achieved 5 days in a row!',
      previousMonth: 'Previous Month',
      nextMonth: 'Next Month',
      legend: 'Legend',
      actions: '{count} actions',
      flowersOnDate: '{date}, {count} actions',
      noFlowersOnDate: '{date}',
    },
    mission: {
      title: 'Today\'s Missions',
      completed: 'Complete',
      completedLabel: 'Complete mission',
      progress: '{completed}/{total}',
      progressLabel: 'Completed: {completed}, Total: {total}',
      allCompleted: 'All Complete!',
      allCompletedDescription: 'Thank you for your kindness today',
      noMissions: 'No missions today',
      availableCoins: 'KindCoins: {count}',
    },
    wallet: {
      title: 'Wallet',
      ownedCoins: 'Owned KindCoins',
      coinsCount: '{count} coins',
      donate: 'Donate',
      donateLabel: 'Donate KindCoin',
      gift: 'Gift',
      giftLabel: 'Gift KindCoin',
      donationSuccess: 'Donation completed',
      giftSuccess: 'Gift completed',
      noCoins: 'No KindCoins',
    },
    profile: {
      title: 'Profile',
      profileLabel: 'Profile',
      garden: 'Garden',
      gardenDescription: 'Thank you flowers you received will bloom here',
      recentEncouragements: 'Recent Encouragements',
      recentEncouragementsLabel: '{count} encouragement messages',
      noEncouragements: 'No encouragements sent yet',
      noEncouragementsDescription: 'When you send encouragement on someone\'s post, it will appear here',
      connect: 'Connect with Light',
      connectLabel: 'Connect with {name}',
      connected: 'Connected',
      connectedLabel: 'Already connected with {name}',
      connectedLabelShort: 'Already connected',
      sendTime: 'Sent: {time}',
      moreEncouragements: '{count} more encouragements',
      avatarLabel: '{name}\'s avatar',
    },
    moderation: {
      sendMode: 'Send Mode:',
      sendAsIs: 'Send As Is',
      sendAsIsLabel: 'Send as is',
      soften: 'Soften',
      softenLabel: 'Soften text',
      softenedText: 'Softened text:',
    },
    error: {
      userNotFound: 'User not found',
      postNotFound: 'Post not found',
      somethingWentWrong: 'Something went wrong',
    },
  },
};

// 型定義
type TranslationDict = {
  common: {
    submit: string;
    cancel: string;
    close: string;
    delete: string;
    edit: string;
    save: string;
    loading: string;
    error: string;
    success: string;
    login: string;
    logout: string;
    pleaseLogin: string;
  };
  post: {
    createPost: string;
    postPlaceholder: string;
    postLabel: string;
    maxLength: string;
    noPosts: string;
    noPostsDescription: string;
  };
  encouragement: {
    send: string;
    sendMessage: string;
    messagePlaceholder: string;
    messageLabel: string;
    sending: string;
    thankYou: string;
    thankYouLabel: string;
    thanked: string;
    thankedLabel: string;
    empathize: string;
    empathizeLabel: string;
    oneOnOne: string;
    oneOnOneLabel: string;
  };
  bloom: {
    flowerBloomed: string;
    coinIssued: string;
    coinIssuedMultiple: string;
    thankYouCoin: string;
    noFlowers: string;
    noFlowersDescription: string;
    flowerCount: string;
    thankYouFlowers: string;
  };
  calendar: {
    title: string;
    streak: string;
    streakDescription: string;
    streakDays: string;
    streakLabel: string;
    greatStreak: string;
    previousMonth: string;
    nextMonth: string;
    legend: string;
    actions: string;
    flowersOnDate: string;
    noFlowersOnDate: string;
  };
  mission: {
    title: string;
    completed: string;
    completedLabel: string;
    progress: string;
    progressLabel: string;
    allCompleted: string;
    allCompletedDescription: string;
    noMissions: string;
    availableCoins: string;
  };
  wallet: {
    title: string;
    ownedCoins: string;
    coinsCount: string;
    donate: string;
    donateLabel: string;
    gift: string;
    giftLabel: string;
    donationSuccess: string;
    giftSuccess: string;
    noCoins: string;
  };
  profile: {
    title: string;
    profileLabel: string;
    garden: string;
    gardenDescription: string;
    recentEncouragements: string;
    recentEncouragementsLabel: string;
    noEncouragements: string;
    noEncouragementsDescription: string;
    connect: string;
    connectLabel: string;
    connected: string;
    connectedLabel: string;
    connectedLabelShort: string;
    sendTime: string;
    moreEncouragements: string;
    avatarLabel: string;
  };
  moderation: {
    sendMode: string;
    sendAsIs: string;
    sendAsIsLabel: string;
    soften: string;
    softenLabel: string;
    softenedText: string;
  };
  error: {
    userNotFound: string;
    postNotFound: string;
    somethingWentWrong: string;
  };
};

/**
 * 文字列を取得
 * @param key 翻訳キー（例: 'common.submit'）
 * @param params パラメータ（例: { count: 5 }）
 * @returns 翻訳された文字列
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const keys = key.split('.');
  const dict = translations[currentLocale];
  
  // ネストされたキーを取得
  let value: any = dict;
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }
  
  if (typeof value !== 'string') {
    console.warn(`Translation value is not a string: ${key}`);
    return key;
  }
  
  // パラメータを置換
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match;
    });
  }
  
  return value;
}

/**
 * 現在のロケールを取得
 */
export function getLocale(): Locale {
  return currentLocale;
}

/**
 * ロケールを設定（将来実装用）
 */
export function setLocale(locale: Locale): void {
  // MVPでは実装しない
  console.warn('setLocale is not implemented in MVP');
}

