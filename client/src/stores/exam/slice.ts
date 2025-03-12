import { Exam } from "@/types/exam";
import { ReduxState } from "@/types/reduxState";
import { createSlice } from "@reduxjs/toolkit";
import { createExamThunk, editExamThunk, generateAutoExamThunk, getAllExamsThunk, previewPDFFileThunk } from "./thunk";
import { Id, toast } from "react-toastify";

const initialState: ReduxState<Exam> = {
    createModalShow: false,
    deleteModalShow: false,
    editModalShow: false,
    viewModalShow: false,
    data: [],
    dataById: undefined,
    pdfUrl: ""
}

let toastId: Id;

export const examSlice = createSlice({
    name: 'exam',
    initialState,
    reducers: {
        setCreateModalVisibility(state, action: { payload: boolean }){      
            state.createModalShow = action.payload;
          },
        setEditModalVisibility(state, action: { payload: boolean }){
            state.editModalShow = action.payload;
        },
        setDeleteModalVisibility(state, action: { payload: boolean }){
            state.deleteModalShow = action.payload;
        },
        setViewModalVisibility(state, action: { payload: boolean }){
            state.viewModalShow = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllExamsThunk.fulfilled, (state, {payload}) => {
                state.data = payload
            })

            .addCase(createExamThunk.fulfilled, (state, {payload}) => {
                state.data?.push(payload);
                state.createModalShow = false;
                toast.success("Chào mừng đến với trang tạo đề thi!");
            })
            .addCase(createExamThunk.rejected, () => {
                toast.error("Hệ thống đang quá tải! Bạn vui lòng thử lại");
            })

            .addCase(previewPDFFileThunk.fulfilled, (state, {payload}) => {
                toast.success("PDF được hiển thị");
                state.pdfUrl = payload;
            })
            .addCase(previewPDFFileThunk.rejected, () => {
                toast.error("Hệ thống đang quá tải! Bạn vui lòng thử lại");
            })

            .addCase(editExamThunk.pending, () => {
                toastId = toast.loading("Đang cập nhật dữ liệu...");
            })
            .addCase(editExamThunk.fulfilled, (state) => {
                toast.dismiss(toastId);
                state.editModalShow = false;
            })
            .addCase(editExamThunk.rejected, () => {
                toast.dismiss(toastId);
                toast.error("Cập nhật đề thi thất bại");
            })

            .addCase(generateAutoExamThunk.rejected, () => {
                toast.error("Tạo đề thi tự động thất bại");
            })
            .addCase(generateAutoExamThunk.fulfilled, (state, {payload}) => {
                toast.success("Tạo đề thi tự động thành công");
                state.data?.push(payload!);
                state.createModalShow = false;

            })
    }
})

export const { reducer: examReducer, actions: examActions } = examSlice;