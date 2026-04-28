import apiClient from "./apiClient";
import type { Activity } from "../types/Activity";

export const getActivities = async (): Promise<Activity[]> => {
  const response = await apiClient.get<Activity[]>("/activities");
  return response.data;
};
