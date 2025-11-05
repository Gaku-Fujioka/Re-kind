import { useState, useEffect } from 'react';
import { useAppStore } from '../../app/store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FlowerIcon } from '../../components/icons/FlowerIcon';
import { generateTodayMissions } from '../../lib/missions';
import { getTodayString } from '../../lib/utils/date';
import type { Mission } from '../../lib/types';

export const KindMission = () => {
  const currentUser = useAppStore((state) => state.getCurrentUser());
  const completeMission = useAppStore((state) => state.completeMission);
  const [missions] = useState<Mission[]>(generateTodayMissions());
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    if (currentUser) {
      const today = getTodayString();
      if (currentUser.missions.today === today) {
        setCompletedIds(currentUser.missions.completedIds || []);
      } else {
        setCompletedIds([]);
      }
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const handleComplete = (missionId: string) => {
    if (completedIds.includes(missionId)) return;
    completeMission(missionId);
    setCompletedIds([...completedIds, missionId]);
  };

  const incompleteMissions = missions.filter((m) => !completedIds.includes(m.id));
  const completedMissions = missions.filter((m) => completedIds.includes(m.id));

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Kind Mission</h2>
      <div className="text-sm text-gray-500 mb-4">
        今日の小さな優しさミッションを達成しましょう
      </div>

      {incompleteMissions.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">未完了</h3>
          {incompleteMissions.map((mission) => (
            <div
              key={mission.id}
              className="flex items-center justify-between p-3 mb-2 bg-gray-50 rounded-lg"
            >
              <span className="text-sm">{mission.description}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleComplete(mission.id)}
              >
                完了
              </Button>
            </div>
          ))}
        </div>
      )}

      {completedMissions.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">完了</h3>
          {completedMissions.map((mission) => (
            <div
              key={mission.id}
              className="flex items-center gap-2 p-3 mb-2 bg-secondary/30 rounded-lg opacity-70"
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

