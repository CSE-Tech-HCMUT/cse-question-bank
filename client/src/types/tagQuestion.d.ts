import { TagOption } from './tagOption';

export type TagQuestion = {
    id?: number;
    name?: string;
    description?: string;
    options?: TagOption[];
    subject?: {
        id?: string;
        name?: string;
        code?: string;
        department?: {
            code?: string;
            name?: string;
        }
    };
    subjectId?: string;
    startedTime?: string;
    updatedTime?: string;
}


