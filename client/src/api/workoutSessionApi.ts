import apiClient from "./apiClient";
import type { SessionType } from "../types/SessionType";

export const workoutSessionApi = {
  // Hämta alla pass för en användare
  getByUserId: async (userId: number) => {
    const response = await apiClient.get<any[]>(
      `/WorkoutSessions/user/${userId}`
    );

    const mappedData: SessionType[] = response.data.map((s) => ({
      id: s.id,
      userId: s.userId,
      activityId: s.activityId,
      scheduledDate: s.scheduledDate,
      timeOfDay: s.timeOfDay,
      isLogged: s.isLogged,
      comment: s.comment || "",
      loggedComment: s.loggedComment || "",
      feeling: s.physicalRpe ?? 5,
      mentalRpe: s.mentalRpe ?? 5,
      avgHeartRate: s.avgHeartRate ?? 0,
      stravaRaw: s.stravaRaw,

      // Om din DTO skickar objekt, mappar vi så här:
      plannedZones: {
        a1: s.plannedZones?.a1 ?? 0,
        a2: s.plannedZones?.a2 ?? 0,
        a3Minus: s.plannedZones?.a3Minus ?? 0,
        a3: s.plannedZones?.a3 ?? 0,
        a3Plus: s.plannedZones?.a3Plus ?? 0,
        comp: s.plannedZones?.comp ?? 0,
      },
      actualZones: {
        a1: s.actualZones?.a1 ?? 0,
        a2: s.actualZones?.a2 ?? 0,
        a3Minus: s.actualZones?.a3Minus ?? 0,
        a3: s.actualZones?.a3 ?? 0,
        a3Plus: s.actualZones?.a3Plus ?? 0,
        comp: s.actualZones?.comp ?? 0,
      },
    }));

    return { ...response, data: mappedData };
  },

  // Skapa ett nytt pass
  create: (session: SessionType) => {
    // Här mappar vi om SessionType till exakt det format din C# DTO förväntar sig
    console.log("session innan DTO:", session);
    const dto = {
      scheduledDate: session.scheduledDate,
      timeOfDay: session.timeOfDay,
      activityId: session.activityId,
      userId: session.userId,
      isLogged: session.isLogged,
      comment: session.comment, // Planerad kommentar
      loggedComment: session.loggedComment, // Faktisk kommentar
      physicalRpe: session.feeling,
      mentalRpe: session.mentalRpe,
      avgHeartRate: session.avgHeartRate,

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

  delete: (id: number) => {
    return apiClient.delete(`/WorkoutSessions/${id}`);
  },

  update: (id: number, session: SessionType) => {
    console.log(session);
    const dto = {
      id: id,
      scheduledDate: session.scheduledDate,
      timeOfDay: session.timeOfDay,
      activityId: session.activityId,
      userId: session.userId,
      isLogged: session.isLogged,
      comment: session.comment, // Planerad kommentar
      loggedComment: session.loggedComment, // Faktisk kommentar
      physicalRpe: session.feeling,
      mentalRpe: session.mentalRpe,
      avgHeartRate: session.avgHeartRate,

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
    return apiClient.put<SessionType>(`/WorkoutSessions/${id}`, dto);
  },
};
