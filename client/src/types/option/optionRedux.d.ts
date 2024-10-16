import { Option } from "./option";

export type OptionState = {
  createModalShow: boolean
  editModalShow: boolean,
  deleteModalShow: boolean,
  viewModalShow: boolean,
  listOfOptions: Option[];
}