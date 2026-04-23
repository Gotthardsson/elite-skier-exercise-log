import { formatWeekday, formatDayNumber } from "./dateFormatter";

export type CalendarDay = {
  key: string;
  short: string;
  dateNumber: string;
  fullDate: Date;
  isToday: boolean;
};

export function getStartOfWeek(date: Date): Date {
  const current = new Date(date);
  const day = current.getDay();

  let daysBack;

  if (day === 0) {
    daysBack = 6; // söndag → gå bak 6 dagar
  } else {
    daysBack = day - 1; // tisdag (2) → 1 dag bak
  }

  current.setDate(current.getDate() - daysBack);
  current.setHours(0, 0, 0, 0);

  return current;
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}

export function getWeekDays(date: Date): CalendarDay[] {
  const startOfWeek = getStartOfWeek(date);
  const today = new Date();
  const days: CalendarDay[] = [];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + i);

    days.push({
      key: currentDate.toISOString(),
      short: formatWeekday(currentDate),
      dateNumber: formatDayNumber(currentDate),
      fullDate: currentDate,
      isToday: isSameDay(today, currentDate),
    });
  }

  return days;
}
