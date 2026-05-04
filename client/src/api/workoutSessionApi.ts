import apiClient from "./apiClient";
import type { SessionType } from "../types/SessionType";

export const workoutSessionApi = {
  // Hämta alla pass för en användare
  getByUserId: (userId: number) =>
    apiClient.get<SessionType[]>(`/WorkoutSessions/user/${userId}`),

  // Skapa ett nytt pass
  create: (session: SessionType) => {
    // Här mappar vi om SessionType till exakt det format din C# DTO förväntar sig
    console.log("session innan DTO:", session);
    const dto = {
      scheduledDate: session.date,
      timeOfDay: session.timeOfDay,
      activityId: session.activityId,
      userId: session.userId,
      isLogged: session.isLogged,
      comment: session.description, // Planerad kommentar
      loggedComment: session.loggedComment, // Faktisk kommentar
      physicalRpe: session.feeling,
      mentalRpe: session.mentalRpe,

      // Nu mappar vi de två separata objekten
      plannedZones: {
        a1: session.plannedZones.a1,
        a2: session.plannedZones.a2,
        a3Minus: session.plannedZones.a3Minus,
        a3: session.plannedZones.a3,
        a3Plus: session.plannedZones.a3Plus,
        comp: session.plannedZones.comp,
      },
      actualZones: {
        a1: session.actualZones.a1,
        a2: session.actualZones.a2,
        a3Minus: session.actualZones.a3Minus,
        a3: session.actualZones.a3,
        a3Plus: session.actualZones.a3Plus,
        comp: session.actualZones.comp,
      },
    };

    return apiClient.post<SessionType>("/WorkoutSessions", dto);
  },
};
