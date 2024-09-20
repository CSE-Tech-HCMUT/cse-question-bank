import React, { useRef, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import '../style/style.scss'; 

interface MyEditorPlusProps {
  content: string;
  placeholder: string;
  onChange: (content: string) => void;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    [{ font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'] 
  ],
};

export const MyEditorPlus: React.FC<MyEditorPlusProps> = ({ content, placeholder, onChange }) => {
  const quillRef = useRef<ReactQuill | null>(null); 
  const [showToolbar, setShowToolbar] = useState(false);

  const handleFocus = () => setShowToolbar(true);
  const handleBlur = () => setShowToolbar(false);

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const toolbar = editor.root.parentNode?.querySelector('.ql-toolbar') as HTMLDivElement;

      if (toolbar) {
        toolbar.style.display = showToolbar ? 'block' : 'none'; // Use state to manage visibility
      }
    }
  }, [showToolbar]); // Run effect when showToolbar changes

  return (
    <div className="editor-container">
      <ReactQuill
        ref={quillRef}
        theme='snow'
        value={content}
        onChange={onChange}
        className='editor-input'
        modules={modules}
        placeholder={placeholder}
        style={{ zIndex: 1, width: '100%' }}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default MyEditorPlus;
