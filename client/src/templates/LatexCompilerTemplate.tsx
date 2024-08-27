import { Col, Row } from "antd"
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-latex";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

import "ace-builds/src-noconflict/mode-text";

export const LatexCompilerTemplate = () => {
  return (
    <>
      <Row>
        <Col span={12}>
        <h2 className="mb-4">Code Editor</h2>
        <AceEditor
          placeholder="Question"
          mode="latex"
          theme="monokai"
          name="blah2"
          fontSize={14}
          lineHeight={19}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={``}
          setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
          }}
        />
        </Col>
        <Col span={12}>
          <div className="header">
            <h2 className="mb-4">Recompile</h2>

          </div>

        </Col>
      </Row>
    </>
  )
}

export default LatexCompilerTemplate