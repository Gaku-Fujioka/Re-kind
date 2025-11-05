import { useAppStore } from '../../app/store/useAppStore';
import { FlowerIcon } from '../../components/icons/FlowerIcon';
import { formatRelativeTime } from '../../lib/utils/date';
import type { ThankYouBloom } from '../../lib/types';

interface ThankYouBloomListProps {
  blooms: ThankYouBloom[];
}

export const ThankYouBloomList: React.FC<ThankYouBloomListProps> = ({
  blooms,
}) => {
  const getUser = useAppStore((state) => state.getUser);

  if (blooms.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        まだ花は咲いていません
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {blooms.slice(0, 10).map((bloom) => {
        const fromUser = getUser(bloom.fromUserId);
        return (
          <div
            key={bloom.id}
            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
          >
            <FlowerIcon size={24} color="#FFB347" />
            <div className="flex-1">
              <div className="text-sm">
                <strong>{fromUser?.name || '匿名'}</strong>さんから花が贈られました
              </div>
              <div className="text-xs text-gray-500">
                {formatRelativeTime(bloom.createdAt)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

