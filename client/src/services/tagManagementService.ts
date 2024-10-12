import { TagManagement } from "../types/tag/tag";
import apiInstance from "./apiInstance";

export const tagManagementService = {
  getAllTags: () => apiInstance.get<TagManagement[]>('/tags'),
  getTagById: (id: number) => apiInstance.get<TagManagement>(`/tags/${id}`),
  updateTagById: (id: number, payload: TagManagement) => apiInstance.put(`/tags/${id}`, payload),
  createTag: (payload: TagManagement) => apiInstance.post('/tags', payload),
  deleteTagById: (id: number) => apiInstance.delete(`/tags/${id}`)  
}