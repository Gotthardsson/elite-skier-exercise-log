import apiClient from "./apiClient";
import type { dayType } from "../types/dayType";

const formatLocalYYYYMMDD = (date: Date | string): string => {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const dayStatusApi = {
  /**
   * Hämtar dagsstatus för ett specifikt datum och en specifik användare.
   */
  getByDate: async (date: string | Date, userId: number) => {
    // <-- NYTT: Ta emot userId här
    const dateStr = formatLocalYYYYMMDD(date);

    // DYNAMISKT: Skicka med det inskickade userId istället för =1
    return await apiClient.get<dayType | null>(
      `/day-status?date=${dateStr}&userId=${userId}`
    );
  },

  /**
   * Sparar eller uppdaterar en dagsstatus (Upsert).
   */
  saveStatus: async (status: dayType, userId: number) => {
    // <-- NYTT: Ta emot userId här
    const cleanStatus = {
      ...status,
      userId: userId, // DYNAMISKT: Sätt den aktiva användarens id i bodyn
      day: formatLocalYYYYMMDD(status.day),
    };

    return await apiClient.post<dayType>("/day-status", cleanStatus);
  },

  /**
   * Hämtar alla dagsstatusar för en viss användare.
   */
  getAllStatuses: async (userId: number) => {
    // FIXAT: Ändrat från " till ` runt hela URL-strängen
    return await apiClient.get<dayType[]>(`/day-status/all?userId=${userId}`);
  },
};
