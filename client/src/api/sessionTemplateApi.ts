import apiClient from "./apiClient";
import type { TemplateType } from "../types/TemplateType";

export const sessionTemplateApi = {
  // Hämta alla mallar för en användare
  getByUserId: (userId: number) =>
    apiClient.get<TemplateType[]>(`/sessiontemplate/user/${userId}`),
  // Skapa en ny mall
  create: async (template: TemplateType) => {
    const dto = {
      Title: template.title,
      FolderId: template.folderId ? template.folderId : null,
      ActivityId: template.activityId,
      Description: template.description,
      CreatorId: template.creatorId,
      PlannedZones: {
         a1: template.plannedZones.a1,
         a2: template.plannedZones.a2,
         a3Minus: template.plannedZones.a3Minus,
         a3: template.plannedZones.a3,
         a3Plus: template.plannedZones.a3Plus,
         comp: template.plannedZones.comp,
      },
      IsInterval: template.isInterval,
    };
    try {
      return await apiClient.post<TemplateType>("/sessiontemplate", dto);
    } catch (error) {
      console.error("Error creating template:", error);
      throw error; // Rethrow för att hantera det i UI:t
    }
  },

  delete: async (templateId: number) => 
    apiClient.delete<TemplateType>(`/sessiontemplate/${templateId}`),

  update: async (template: TemplateType) => {
    const dto = {
      Id: template.id,
      Title: template.title,
      FolderId: template.folderId ? template.folderId : null,
      ActivityId: template.activityId,
      Description: template.description,
      CreatorId: template.creatorId,
      PlannedZones: {
         a1: template.plannedZones.a1,
         a2: template.plannedZones.a2,
         a3Minus: template.plannedZones.a3Minus,
         a3: template.plannedZones.a3,
         a3Plus: template.plannedZones.a3Plus,
         comp: template.plannedZones.comp,
      },
      IsInterval: template.isInterval,
    };
    try {
      return await apiClient.put<TemplateType>(`/sessiontemplate/${template.id}`, dto);
    } catch (error) {
      console.error("Error updating template:", error);
      throw error; // Rethrow för att hantera det i UI:t
    }
  }
};
