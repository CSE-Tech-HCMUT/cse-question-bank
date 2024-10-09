export type MainTag = {
  id: string;
  name: string;
  createdUser: string;
  status: boolean;
  date: string;
}

export type SubTag = {
  id: string;
  name: string;
  description: string;
  option: string[];
  date: string;
}
