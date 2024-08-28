import { Button, Col, Row } from "antd"
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-latex";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

import "ace-builds/src-noconflict/mode-text";
import { useState } from "react";
import { useAppDispatch } from "../store";
import { exportPDFFileThunk } from "../store/latex-compiler/thunk";

export const LatexCompilerTemplate = () => {
  const [latexContent, setLatexContent] = useState('');
  const dispatch = useAppDispatch();

  return (
    <>
      <Row>
        <Col span={12}>
        <h2 className="mb-4 w-100">Code Editor</h2>
        <AceEditor
          placeholder="Question"
          mode="latex"
          name="blah2"
          fontSize={14}
          lineHeight={19}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={latexContent}
          setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
          }}
          onChange={(event) => {
            setLatexContent(event)
          }}
        />
        </Col>
        <Col span={12}>
          <div className="header">
            <Button onClick={() => {               
              dispatch(exportPDFFileThunk({
                latex_content: latexContent
              }))
            }}>
              <h2 className="mb-4">Recompile</h2>
            </Button>

          </div>

        </Col>
      </Row>
    </>
  )
}

export default LatexCompilerTemplate