import React from "react";
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
  return (
    <div className="editor-container">
      <ReactQuill
        theme='snow'
        value={content}
        onChange={onChange}
        className='editor-input'
        modules={modules}
        placeholder={placeholder}
        style={{ zIndex: 1, width: '100%' }}
      />
    </div>
  );
};

export default MyEditorPlus;
