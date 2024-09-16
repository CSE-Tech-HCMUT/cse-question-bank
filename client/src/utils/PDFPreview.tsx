// import { useState } from 'react'
import { Document, Page } from 'react-pdf'

interface PDFPreviewProps {
  urlPDF: string | undefined
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ urlPDF }) => {
  // const [numPages, setNumPages] = useState<number | undefined>(undefined);
  // const [pageNumber, setPageNumber] = useState<number>(1)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    // setNumPages(numPages);
    console.log(numPages)
  }

  return (
    <div>
      {urlPDF ? (
        <Document file={urlPDF} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={1} renderAnnotationLayer={false} renderTextLayer={false} />
        </Document>
      ) : (
        <p>No PDF available</p>
      )}
      {/* <p>
        Page {pageNumber} of {numPages}
      </p>
      <div>
        <button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber <= 1}>
          Previous
        </button>
        <button onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber >= (numPages ?? 1)}>
          Next
        </button>
      </div> */}
    </div>
  )
}

export default PDFPreview
