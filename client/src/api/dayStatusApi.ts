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
  getByDate: async (date: string | Date) => {
    const dateStr = formatLocalYYYYMMDD(date);
    // FIXAT: Skicka med userId som en query-parameter (matchar [FromQuery] i C# om du har det där)
    return await apiClient.get<dayType | null>(
      `/day-status?date=${dateStr}&userId=1`
    );
  },

  /**
   * Sparar eller uppdaterar en dagsstatus (Upsert).
   */
  saveStatus: async (status: dayType) => {
    const cleanStatus = {
      ...status,
      userId: 1, // FIXAT: Garantera att userId följer med i bodyn till din POST
      day: formatLocalYYYYMMDD(status.day),
    };

    return await apiClient.post<dayType>("/day-status", cleanStatus);
  },

  /**
   * Hämtar alla dagsstatusar för den inloggade användaren.
   */
  getAllStatuses: async () => {
    // FIXAT: Skicka med userId till din /all-endpoint
    return await apiClient.get<dayType[]>("/day-status/all?userId=1");
  },
};
