import apiClient from "./apiClient";
import type { FolderType } from "../types/FolderType";

export const folderApi = {
  getByUserId: (userId: number) =>
    apiClient.get<FolderType[]>(`/folder/user/${userId}`),

  create: async (folder: Omit<FolderType, "id">) => {
    const response = await apiClient.post<FolderType>("/folder", folder);
    return response.data;
  },

  update: async (folderId: number, folder: FolderType) => {
    const response = await apiClient.put<FolderType>(`/folder/${folderId}`, folder);
    return response.data;
  },

  delete: async (folderId: number) => apiClient.delete(`/folder/${folderId}`),
};
