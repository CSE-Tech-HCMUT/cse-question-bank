import { Option } from "../option/option";

export type TagManagement = {
  id?: number;
  name: string;
  description: string;
  options: Option[];
  date?: string;
}