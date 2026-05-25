import apiClient from "./apiClient";
import type { UserType } from "../types/UserType";

export const userApi = {
  getAllUsers: () => apiClient.get<UserType[]>("/user"),

  getUsersByCoachId: (coachId: number) =>
    apiClient.get<UserType[]>(`/user/coach/${coachId}`),

  createAthlete: async (athlete: Omit<UserType, "id">) => {
    const response = await apiClient.post<UserType>("/user", athlete);
    return response.data;
  },
};
