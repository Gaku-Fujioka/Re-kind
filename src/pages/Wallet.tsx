import React, { useState } from 'react';
import { useAppStore } from '../app/store/useAppStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { LightParticle } from '../components/ui/LightParticle';
import { Flower } from '../components/ui/Flower';
import { Toast } from '../components/ui/Toast';
import { getDonationProjects, donateToProject } from '../lib/donations';
import type { DonationProject } from '../lib/donations';
import type { UserId } from '../lib/types';

export const Wallet = () => {
  const currentUser = useAppStore((state) => state.getCurrentUser());
  const getUserCoins = useAppStore((state) => state.getUserCoins);
  const spendCoin = useAppStore((state) => state.spendCoin);
  const addBloom = useAppStore((state) => state.addBloom);
  const logCalendarAction = useAppStore((state) => state.logCalendarAction);
  const getAllUsers = useAppStore((state) => state.getAllUsers);

  const availableCoins = currentUser
    ? getUserCoins(currentUser.id).filter((c) => !c.spentAt)
    : [];

  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<DonationProject | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<UserId | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [projects, setProjects] = useState<DonationProject[]>([]);

  // プロジェクト情報を取得
  React.useEffect(() => {
    getDonationProjects().then(setProjects);
  }, []);

  const handleDonate = async () => {
    if (!selectedProject || !currentUser || availableCoins.length === 0) return;

    // 最初の利用可能なコインを使用
    const coin = availableCoins[0];
    const success = await donateToProject(selectedProject.id, coin.amount);

    if (success) {
      // コインを消費
      spendCoin(coin.id, 'donation');
      // カレンダーにsunflowerを記録
      logCalendarAction('sunflower');
      setToastMessage(`${selectedProject.name}に寄付しました。ありがとうございます！`);
      setShowDonationModal(false);
      setSelectedProject(null);
    } else {
      setToastMessage('寄付に失敗しました。もう一度お試しください。');
    }
  };

  const handleGift = () => {
    if (!selectedUserId || !currentUser || availableCoins.length === 0) return;

    // 最初の利用可能なコインを使用
    const coin = availableCoins[0];
    const success = spendCoin(coin.id, 'gift');

    if (success) {
      // 相手の花壇にbouquetを追加
      addBloom(selectedUserId, {
        fromUserId: currentUser.id,
        toUserId: selectedUserId,
        kind: 'bouquet',
      });

      // カレンダーにsunflowerを記録
      logCalendarAction('sunflower');
      setToastMessage('花を贈りました！');
      setShowGiftModal(false);
      setSelectedUserId(null);
    } else {
      setToastMessage('花を贈ることができませんでした。');
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">ログインしてください</p>
      </div>
    );
  }

  const users = getAllUsers().filter((u) => u.id !== currentUser.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-2xl font-bold text-neutral">ウォレット</h1>
      </div>

      <Toast
        message={toastMessage || ''}
        isOpen={!!toastMessage}
        onClose={() => setToastMessage(null)}
      />

      {/* 保有KindCoin表示 */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral mb-2">
              保有KindCoin
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(availableCoins.length, 10) }).map(
                  (_, i) => (
                    <LightParticle
                      key={i}
                      size={10}
                      glow={true}
                      aria-label={`KindCoin ${i + 1}`}
                    />
                  )
                )}
              </div>
              <span className="text-xs text-gray-400 ml-2">
                {availableCoins.length}枚
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* アクションボタン */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowGiftModal(true)}>
          <div className="flex items-center gap-4">
            <Flower kind="bouquet" size={48} />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral mb-1">
                花を贈る
              </h3>
              <p className="text-sm text-gray-600">
                誰かにKindCoinで花を贈ります
              </p>
            </div>
          </div>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowDonationModal(true)}>
          <div className="flex items-center gap-4">
            <div className="text-4xl">🌻</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral mb-1">
                寄付（デモ）
              </h3>
              <p className="text-sm text-gray-600">
                社会プロジェクトに寄付します
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* 花を贈るモーダル */}
      <Modal
        isOpen={showGiftModal}
        onClose={() => {
          setShowGiftModal(false);
          setSelectedUserId(null);
        }}
        title="花を贈る"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            誰に花を贈りますか？
          </p>
          {users.length === 0 ? (
            <p className="text-sm text-gray-500">贈る相手がいません</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`
                    w-full p-3 rounded-lg border-2 transition-colors text-left
                    ${
                      selectedUserId === user.id
                        ? 'border-primary bg-accent'
                        : 'border-gray-200 hover:border-primary/50'
                    }
                  `}
                  aria-pressed={selectedUserId === user.id}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold">
                      {user.name[0]}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">
                        {user.garden.length}個の花が咲いています
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2 justify-end pt-4 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={() => {
                setShowGiftModal(false);
                setSelectedUserId(null);
              }}
            >
              キャンセル
            </Button>
            <Button
              onClick={handleGift}
              disabled={!selectedUserId || availableCoins.length === 0}
            >
              🌸 花を贈る
            </Button>
          </div>
        </div>
      </Modal>

      {/* 寄付モーダル */}
      <Modal
        isOpen={showDonationModal}
        onClose={() => {
          setShowDonationModal(false);
          setSelectedProject(null);
        }}
        title="寄付（デモ）"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            支援したいプロジェクトを選んでください
          </p>
          {projects.length === 0 ? (
            <p className="text-sm text-gray-500">プロジェクトを読み込み中...</p>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`
                    w-full p-4 rounded-lg border-2 transition-colors text-left
                    ${
                      selectedProject?.id === project.id
                        ? 'border-primary bg-accent'
                        : 'border-gray-200 hover:border-primary/50'
                    }
                  `}
                  aria-pressed={selectedProject?.id === project.id}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{project.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-neutral mb-1">
                        {project.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {project.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2 justify-end pt-4 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={() => {
                setShowDonationModal(false);
                setSelectedProject(null);
              }}
            >
              キャンセル
            </Button>
            <Button
              onClick={handleDonate}
              disabled={!selectedProject || availableCoins.length === 0}
            >
              🌻 寄付する
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
