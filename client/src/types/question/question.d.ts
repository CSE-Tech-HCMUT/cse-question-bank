import { TagManagement } from "../tag/tag"
import { User } from "../user/user"

export type Answer = {
  id: string,
  content: string | null,
  isCorrect?: boolean
}

export type Question = {
  id: string,
  content: string,
  type: string,
  tags: TagManagement[] | [],
  isParent: false,
  answer: Answer[] | [],
  date?: string,
  userPreview: User[] | []
}

export type BlockQuestion = {
  id: string,
  content: string,
  type: string,
  tags: TagManagement[] | [],
  isParent: true,
  subQuestions: Question[],
  answer: Answer,
  date?: string
  userPreview: User[] | []
}

