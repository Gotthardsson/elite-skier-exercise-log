import apiClient from "./apiClient";
import type { TemplateType } from "../types/TemplateType";

export const sessionTemplateApi = {
  // Hämta alla mallar för en användare
  getByUserId: (userId: number) =>
    apiClient.get<TemplateType[]>(`/sessiontemplate/user/${userId}`),
  // Skapa en ny mall
  create: (template: TemplateType) => {
    const dto = {
      Id: template.id,
      Title: template.title,
      FolderId: template.folderId,
      ActivityId: template.activityId,
      Description: template.description,
      CreatorId: template.creatorId,
      PlannedZones: {
         a1: template.zones.a1,
         a2: template.zones.a2,
         a3Minus: template.zones.a3Minus,
         a3: template.zones.a3,
         a3Plus: template.zones.a3Plus,
         comp: template.zones.comp,
      },
      IsInterval: template.isInterval,
    };
    try {
      apiClient.post<TemplateType>("/sessiontemplate", dto);
    } catch (error) {
      console.error("Error creating template:", error);
      throw error; // Rethrow för att hantera det i UI:t
    }
    return;
  },
      
};
