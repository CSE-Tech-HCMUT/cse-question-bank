export type InputAnswer = {
  content: string;
  isCorrect: boolean;
}

export type InputSimpleQuestion = {
  content: string;
  type: 'multiple-choice'; 
  isParent: false;
  answer: Answer[];
}

export type InputBlockQuestion = {
  content: string;
  type: 'multiple-choice'; 
  isParent: true;
  subQuestions: SubQuestion[];
}