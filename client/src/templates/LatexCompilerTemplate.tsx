import { Button, Col, Row } from "antd";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-latex";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import { useState, useCallback } from "react";
import { RootState, useAppDispatch } from "../store";
import { exportPDFFileThunk } from "../store/latex-compiler/thunk";
import { useSelector } from "react-redux";
import { Document, pdfjs } from "react-pdf";
import PDFPreview from "../utils/PDFPreview";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const LatexCompilerTemplate = () => {
  const [latexContent, setLatexContent] = useState('');
  const { urlPDF } = useSelector((state: RootState) => state.compileLatexReducer);
  const dispatch = useAppDispatch();

  const handleRecompile = useCallback(async () => {
    await dispatch(exportPDFFileThunk({ latex_content: latexContent }));
  }, [dispatch, latexContent]);


  return (
    <>
      <Row>
        <Col span={12}>
          <h2 className="mb-4 w-100">Code Editor</h2>
          <AceEditor
            placeholder="Question"
            mode="latex"
            name="latex-editor"
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
            onChange={(newValue) => {
              setLatexContent(newValue);
            }}
          />
        </Col>
        <Col span={12}>
          <div className="header">
            <Button onClick={handleRecompile}>
              <h2 className="mb-4">Recompile</h2>
            </Button>
            <PDFPreview urlPDF={urlPDF} ></PDFPreview>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default LatexCompilerTemplate;
