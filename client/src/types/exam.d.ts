import { Question } from "./question"
import { Subject } from "./subject"
import { TagAssignment } from "./tagOption"

export type Exam = {
    id?: string,
    name?: string,
    semester?: string,
    date?: Date,
    duration?: number,
    subject?: Subject,
    numberQuestion?: number,
    totalQuestion?: number,
    filterConditions?: FilterCondition[],
    questions?: Question[],
    subjectId?: string,
    questionIdList?: string[],
    examCode?: number

    shuffledExams?: Exam
}

export interface FilterCondition {
    id?: string
    numberQuestion?: number,
    expectCount?: number,
    tagAssignments?: TagAssignment[],
    questions?: Question[]
}

export type ShuffleExamReq = {
    examId: string
    isShuffleInsideQuestions: boolean,
    numberExams: number
}