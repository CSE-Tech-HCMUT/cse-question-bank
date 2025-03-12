import { Answer } from "./answer"
import { Subject } from "./subject"
import { TagAssignment } from "./tagOption"

export type Question = {
    id?: string,
    content?: string,
    subQuestion?: Question[],
    tagAssignments?: TagAssignment[],
    type?: string,
    subjectId?: string,
    answer?: Answer[]
    subject?: Subject

    // block 
    isParent?: boolean,
    parentId?: string

    // auto
    numberOfDistractionAnswers?: number
}