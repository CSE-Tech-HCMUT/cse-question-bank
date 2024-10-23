import { Department } from "../department/department";
import { Option } from "../option/option";
import { Question } from "../question/question";
import { TagManagement } from "../tag/tag";
import { User } from "../user/user";

export type ModalProps = {
  isModalOpen: boolean
  onClose: () => void
  tag?: TagManagement | undefined
  user?: User | undefined
  department?: Department | undefined
  option?: Option | undefined
  question?: Question
}

