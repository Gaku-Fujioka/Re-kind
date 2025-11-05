import { useEffect, useState } from 'react';
import { useAppStore } from '../app/store/useAppStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { FlowerIcon } from '../components/icons/FlowerIcon';
import { CoinIcon } from '../components/icons/CoinIcon';
import { generateTodayMissions, getMissionReadAloudText } from '../lib/missions';
import { getTodayString } from '../lib/utils/date';
import { t } from '../lib/i18n';
import type { Mission } from '../lib/types';

export const Missions = () => {
  const currentUser = useAppStore((state) => state.getCurrentUser());
  const completeMission = useAppStore((state) => state.completeMission);
  const issueCoin = useAppStore((state) => state.issueCoin);
  const logCalendarAction = useAppStore((state) => state.logCalendarAction);
  const getUserCoins = useAppStore((state) => state.getUserCoins);

  const [todayMissions, setTodayMissions] = useState<Mission[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [notificationMessage, setNotificationMessage] = useState<string>('');

  useEffect(() => {
    if (!currentUser) return;

    // 今日のミッションを生成
    const missions = generateTodayMissions();
    setTodayMissions(missions);

    // 完了済みミッションを取得
    const today = getTodayString();
    if (currentUser.missions.today === today) {
      setCompletedIds(currentUser.missions.completedIds);
    } else {
      setCompletedIds([]);
    }
  }, [currentUser]);

  const handleComplete = async (mission: Mission) => {
    if (!currentUser) return;
    if (completedIds.includes(mission.id)) return; // 既に完了済み

    // ミッションを完了
    completeMission(mission.id);
    setCompletedIds([...completedIds, mission.id]);

    // コインを発行（デモ用のメッセージID）
    const coins = getUserCoins(currentUser.id);
    const demoMessageId = `demo_msg_${Date.now()}`;
    issueCoin(currentUser.id, demoMessageId);

    // カレンダーを更新（ミッション完了は共感として記録）
    logCalendarAction('daisy');

    // aria-live通知
    setNotificationMessage(t('bloom.coinIssued'));
    
    // 通知をクリア（3秒後）
    setTimeout(() => setNotificationMessage(''), 3000);
  };

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t('common.pleaseLogin')}</p>
      </div>
    );
  }

  const availableCoins = getUserCoins(currentUser.id).filter((c) => !c.spentAt);
  const completedCount = completedIds.length;
  const totalCount = todayMissions.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* aria-live通知エリア */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {notificationMessage}
      </div>

      <div className="flex items-center gap-2 mb-6">
        <FlowerIcon size={28} color="#FFB347" />
        <h1 className="text-2xl font-bold text-neutral">{t('mission.title')}</h1>
      </div>

      {/* 進捗表示 */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral mb-2">
              今日のミッション
            </h2>
            <div className="flex items-center gap-3">
              <Badge variant="primary">
                {completedCount} / {totalCount} 完了
              </Badge>
              {completedCount === totalCount && totalCount > 0 && (
                <Badge variant="accent" className="flex items-center gap-1">
                  <FlowerIcon size={16} color="#FFB347" />
                  すべて完了！
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CoinIcon size={20} />
            <span>所持: {availableCoins.length}枚</span>
          </div>
        </div>
      </Card>

      {/* ミッション一覧 */}
      {todayMissions.length === 0 ? (
        <Card>
          <div className="text-center text-gray-500 py-8">
            <p>今日のミッションを読み込み中...</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {todayMissions.map((mission) => {
            const isCompleted = completedIds.includes(mission.id);
            const readAloudText = getMissionReadAloudText(mission);

            return (
              <Card
                key={mission.id}
                className={`
                  ${isCompleted ? 'opacity-75 bg-accent/20' : ''}
                  transition-all duration-200
                `}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-neutral">
                        {mission.title}
                      </h3>
                      {isCompleted && (
                        <Badge variant="primary" className="flex items-center gap-1">
                          <span>✓</span>
                          完了
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{mission.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <CoinIcon size={16} />
                        報酬: {mission.rewardCoins}枚
                      </span>
                    </div>
                    {/* スクリーンリーダー用読み上げテキスト */}
                    <div className="sr-only" aria-live="polite">
                      {isCompleted
                        ? `完了済み: ${readAloudText}`
                        : readAloudText}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {!isCompleted ? (
                      <Button
                        onClick={() => handleComplete(mission)}
                        variant="primary"
                        aria-label={`${mission.title}を完了する`}
                      >
                        完了
                      </Button>
                    ) : (
                      <div className="flex items-center justify-center w-20 h-10 text-primary">
                        <span className="text-2xl">✓</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* 説明カード */}
      <Card className="bg-accent/30">
        <div className="flex items-start gap-3">
          <FlowerIcon size={24} color="#FFB347" />
          <div className="flex-1">
            <h3 className="font-medium text-neutral mb-2">
              ミッションについて
            </h3>
            <p className="text-sm text-gray-600">
              毎日、新しいミッションが表示されます。ミッションを完了すると、KindCoinが1枚もらえます。
              優しさの行動を続けることで、あなたのカレンダーに花が咲いていきます。
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
