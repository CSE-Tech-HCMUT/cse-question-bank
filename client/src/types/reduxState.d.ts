import { Department } from "./department"
import { Subject } from "./subject"
import { TagQuestion } from "./tagQuestion"

export export interface ReduxState<T> {
    createModalShow?: boolean,
    deleteModalShow?: boolean,
    editModalShow?: boolean,
    viewModalShow?: boolean,
    data?: T[],
    dataById?: T,

    // option
    relatedQuestions?: []

    // question
    pdfUrl?: string

    // pagination
}