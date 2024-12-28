import { Department } from "./department";
import { TagOption } from "./tagOption";

export type Subject = {
    id?: string,
    name?: string,
    code?: string,
    tags?: TagOption[],
    department?: Department
    startedTime?: string;
    updatedTime?: string;
}