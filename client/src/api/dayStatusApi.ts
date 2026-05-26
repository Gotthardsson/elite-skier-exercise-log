import apiClient from "./apiClient";
import type { dayType } from "../types/dayType";

// Hjälpfunktion för att göra om alla typer av datum till en säker lokal "YYYY-MM-DD"-sträng
const formatLocalYYYYMMDD = (date: Date | string): string => {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const dayStatusApi = {
  /**
   * Hämtar dagsstatus för ett specifikt datum.
   */
  getByDate: async (date: string | Date) => {
    const dateStr = formatLocalYYYYMMDD(date);
    return await apiClient.get<dayType | null>(`/day-status?date=${dateStr}`);
  },

  /**
   * Sparar eller uppdaterar en dagsstatus (Upsert).
   */
  saveStatus: async (status: dayType) => {
    // Säkra att datumet i objektet är en ren lokal sträng innan det skickas till .NET
    const cleanStatus = {
      ...status,
      day: formatLocalYYYYMMDD(status.day),
    };

    return await apiClient.post<dayType>("/day-status", cleanStatus);
  },

  /**
   * Hämtar alla dagsstatusar.
   */
  getAllStatuses: async () => {
    return await apiClient.get<dayType[]>("/day-status/all");
  },
};
