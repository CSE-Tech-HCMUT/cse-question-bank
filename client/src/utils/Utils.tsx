import { InputBlockQuestion, InputSimpleQuestion } from "../types/question/inputQuestion";
import { BlockQuestion, SimpleQuestion } from "../types/question/question";

export const extractTextFromHtml = (html: string): string => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || '';
};

export const convertSimpleQuestionToInputSimpleQuestion = (simpleQuestion: SimpleQuestion): InputSimpleQuestion => {
  return {
    content: simpleQuestion.content,
    type: simpleQuestion.type,
    isParent: simpleQuestion.isParent,
    answer: simpleQuestion.answer.map((ans) => ({ 
      content: ans.content,
      isCorrect: ans.isCorrect
    }))
  }
}

export const convertBlockQuestionToInputBlockQuestion = (blockQuestion: BlockQuestion): InputBlockQuestion => { 
  return {
    content: blockQuestion.content,
    type: blockQuestion.type,
    isParent: blockQuestion.isParent,
    subQuestions: blockQuestion.subQuestions.map(convertSimpleQuestionToInputSimpleQuestion)
  }
}