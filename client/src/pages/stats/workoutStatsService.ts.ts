import type { SessionType } from "../../types/SessionType";
import type { Activity } from "../../types/Activity";

// 1. Inställningar för säsongsstarter
const SEASON_MAP: Record<string, string> = {
  "26/27": "2026-04-20",
  "25/26": "2025-04-21",
  "24/25": "2024-04-22",
};

const getSeasonStart = (seasonString: string): Date => {
  const dateStr = SEASON_MAP[seasonString] || SEASON_MAP["26/27"];
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d;
};

// 2. Privata hjälpfunktioner för formatering och beräkning
const formatTime = (totalMin: number) => ({
  hours: Math.floor(totalMin / 60),
  minutes: totalMin % 60,
  totalMinutes: totalMin,
  formatted: `${Math.floor(totalMin / 60)}h ${totalMin % 60}m`,
});
const getTotalTime = (sessions: SessionType[]) => {
  let loggedMin = 0;
  let plannedMin = 0;

  sessions.forEach((s) => {
    // 1. Summera planerad tid (alltid från plannedZones)
    if (s.plannedZones) {
      plannedMin += Object.values(s.plannedZones).reduce(
        (a, b) => a + (b || 0),
        0
      );
    }

    // 2. Summera loggad tid (endast om passet är genomfört, från actualZones)
    if (s.isLogged && s.actualZones) {
      loggedMin += Object.values(s.actualZones).reduce(
        (a, b) => a + (b || 0),
        0
      );
    }
  });

  return {
    logged: formatTime(loggedMin),
    planned: formatTime(plannedMin),
    diff: formatTime(loggedMin - plannedMin),
  };
};

const getTiz = (sessions: SessionType[]) => {
  const sums = { a1: 0, a2: 0, a3Minus: 0, a3: 0, a3Plus: 0, comp: 0 };
  sessions.forEach((s) => {
    if (s.isLogged) {
      sums.a1 += s.actualZones.a1 || 0;
      sums.a2 += s.actualZones.a2 || 0;
      sums.a3Minus += s.actualZones.a3Minus || 0;
      sums.a3 += s.actualZones.a3 || 0;
      sums.a3Plus += s.actualZones.a3Plus || 0;
      sums.comp += s.actualZones.comp || 0;
    }
  });

  return [
    { zone: "A1", minutes: sums.a1 },
    { zone: "A2", minutes: sums.a2 },
    { zone: "A3-", minutes: sums.a3Minus },
    { zone: "A3", minutes: sums.a3 },
    { zone: "A3+", minutes: sums.a3Plus },
    { zone: "Tävling", minutes: sums.comp },
  ];
};

const getTimePerSport = (sessions: SessionType[], activities: Activity[]) => {
  const sports: Record<number, number> = {};
  sessions.forEach((s) => {
    if (s.isLogged) {
      const time = Object.values(s.actualZones).reduce((a, b) => a + b, 0);
      sports[s.activityId] = (sports[s.activityId] || 0) + time;
    }
  });

  return Object.entries(sports)
    .map(([id, time]) => {
      const activityName =
        activities.find((a) => a.id === Number(id))?.name || "Okänd";
      return { sport: activityName, minutes: time };
    })
    .sort((a, b) => b.minutes - a.minutes);
};

const assembleStats = (sessions: SessionType[], activities: Activity[]) => ({
  total: getTotalTime(sessions),
  tiz: getTiz(sessions),
  sports: getTimePerSport(sessions, activities),
});

const getTrainingDateContext = (
  dateInput: string | Date,
  seasonStart: Date
) => {
  const date = new Date(dateInput);
  date.setHours(0, 0, 0, 0);

  const diffTime = date.getTime() - seasonStart.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0 || diffDays >= 364) return null;

  const dayInSeason = diffDays + 1;
  const weekInSeason = Math.ceil(dayInSeason / 7);
  const period = Math.ceil(weekInSeason / 4);
  const weekInPeriod = ((weekInSeason - 1) % 4) + 1;

  return { period, weekInSeason, weekInPeriod };
};

// 3. Publika metoder
export const getStatsForSeason = (
  sessions: SessionType[],
  activities: Activity[],
  seasonString: string
) => {
  const startDate = getSeasonStart(seasonString);
  const seasonEnd = new Date(startDate);
  seasonEnd.setDate(seasonEnd.getDate() + 363);

  const filtered = sessions.filter((s) => {
    const d = new Date(s.scheduledDate);
    return d >= startDate && d <= seasonEnd;
  });

  return assembleStats(filtered, activities);
};

export const getStatsForPeriod = (
  sessions: SessionType[],
  activities: Activity[],
  periodNr: number,
  seasonString: string
) => {
  const startDate = getSeasonStart(seasonString);

  const filtered = sessions.filter((s) => {
    const context = getTrainingDateContext(s.scheduledDate, startDate);
    return context?.period === periodNr;
  });

  return assembleStats(filtered, activities);
};

export const getStatsYearToDate = (
  sessions: SessionType[],
  activities: Activity[],
  seasonString: string
) => {
  const startDate = getSeasonStart(seasonString);
  const now = new Date();

  const filtered = sessions.filter((s) => {
    const d = new Date(s.scheduledDate);
    return d >= startDate && d <= now;
  });

  return assembleStats(filtered, activities);
};

export const getStatsForWeekInPeriod = (
  sessions: SessionType[],
  activities: Activity[],
  periodNr: number,
  weekInPeriodNr: number,
  seasonString: string
) => {
  const startDate = getSeasonStart(seasonString);

  const filtered = sessions.filter((s) => {
    const context = getTrainingDateContext(s.scheduledDate, startDate);
    return (
      context?.period === periodNr && context?.weekInPeriod === weekInPeriodNr
    );
  });

  return assembleStats(filtered, activities);
};

export const getAllTimeStats = (
  sessions: SessionType[],
  activities: Activity[]
) => {
  return assembleStats(sessions, activities);
};
