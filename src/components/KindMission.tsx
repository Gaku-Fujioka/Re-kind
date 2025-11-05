import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { FlowerIcon } from './FlowerIcon';
import { useTodayMissions, useCurrentUser } from '../hooks/useRepository';
import { repository } from '../storage/repository';
import { getTodayString } from '../utils/date';

export const KindMission: React.FC = () => {
  const { user: currentUser } = useCurrentUser();
  const { missions, refresh } = useTodayMissions(currentUser?.id || '');
  const [newMission, setNewMission] = useState('');

  if (!currentUser) return null;

  const handleAddMission = () => {
    if (!newMission.trim()) return;

    repository.createMission({
      userId: currentUser.id,
      date: getTodayString(),
      description: newMission.trim(),
      completed: false,
    });
    setNewMission('');
    refresh();
  };

  const handleComplete = (missionId: string) => {
    repository.completeMission(missionId);
    refresh();
  };

  const incompleteMissions = missions.filter((m) => !m.completed);
  const completedMissions = missions.filter((m) => m.completed);

  return (
    <Card>
      <h2 className="mb-md" style={{ fontSize: 'var(--font-size-xl)' }}>
        Kind Mission
      </h2>
      <div className="text-sm text-light mb-md">
        今日の小さな優しさミッションを設定しましょう
      </div>

      <div className="mb-md">
        <div className="flex gap-sm">
          <input
            type="text"
            value={newMission}
            onChange={(e) => setNewMission(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddMission()}
            placeholder="例: 同僚にありがとうを伝える"
            className="input flex-1"
            aria-label="新しいミッション"
          />
          <Button onClick={handleAddMission} disabled={!newMission.trim()}>
            追加
          </Button>
        </div>
      </div>

      {incompleteMissions.length > 0 && (
        <div className="mb-md">
          <h3 className="text-sm font-weight: 500 mb-sm">未完了</h3>
          {incompleteMissions.map((mission) => (
            <div
              key={mission.id}
              className="flex items-center justify-between p-sm mb-xs"
              style={{
                backgroundColor: 'var(--color-background-light)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <span className="text-sm">{mission.description}</span>
              <Button
                variant="outline"
                onClick={() => handleComplete(mission.id)}
                className="text-xs"
              >
                完了
              </Button>
            </div>
          ))}
        </div>
      )}

      {completedMissions.length > 0 && (
        <div>
          <h3 className="text-sm font-weight: 500 mb-sm">完了</h3>
          {completedMissions.map((mission) => (
            <div
              key={mission.id}
              className="flex items-center gap-sm p-sm mb-xs"
              style={{
                backgroundColor: 'var(--color-secondary)',
                borderRadius: 'var(--radius-md)',
                opacity: 0.7,
              }}
            >
              <FlowerIcon size={16} color="#FFB347" />
              <span className="text-sm">{mission.description}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

