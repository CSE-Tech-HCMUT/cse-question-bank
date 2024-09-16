export type InputAnswer = {
  content: string;
  isCorrect: boolean;
}

export type InputSimpleQuestion = {
  content: string;
  type: 'mutilple-choice'; 
  isParent: false;
  answer: Answer[];
}

export type InputBlockQuestion = {
  content: string;
  type: 'mutilple-choice'; 
  isParent: true;
  subQuestions: SubQuestion[];
}