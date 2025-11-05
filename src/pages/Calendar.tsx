import { useState } from 'react';
import { useAppStore } from '../app/store/useAppStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Flower } from '../components/ui/Flower';
import { Badge } from '../components/ui/Badge';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  getDay,
} from 'date-fns';
import type { CalendarFlower } from '../lib/types';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

const flowerMap: Record<CalendarFlower, { label: string; kind: 'empathy' | 'courage' | 'rescue' | 'bouquet' }> = {
  daisy: { label: '共感', kind: 'empathy' },
  tulip: { label: '励まし', kind: 'courage' },
  sunflower: { label: '寄付', kind: 'rescue' },
  lotus: { label: 'ありがとう', kind: 'empathy' },
  blossom: { label: '連続記録', kind: 'bouquet' },
};

export const Calendar = () => {
  const currentUser = useAppStore((state) => state.getCurrentUser());
  const [currentDate, setCurrentDate] = useState(new Date());

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">ログインしてください</p>
      </div>
    );
  }

  const calendar = currentUser.calendar || {
    byDate: {},
    streak: 0,
    lastActionDate: undefined,
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // カレンダーの最初の日を月曜日から始めるために、前月の日付を追加
  const firstDayOfWeek = getDay(monthStart);
  const daysBeforeMonth = Array.from({ length: firstDayOfWeek }, (_, i) => {
    const date = new Date(monthStart);
    date.setDate(date.getDate() - (firstDayOfWeek - i));
    return date;
  });

  // カレンダーを7日×6週のグリッドに揃えるために、次月の日付を追加
  const totalCells = 42; // 7日 × 6週
  const daysAfterMonth = Array.from(
    { length: totalCells - daysBeforeMonth.length - daysInMonth.length },
    (_, i) => {
      const date = new Date(monthEnd);
      date.setDate(date.getDate() + i + 1);
      return date;
    }
  );

  const allDays = [...daysBeforeMonth, ...daysInMonth, ...daysAfterMonth];

  const getFlowersForDate = (date: Date): CalendarFlower[] => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return calendar.byDate[dateStr] || [];
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral">共感カレンダー</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleToday}>
            今日
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrevMonth}>
            ←
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            →
          </Button>
        </div>
      </div>

      {/* ストリーク表示 */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral mb-2">
              連続記録
            </h2>
            <div className="flex items-center gap-3">
              <Badge variant="primary" className="text-lg px-4 py-2">
                {calendar.streak}日連続
              </Badge>
              {calendar.streak >= 5 && (
                <div className="flex items-center gap-2">
                  <Flower kind="bouquet" size={24} />
                  <span className="text-sm text-gray-600">5日連続達成！</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* カレンダー */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral">
            {format(currentDate, 'yyyy年M月')}
          </h2>
        </div>

        <div
          role="grid"
          aria-label={`${format(currentDate, 'yyyy年M月')}のカレンダー`}
          className="grid grid-cols-7 gap-1"
        >
          {/* 曜日ヘッダー */}
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-600 py-2"
              role="columnheader"
              aria-label={day}
            >
              {day}
            </div>
          ))}

          {/* 日付セル */}
          {allDays.map((date, index) => {
            const isCurrentMonth = isSameMonth(date, currentDate);
            const isCurrentDay = isToday(date);
            const flowers = getFlowersForDate(date);
            const dateStr = format(date, 'yyyy-MM-dd');
            const dayNumber = format(date, 'd');

            // 連続記録チェック（5日以上）
            const hasBlossom = calendar.streak >= 5 && flowers.length > 0;

            return (
              <div
                key={dateStr}
                role="gridcell"
                aria-label={`${format(date, 'yyyy年M月d日')}${
                  flowers.length > 0 ? `、${flowers.length}個の行動` : ''
                }`}
                className={`
                  aspect-square p-1 border border-gray-200 rounded-lg
                  ${!isCurrentMonth ? 'opacity-30' : ''}
                  ${isCurrentDay ? 'border-primary border-2 bg-accent/30' : ''}
                  ${flowers.length > 0 ? 'bg-secondary/20' : 'bg-white'}
                  flex flex-col items-center justify-center gap-1
                  transition-colors hover:bg-accent/50
                  focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-1
                `}
                tabIndex={0}
              >
                <div className="text-xs font-medium text-gray-600">
                  {dayNumber}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-0.5">
                  {flowers.map((flower, flowerIndex) => {
                    // 連続5日以上の場合はblossomを優先表示
                    if (hasBlossom && flowerIndex === 0) {
                      return (
                        <Flower
                          key={`${dateStr}-blossom`}
                          kind="bouquet"
                          size={16}
                          aria-label={`連続記録: ${flowerMap[flower].label}`}
                        />
                      );
                    }
                    return (
                      <Flower
                        key={`${dateStr}-${flowerIndex}`}
                        kind={flowerMap[flower]?.kind || 'empathy'}
                        size={12}
                        aria-label={flowerMap[flower]?.label || flower}
                      />
                    );
                  })}
                </div>
                {flowers.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{flowers.length - 3}
                  </div>
                )}
                {/* スクリーンリーダー用詳細 */}
                <div className="sr-only">
                  {flowers.length > 0
                    ? `${flowers.map((f) => flowerMap[f]?.label || f).join('、')}`
                    : '行動なし'}
                </div>
              </div>
            );
          })}
        </div>

        {/* 凡例 */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-neutral mb-3">凡例</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(flowerMap).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center gap-2 text-sm"
                role="listitem"
              >
                <Flower kind={value.kind} size={20} aria-label={value.label} />
                <span className="text-gray-600">{value.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
