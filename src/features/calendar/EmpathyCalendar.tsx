import { useAppStore } from '../../app/store/useAppStore';
import { Card } from '../../components/ui/Card';
import { FlowerIcon } from '../../components/icons/FlowerIcon';
import { formatDateForCalendar, formatDateShort } from '../../lib/utils/date';
import type { EmpathyCalendarEntry } from '../../lib/types';

interface EmpathyCalendarProps {
  entries: EmpathyCalendarEntry[];
  userId: string;
}

export const EmpathyCalendar: React.FC<EmpathyCalendarProps> = ({
  entries,
  userId,
}) => {
  // 過去30日分の日付を生成
  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return formatDateForCalendar(date);
  });

  const entryMap = new Map(entries.map((e) => [e.date, e.count]));

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">共感カレンダー</h2>
      <div className="text-sm text-gray-500 mb-4">
        1日1優しさで日付に花が咲きます
      </div>
      <div className="grid grid-cols-10 sm:grid-cols-15 gap-1" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))' }}>
        {dates.map((date) => {
          const count = entryMap.get(date) || 0;
          const hasFlower = count > 0;

          return (
            <div
              key={date}
              className={`flex flex-col items-center justify-center gap-1 p-2 rounded text-xs ${
                hasFlower
                  ? 'bg-secondary text-primary'
                  : 'bg-gray-100 text-gray-400'
              }`}
              title={formatDateShort(date)}
              aria-label={`${date}: ${hasFlower ? '花が咲いています' : '花は咲いていません'}`}
            >
              <div className="text-xs">{new Date(date).getDate()}</div>
              {hasFlower && (
                <FlowerIcon
                  size={16}
                  color="#FFB347"
                  aria-label={`${count}個の優しさ`}
                />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

