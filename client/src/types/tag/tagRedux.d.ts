import { TagManagement } from "./tag"

export type TagManagementState = {
  createModalShow: boolean
  editModalShow: boolean,
  deleteModalShow: boolean,
  viewModalShow: boolean,
  listOfTags: TagManagement[]
}