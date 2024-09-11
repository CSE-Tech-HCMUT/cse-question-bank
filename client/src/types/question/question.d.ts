export type Answer = {
  id: string,
  content: string | null
}

export type SubQuestion = {
  id: string,
  content: string,
  type: string,
  tag: string,
  difficult: number,
  subQuestions: null,
  answer: Answer[]
}

export type Question = {
  id: string,
  content: string,
  type: string,
  tag: string,
  difficult: number,
  subQuestions: SubQuestion[],
  answer: null
}

