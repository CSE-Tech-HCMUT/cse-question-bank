import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-latex";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

import "ace-builds/src-noconflict/mode-text";

interface LatexEditor {
  content?: string;
  placeholder?: string;
  onChange?: (content: string) => void;
}

export const LatexEditor: React.FC<LatexEditor> = ({ content, placeholder, onChange }) => {
  return (
    <AceEditor
      height="100px"
      width="100%"
      placeholder={placeholder}
      mode="latex"
      name="blah2"
      fontSize={14}
      lineHeight={19}
      showPrintMargin={true}
      showGutter={true}
      highlightActiveLine={true}
      value={content}
      setOptions={{
      enableBasicAutocompletion: false,
      enableLiveAutocompletion: false,
      enableSnippets: false,
      showLineNumbers: true,
      tabSize: 2,
      }}
      onChange={(event) => {
        if(onChange){
          onChange(event)
        }
      }}
      style={{ flex: 1, marginRight: 8  }}
    />
  )
}

export default LatexEditor