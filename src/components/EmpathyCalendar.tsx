import React from 'react';
import { Card } from './Card';
import { FlowerIcon } from './FlowerIcon';
import { formatDateForCalendar, formatDateShort } from '../utils/date';
import type { EmpathyCalendarEntry } from '../types';

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

  const entryMap = new Map(
    entries.map((e) => [e.date, e.count])
  );

  return (
    <Card>
      <h2 className="mb-md" style={{ fontSize: 'var(--font-size-xl)' }}>
        共感カレンダー
      </h2>
      <div className="text-sm text-light mb-md">
        1日1優しさで日付に花が咲きます
      </div>
      <div
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
          gap: 'var(--spacing-xs)',
        }}
      >
        {dates.map((date) => {
          const count = entryMap.get(date) || 0;
          const hasFlower = count > 0;

          return (
            <div
              key={date}
              className="flex flex-col items-center gap-xs p-xs"
              style={{
                backgroundColor: hasFlower
                  ? 'var(--color-secondary)'
                  : 'var(--color-background-light)',
                borderRadius: 'var(--radius-sm)',
                minHeight: '50px',
                justifyContent: 'center',
              }}
              title={formatDateShort(date)}
              aria-label={`${date}: ${hasFlower ? '花が咲いています' : '花は咲いていません'}`}
            >
              <div className="text-xs text-light">
                {new Date(date).getDate()}
              </div>
              {hasFlower && (
                <FlowerIcon
                  size={20}
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

