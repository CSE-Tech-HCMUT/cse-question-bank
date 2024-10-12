import { Option } from "../option/option";

export type MainTag = {
  id: string;
  name: string;
  createdUser: string;
  status: boolean;
  date: string;
}

export type SubTag = {
  id: number;
  name: string;
  description: string;
  option: Option[];
  date?: string;
}
