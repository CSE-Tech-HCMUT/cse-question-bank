import { MainTag, SubTag } from "../tag/tad";

export type ModalProps = {
  isModalOpen: boolean,
  onClose: () => void,
  mainTag?: MainTag | undefined;
  subTag?: SubTag | undefined;
  user?: User | undefined
}

