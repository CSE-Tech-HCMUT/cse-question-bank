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
    questionIdList?: string[]
}

export interface FilterCondition {
    id?: string
    numberQuestion?: number,
    expectCount?: number,
    tagAssignments?: TagAssignment[],
    questions?: Question[]
}