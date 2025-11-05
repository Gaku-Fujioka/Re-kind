/**
 * 寄付プロジェクト管理
 * 将来APIに置換しやすい構造
 */

export interface DonationProject {
  id: string;
  name: string;
  description: string;
  category: 'children' | 'food' | 'isolation';
  icon: string;
}

export const donationProjects: DonationProject[] = [
  {
    id: 'children',
    name: '子どもの未来を支える',
    description: '困難な環境にある子どもたちの教育と生活を支援します',
    category: 'children',
    icon: '👶',
  },
  {
    id: 'food',
    name: 'フードロス削減',
    description: '食品ロスを減らし、必要な人に食糧を届ける活動を支援します',
    category: 'food',
    icon: '🍎',
  },
  {
    id: 'isolation',
    name: '孤立を防ぐ支援',
    description: '一人ひとりが孤立せず、つながりを持てる社会を目指します',
    category: 'isolation',
    icon: '🤝',
  },
];

/**
 * 寄付を実行する（将来的にAPI呼び出しに置換）
 * @param projectId プロジェクトID
 * @param amount 寄付額（KindCoin）
 * @returns 成功したかどうか
 */
export const donateToProject = async (
  projectId: string,
  amount: number
): Promise<boolean> => {
  // 将来的にはAPI呼び出しに置換
  // const response = await fetch('/api/donations', {
  //   method: 'POST',
  //   body: JSON.stringify({ projectId, amount }),
  // });
  // return response.ok;

  // 現在はデモとして常に成功を返す
  console.log(`寄付: ${projectId} に ${amount} KindCoin`);
  return true;
};

/**
 * プロジェクト情報を取得（将来的にAPI呼び出しに置換）
 */
export const getDonationProjects = async (): Promise<DonationProject[]> => {
  // 将来的にはAPI呼び出しに置換
  // const response = await fetch('/api/donations/projects');
  // return response.json();

  // 現在はローカルデータを返す
  return donationProjects;
};

