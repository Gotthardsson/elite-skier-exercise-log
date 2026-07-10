import apiClient from "./apiClient";
import type { UserType } from "../types/UserType";

export interface CurrentUser {
  id: number;
  role: "atlet" | "coach";
  coachId: number | null;
}

export const userApi = {
  getMe: () => apiClient.get<CurrentUser>("/user/me"),

  getUsersByCoachId: (coachId: number) =>
    apiClient.get<UserType[]>(`/user/coach/${coachId}`),

  createAthlete: async (athlete: Omit<UserType, "id">) => {
    const response = await apiClient.post<UserType>("/user", athlete);
    return response.data;
  },
};
