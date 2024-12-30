import { Question } from "./question"
import { Subject } from "./subject"
import { TagAssignment } from "./tagOption"

export type Exam = {
    id?: string,
    semester?: string,
    subject?: Subject,
    numberQuestion?: number,
    totalQuestion?: number,
    filterConditions?: FilterCondition[],
    questions?: Question[],
    subjectId?: string,
}

export interface FilterCondition {
    id?: string
    numberQuestion?: number,
    expectCount?: number,
    tagAssignments?: TagAssignment[],
    questions?: Question[]
}