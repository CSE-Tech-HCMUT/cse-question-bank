export type TagOption = {
    id?: number;
    name?: string;
    tagId?: number;
    startedTime?: string;
    updatedTime?: string;
}

export type TagAssignment = {
    id?: number,
    tagId?: number,
    optionId?: number
    option?: {
        id?: number,
        name?: string
    },
    tag?: {
        description?: string,
        id?: number,
        name?: string
    } 
}
  