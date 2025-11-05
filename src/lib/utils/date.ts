import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

export const formatDate = (timestamp: number): string => {
  return format(new Date(timestamp), 'yyyy年MM月dd日 HH:mm');
};

export const formatRelativeTime = (timestamp: number | string | Date): string => {
  const date = typeof timestamp === 'number' 
    ? new Date(timestamp) 
    : typeof timestamp === 'string'
    ? new Date(timestamp)
    : timestamp;
  
  return formatDistanceToNow(date, {
    addSuffix: true,
  });
};

export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  if (isToday(date)) return '今日';
  if (isYesterday(date)) return '昨日';
  return format(date, 'M月d日');
};

export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const formatDateForCalendar = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

