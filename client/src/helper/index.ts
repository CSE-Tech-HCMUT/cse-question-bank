import { Jodit } from "jodit-react";

export const getTextFromHtml = (content: string | Node) => { 
    const textOnly = Jodit.modules.Helpers.stripTags(content);
    return textOnly;
}

export const getLatexFromHtml = (content: string | Node): string => {    
    const htmlString = typeof content === 'string' ? content : (content as HTMLElement).outerHTML;

    const latex = htmlString
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/<sup>(.*?)<\/sup>/g, '^{$1}')
        .replace(/<sub>(.*?)<\/sub>/g, '_{$1}')
        .replace(/<em>(.*?)<\/em>/g, '\\textit{$1}')
        .replace(/<strong>(.*?)<\/strong>/g, '\\textbf{$1}')
        .replace(/<h1>(.*?)<\/h1>/g, '\\section{$1}')
        .replace(/<h2>(.*?)<\/h2>/g, '\\subsection{$1}')
        .replace(/<h3>(.*?)<\/h3>/g, '\\subsubsection{$1}')
        .replace(/<ul>(.*?)<\/ul>/gs, '\\begin{itemize}$1\\end{itemize}')
        .replace(/<ol>(.*?)<\/ol>/gs, '\\begin{enumerate}$1\\end{enumerate}')
        .replace(/<li>(.*?)<\/li>/g, '\\item $1')
        .replace(/<img.*?src="(.*?)".*?alt="(.*?)".*?>/g, '\\includegraphics[width=\\linewidth]{$1}')
        .replace(/<a.*?href="(.*?)".*?>(.*?)<\/a>/g, '\\href{$1}{$2}')
        .replace(/<video.*?src="(.*?)".*?controls>(.*?)<\/video>/g, '\\video{$1}{$2}')
        .replace(/<audio.*?src="(.*?)".*?controls>(.*?)<\/audio>/g, '\\audio{$1}{$2}')
        .replace(/<p>(.*?)<\/p>/g, '$1\n\n');

    console.log(latex);
        

    return latex;
};
