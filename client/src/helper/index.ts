import { Jodit } from "jodit-react";

export const getTextFromHtml = (content: string | Node) => { 
    const textOnly = Jodit.modules.Helpers.stripTags(content);
    return textOnly;
}