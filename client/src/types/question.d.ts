import { Answer } from "./answer"
import { Subject } from "./subject"
import { TagAssignment } from "./tagOption"

export type Question = {
    id?: string,
    content?: string,
    subQuestions?: Question[],
    tagAssignments?: TagAssignment[],
    type?: string,
    subjectId?: string,
    answer?: Answer[]
    subject?: Subject
    canShuffle?: boolean

    // block 
    isParent?: boolean,
    parentId?: string

    // auto
    numberOfDistractionAnswers?: number
}

export type QuestionFilter = {
    subjectId?: string,
    tagAssignments?: TagAssignment[]
}