import React, { useState, useRef, useMemo, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import { useTranslation } from 'react-i18next';
import { getLatexFromHtml, getTextFromHtml } from '@/helper';
import 'mathjax/es5/tex-mml-chtml.js';

interface JoditEditorProps {
    placeholder?: string;
    onChange?: (content: string) => void;
    value?: string;
    config?: any; 
}

interface UploadResponse {
    files: any; 
    path: string;
    baseurl: string;
    error?: string;
}

declare global {
    interface Window {
        MathJax: any;
    }
}

export const TextEditor: React.FC<JoditEditorProps> = ({ placeholder, onChange, value }) => {
    const { t } = useTranslation('text_editor');

    const editor = useRef<HTMLDivElement>(null);
    const [content, setContent] = useState(value || '');
    const [showToolbar, setShowToolbar] = useState(false);

    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: placeholder || t("placeholder"),
            toolbar: showToolbar,
            minHeight: 100,
            height: 150,
            buttons: [
                'bold', 'italic', 'underline', 'superscript', 'subscript', 'eraser', '|', 'ul', 'ol', 'outdent', 'indent', 'font', 'fontsize', 'paragraph', '|', 'image', 'table', 'link', '|', 'hr', 'symbol', 'fullsize', '|', 'source', '|', {
                    name: 'MathType',
                    exec: function (editor: any) {
                        const mathML = '<span>\\( n^2 \\)</span>';
                        editor.selection.insertHTML(mathML);
                        if (window.MathJax) {
                            window.MathJax.typeset();
                        }
                    },
                    tooltip: 'Insert Math Formula'
                }
            ],
            uploader: {
                insertImageAsBase64URI: true,
                url: '/upload', 
                format: 'json',
                method: 'POST',
                prepareData: (formdata: FormData): FormData => {
                    return formdata;
                },
                isSuccess: (resp: UploadResponse): boolean => {
                    return !resp.error;
                },
                getMsg: (resp: UploadResponse): string | undefined => {
                    return resp.error;
                },
                process: (resp: UploadResponse): UploadResponse => {
                    return {
                        files: resp.files,
                        path: resp.path,
                        baseurl: resp.baseurl,
                        error: resp.error
                    };
                }
            },
            filebrowser: {
                ajax: {
                    url: '/files' 
                }
            }
        }),
        [placeholder, showToolbar]
    );

    useEffect(() => { 
        const handleClickOutside = (event: MouseEvent) => {
            if (editor.current && !editor.current.contains(event.target as Node)) { 
                setShowToolbar(false); 
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => { 
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [editor]);

    const updateMathJax = () => {
        if (window.MathJax) {
            window.MathJax.typeset();
        }
    };

    useEffect(() => {
        updateMathJax();
    }, [content]);

    return (
        <div ref={editor} onClick={() => { setShowToolbar(true) }}>
            <JoditEditor
                className='w-full min-h-1'
                value={content}
                config={config}
                onBlur={(newContent) => {
                    setContent(getTextFromHtml(newContent));
                    // setContent(getLatexFromHtml(newContent));
                    if (onChange) {
                        onChange(newContent);
                    }
                    updateMathJax();
                }}
                onChange={(newContent) => {
                    setContent(newContent);
                    if (onChange) {
                        onChange(newContent);
                    }
                }}
            />
        </div>
    );
};

export default TextEditor;
