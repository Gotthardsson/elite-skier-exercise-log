const weekdayFormatter = new Intl.DateTimeFormat("sv-SE", {
  weekday: "short",
});

export function formatWeekday(date: Date): string {
  return weekdayFormatter.format(date).replace(".", "").toUpperCase();
}

export function formatDayNumber(date: Date): string {
  return date.getDate().toString();
}
