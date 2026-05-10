export interface WorkoutSessionFromApi {
  id: number;
  userId: number;
  activityId: number;
  scheduledDate: string;
  timeOfDay: string;
  isLogged: boolean;
  comment: string | null;
  loggedComment: string | null;
  physicalRpe: number | null;
  mentalRpe: number | null;
  avgHeartRate: number | null;
  // De platta fälten från EF Core / Postgres
  tizA1Planned: number;
  tizA2Planned: number;
  tizA3MinusPlanned: number;
  tizA3Planned: number;
  tizA3PlusPlanned: number;
  tizCompPlanned: number;
  tizA1Actual: number;
  tizA2Actual: number;
  tizA3MinusActual: number;
  tizA3Actual: number;
  tizA3PlusActual: number;
  tizCompActual: number;
}
