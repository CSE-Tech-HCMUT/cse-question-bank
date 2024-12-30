import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import '@/styles/pdf/PdfPreview.scss'; 
import { Button, Modal } from 'antd';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PDFPreviewProps {
  urlPDF: string | undefined;
  isModalOpen: boolean;
onClose: () => void;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ urlPDF, isModalOpen, onClose }) => {
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <Modal 
        title="Preview PDF"
        footer={null} 
        className="pdf-preview-container"
        open={isModalOpen}
        onCancel={onClose}
        style={{
            width: '612px',
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'flex',
            justifyContent: 'center',
        }}
    >
      {urlPDF ? (
        <Document className={"w-full"} file={urlPDF} onLoadSuccess={onDocumentLoadSuccess}>
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
          type='primary'
          onClick={() => setPageNumber(pageNumber - 1)}
          disabled={pageNumber <= 1}
          className="nav-button md:text-[14px] text-[10px]"
        >
          Trước
        </Button>
        <Button
          type='primary'
          onClick={() => setPageNumber(pageNumber + 1)}
          disabled={pageNumber >= (numPages ?? 1)}
          className="nav-button md:text-[14px] text-[10px]"
        >
          Sau
        </Button>
      </div>
    </Modal>
  );
};

export default PDFPreview;
