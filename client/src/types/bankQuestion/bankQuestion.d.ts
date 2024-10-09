import { Answer } from "../question/question"

export type BankQuestionState = {
  editModalShow: bool,
  deleteModalShow: bool,
  viewModalShow: bool,
  urlPDF: string,
  questionList: Question[],
}

export type Question = {
  id: string,
  content: string,
  type: string,
  isParent: boolean,
  parentId: string,
  tag: string,
  difficult: number,
  answer: Answer[],
}

export type QuestionInput = {
  content: string,
  type: string,
  isParent: boolean,
  tag: string,
  difficult: number,
  answer: Answer[],
}

export default BankQuestionState