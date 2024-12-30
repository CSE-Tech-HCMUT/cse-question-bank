import { ReduxState } from "@/types/reduxState";
import { createSlice } from "@reduxjs/toolkit";
import { Question } from "@/types/question";
import { createQuestionThunk, deleteQuestionThunk, editQuestionThunk, getAllQuestionsThunk, getQuestionByIdThunk, previewPDFFileThunk } from "./thunk";
import { Id, toast } from "react-toastify";

const initialState: ReduxState<Question> = {
    createModalShow: false,
    deleteModalShow: false,
    editModalShow: false,
    viewModalShow: false,
    data: [],
    dataById: undefined,
    pdfUrl: ""
}

let toastId: Id;

export const questionSlice = createSlice({
    name: 'question',
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
            .addCase(getAllQuestionsThunk.fulfilled, (state, {payload}) => { 
                state.data = payload;
            })

            .addCase(createQuestionThunk.fulfilled, (state, {payload}) => {
                state.data?.push(payload);
                state.createModalShow = false;
                toast.success("Chào mừng đến với trang tạo câu hỏi!");
                state.dataById = payload;
            })  
            .addCase(createQuestionThunk.rejected, () => {
                toast.error("Hệ thống đang quá tải! Bạn vui lòng thử lại");
            })  

            .addCase(getQuestionByIdThunk.fulfilled, (state, {payload}) => {
                state.dataById = payload;
            })

            .addCase(editQuestionThunk.pending, () => {
                toastId = toast.loading("Đang thực hiện");
            })
            .addCase(editQuestionThunk.fulfilled, (state) => {
                toast.dismiss(toastId);
                toast.success("Cập nhật câu hỏi thành công");
                state.editModalShow = false;
            })
            .addCase(editQuestionThunk.rejected, () => {
                toast.dismiss(toastId);
                toast.error("Cập nhật câu hỏi thất bại");
            })

            .addCase(deleteQuestionThunk.pending, () => {
                toastId = toast.loading("Đang thực hiện");
            })
            .addCase(deleteQuestionThunk.fulfilled, (state, {payload}) => {
                toast.dismiss(toastId);
                toast.success("Xóa câu hỏi thành công");
                state.data = state.data!.filter(item => item.id!== payload);
                state.deleteModalShow = false;
            })
            .addCase(deleteQuestionThunk.rejected, () => {
                toast.dismiss(toastId);
                toast.error("Xóa câu hỏi thất bại");
            })

            .addCase(previewPDFFileThunk.fulfilled, (state, {payload}) => {
                toast.success("PDF được hiển thị");
                state.pdfUrl = payload;
            })
            .addCase(previewPDFFileThunk.rejected, () => {
                toast.error("Hệ thống đang quá tải! Bạn vui lòng thử lại");
            })
    }
})

export const { reducer: questionReducer, actions: questionActions } = questionSlice;