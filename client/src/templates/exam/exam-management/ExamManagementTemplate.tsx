import PDFPreview from "@/components/pdf/PDFPreview";
import { RootState, useAppDispatch } from "@/stores"
import { previewPDFFileThunk } from "@/stores/exam/thunk";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux"


export const ExamManagementTemplate = () => {
    const dispatch = useAppDispatch();

    const { pdfUrl } = useSelector((state: RootState) => state.examReducer);

    // pdf
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const onClose = () => { 
    setIsModalOpen(false);
    }

    const handlePreviewPdf = (id: string) => {
        dispatch(previewPDFFileThunk(id)).then((actionResult) => {
            if (actionResult.meta.requestStatus === 'fulfilled') {
                setIsModalOpen(true);
            }
        })
    }

    useEffect(() => {
        handlePreviewPdf("86c03275-9845-42e6-b61c-7b0142bbbb8e")
    }, [])

    return (
        <>
            <PDFPreview urlPDF={pdfUrl} isModalOpen={isModalOpen} onClose={onClose} />
        </>
    )
}

export default ExamManagementTemplate