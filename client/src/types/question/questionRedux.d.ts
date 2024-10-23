import { Question } from "./question";

export type QuestionManagementState = {
  editModalShow: bool,
  deleteModalShow: bool,
  viewModalShow: bool,
  urlPDF: string,
  listOfQuestion: Question[],
}