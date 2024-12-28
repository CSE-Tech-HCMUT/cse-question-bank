import React, { useState, useRef, useMemo, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import { useTranslation } from 'react-i18next';
import { getTextFromHtml } from '@/helper';

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

export const TextEditor: React.FC<JoditEditorProps> = ({ placeholder, onChange }) => {
    const { t } = useTranslation('text_editor');

    const editor = useRef<HTMLDivElement>(null);
    const [content, setContent] = useState('');
    const [showToolbar, setShowToolbar] = useState(false);

    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: placeholder || t("placeholder"),
            toolbar: showToolbar,
            minHeight: 100,
            height: 150,
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
    }, [editor])

    return (
        <div ref={editor} onClick={() => { setShowToolbar(true) }}>
            <JoditEditor
                className='w-full min-h-1'
                value={content}
                config={config}
                onBlur={(newContent) => {
                    setContent(getTextFromHtml(newContent))
                }}
                onChange={onChange}
            />
        </div>
    );
};

export default TextEditor;
