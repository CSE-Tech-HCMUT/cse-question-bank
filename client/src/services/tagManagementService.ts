import { TagManagement } from "../types/tag/tag";
import apiInstance from "./apiInstance";

export const tagManagementService = {
  getAllTags: () => apiInstance.get('/tags/'),
  getTagById: (id: number) => apiInstance.get(`/tags/${id}`),
  updateTagById: (payload: TagManagement) => apiInstance.put(`/tags/${payload.id}`, payload),
  createTag: (payload: TagManagement) => apiInstance.post('/tags', payload),
  deleteTagById: (id: number) => apiInstance.delete(`/tags/${id}`)  
}