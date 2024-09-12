import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Bold, ClassicEditor, Essentials, Italic, Paragraph } from "ckeditor5";
import { useEffect, useRef, useState } from "react";

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';

interface MyEditorPlusProps {
  content: string;
  placeholder: string;
  onChange: (content: string) => void;
}

export const MyEditorPlus: React.FC<MyEditorPlusProps> = ({ content, placeholder, onChange }) => {
  const editorToolbarRef = useRef<HTMLDivElement | null>(null);
  const [isToolbarVisible, setToolbarVisible] = useState(false);

  const handleEditorChange = (editor: ClassicEditor) => { 
    const data = editor.getData();
    onChange(data);
  }

  useEffect(() => {
    return () => {
      setToolbarVisible(false);
    };
  }, []);

  return (
    <div className="MyEditorPlus">
      <div 
        ref={editorToolbarRef}
        style={{ 
          display: isToolbarVisible ? 'block' : 'none',
        }}
      ></div>
      <div>
        <CKEditor
          editor={ ClassicEditor }
          data={content}
          config={{
            placeholder: {placeholder},
            plugins: [Bold, Italic, Paragraph, Essentials, Paragraph],
            toolbar: ['paragraph', 'undo', 'redo', '|', 'bold', 'italic']
          }}
          onReady={(editor) => {
            const toolbarElement = editorToolbarRef.current;
            if (toolbarElement) {
              toolbarElement.appendChild(editor.ui.view.toolbar.element!);
            }
          }}
          onChange={(_event, editor) => handleEditorChange(editor)}
          onFocus={() => {
            setToolbarVisible(true); 
          }}
          onBlur={() => {
            setToolbarVisible(false); 
          }}
          onAfterDestroy={() => {
            setToolbarVisible(false); 
          }}
        />
      </div>
    </div>
  );
};

export default MyEditorPlus;
