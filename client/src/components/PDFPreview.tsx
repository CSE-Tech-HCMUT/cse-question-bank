import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import '../style/style.scss'; 
import { Button } from 'antd';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PDFPreviewProps {
  urlPDF: string | undefined;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ urlPDF }) => {
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    console.log(numPages);
  }

  return (
    <div className="pdf-preview-container">
      {urlPDF ? (
        <Document file={urlPDF} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} renderAnnotationLayer={false} renderTextLayer={false} />
        </Document>
      ) : (
        <p className="no-pdf-message">No PDF available</p>
      )}
      <p className="page-info">
        Page {pageNumber} of {numPages}
      </p>
      <div className="navigation-buttons">
        <Button
          onClick={() => setPageNumber(pageNumber - 1)}
          disabled={pageNumber <= 1}
          className="nav-button md:text-[14px] text-[10px]"
        >
          Previous
        </Button>
        <Button
          onClick={() => setPageNumber(pageNumber + 1)}
          disabled={pageNumber >= (numPages ?? 1)}
          className="nav-button md:text-[14px] text-[10px]"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default PDFPreview;
