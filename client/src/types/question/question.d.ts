export type Answer = {
  id: string,
  content: string | null,
  isCorrect: boolean
}

export type SimpleQuestion = {
  id: string,
  content: string,
  type: 'multiple-choice',
  tag: string,
  difficult: number,
  isParent: false,
  answer: Answer[]
}

export type BlockQuestion = {
  id: string,
  content: string,
  type: 'multiple-choice',
  tag: string,
  difficult: number,
  isParent: true,
  subQuestions: SimpleQuestion[]
}

