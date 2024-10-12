import { Department } from "../department/department";
import { MainTag, SubTag } from "../tag/tag";
import { User } from "../user/user";

export type ModalProps = {
  isModalOpen: boolean,
  onClose: () => void,
  mainTag?: MainTag | undefined;
  subTag?: SubTag | undefined;
  user?: User | undefined
  department?: Department | undefined;
}

