import apiClient from "./apiClient";
import type { TemplateType } from "../types/TemplateType";

export const sessionTemplateApi = {
  // Hämta alla mallar för en användare
  getByUserId: (userId: number) =>
    apiClient.get<TemplateType[]>(`/sessiontemplate/user/${userId}`),
  // Skapa en ny mall
  create: (template: TemplateType) => {
    const dto = {
      id: template.id,
      name: template.name,
      folder: template.folder,
      sport: template.sport,
      description: template.description,
      creatorId: template.creatorId,
      minutesA1: template.zones.a1,
      minutesA2: template.zones.a2,
      minutesA3Minus: template.zones.a3Minus,
      minutesA3: template.zones.a3,
      minutesA3Plus: template.zones.a3Plus,
      isInterval: template.isInterval,
    };
    try {
      apiClient.post<TemplateType>("/sessiontemplate", dto);
    } catch (error) {
      console.error("Error creating template:", error);
      throw error; // Rethrow för att hantera det i UI:t
    }
    return;
  },
  // Uppdatera en mall
  update: (
    id: string,
    template: Partial<Omit<TemplateType, "id" | "createdAt" | "updatedAt">>,
  ) => apiClient.put<TemplateType>(`/sessiontemplate/${id}`, template),
  // Ta bort en mall
  delete: (id: string) => apiClient.delete(`/sessiontemplate/${id}`),
};
