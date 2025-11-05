/**
 * テキストを柔らかくする（ソフト化）機能
 * 強い否定語を婉曲に置換し、末尾を柔らかく、「私は〜と感じています」にリライト
 */

// 強い否定語とその婉曲的な置換
const negativeWordReplacements: Record<string, string> = {
  // 強い否定
  'だめ': '難しい',
  'ダメ': '難しい',
  'ダメだ': '難しい',
  'だめだ': '難しい',
  'いけない': '望ましくない',
  'いけないこと': '望ましくないこと',
  'いけないの': '望ましくない',
  'いけないん': '望ましくない',
  'いけない。': '望ましくない。',
  'してはいけない': 'できるだけ避けたい',
  'してはいけない。': 'できるだけ避けたい。',
  'してはいけないこと': 'できるだけ避けたいこと',
  'してはだめ': 'できるだけ避けたい',
  'してはだめ。': 'できるだけ避けたい。',
  'してはだめだ': 'できるだけ避けたい',
  'してはだめだ。': 'できるだけ避けたい。',
  
  // 絶対的な否定
  '絶対ダメ': '難しい',
  '絶対だめ': '難しい',
  '絶対にいけない': '望ましくない',
  '絶対に': 'できれば',
  '絶対': 'できれば',
  
  // 強い批判
  '最悪': '難しい',
  '最悪だ': '難しい',
  '最悪です': '難しいです',
  'ひどい': '難しい',
  'ひどいな': '難しい',
  'ひどいです': '難しいです',
  'ひどすぎる': '難しい',
  'ひどすぎ': '難しい',
  'ひどすぎる。': '難しい。',
  
  // 否定の強調
  '全然': 'あまり',
  '全然ない': 'あまりない',
  '全然ダメ': '難しい',
  '全然だめ': '難しい',
  '全然いけない': '望ましくない',
  
  // 強い断固（既に定義済みのため重複を削除）
  '絶対にしない': 'できるだけ避けたい',
  '絶対しない': 'できるだけ避けたい',
};

// 文末を柔らかくするパターン
const softenEndings = [
  { pattern: /(だ|です|である|である。)$/g, replacement: 'です' },
  { pattern: /(だよ|だね|だな|だぞ|だぜ)$/g, replacement: 'です' },
  { pattern: /(だ！|だ。|だ?)$/g, replacement: 'です' },
  { pattern: /(だって|だもん)$/g, replacement: 'です' },
  { pattern: /(やばい|やば|やべ|ヤバい|ヤバ)$/g, replacement: '難しいです' },
  { pattern: /(最低|最低だ|最低です)$/g, replacement: '難しいです' },
];

// 文末を柔らかくする追加パターン
const addSoftEnding = (text: string): string => {
  // 既に柔らかい語尾がついている場合は追加しない
  if (/[です|ます|ますね|ますよ|ます。|ます！|ます？|ますか|ますよ|ますね|ますが|ますけど|ますけれど|ますが、|ますけど、|ますけれど、|ます。|ます！|ます？]$/.test(text.trim())) {
    return text;
  }
  
  // 文末が句点で終わっている場合、その前に柔らかい語尾を追加
  if (text.trim().endsWith('。') && !text.trim().endsWith('です。') && !text.trim().endsWith('ます。')) {
    return text.trim().slice(0, -1) + 'です。';
  }
  
  // 文末が柔らかい語尾で終わっていない場合
  if (!/[です|ます|ますね|ますよ|ます。|ます！|ます？|ますか|ますよ|ますね|ますが|ますけど|ますけれど]$/.test(text.trim())) {
    if (!text.trim().endsWith('。')) {
      return text.trim() + 'です';
    }
  }
  
  return text;
};

/**
 * テキストを柔らかくする
 * @param text 元のテキスト
 * @returns 柔らかくしたテキスト
 */
export function softenText(text: string): string {
  if (!text || text.trim().length === 0) {
    return text;
  }

  let softened = text;

  // 1. 強い否定語を置換
  Object.entries(negativeWordReplacements).forEach(([negative, replacement]) => {
    // 単語境界を考慮した置換（大文字小文字を区別）
    const regex = new RegExp(
      negative.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'g'
    );
    softened = softened.replace(regex, replacement);
  });

  // 2. 文末を柔らかくする
  softenEndings.forEach(({ pattern, replacement }) => {
    softened = softened.replace(pattern, replacement);
  });

  // 3. 「私は〜と感じています」にリライト
  // 主語が明確でない場合や、断定的な表現を「感じています」に変換
  softened = softened.replace(
    /(^|[。\n])([^。\n]+)(だ|です|である)([。\n]|$)/g,
    (match, before, content, _ending, after) => {
      // 既に「感じています」系の表現がある場合はスキップ
      if (/感じ|思う|考える|思います|感じます/.test(content)) {
        return match;
      }
      
      // 主語がない場合は「私は」を追加
      if (!/^(私|僕|俺|わたし|ぼく|おれ|私は|僕は|俺は|わたしは|ぼくは|おれは)/.test(content.trim())) {
        return before + '私は' + content.trim() + 'と感じています' + after;
      }
      
      // 主語がある場合は「と感じています」に変換
      return before + content.trim() + 'と感じています' + after;
    }
  );

  // 4. 文末を柔らかくする（追加処理）
  softened = addSoftEnding(softened);

  // 5. 連続する句点や空白を整理
  softened = softened.replace(/。{2,}/g, '。');
  softened = softened.replace(/\s{2,}/g, ' ');
  softened = softened.trim();

  return softened;
}

/**
 * テキストが強い否定語を含んでいるかチェック
 * @param text チェックするテキスト
 * @returns 強い否定語を含んでいる場合true
 */
export function hasStrongNegativeWords(text: string): boolean {
  if (!text || text.trim().length === 0) {
    return false;
  }

  const negativeWords = Object.keys(negativeWordReplacements);
  const lowerText = text.toLowerCase();
  
  return negativeWords.some((word) => {
    const regex = new RegExp(
      word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'i'
    );
    return regex.test(lowerText);
  });
}
