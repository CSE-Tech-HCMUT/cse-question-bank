import { Exam } from "@/types/exam";
import { ReduxState } from "@/types/reduxState";
import { createSlice } from "@reduxjs/toolkit";
import { createExamThunk, deleteExamThunk, editExamThunk, filterExamThunk, generateAutoExamThunk, getAllExamsThunk, getExamByIdThunk, previewPDFFileThunk, shuffleExamThunk } from "./thunk";
import { Id, toast } from "react-toastify";

const initialState: ReduxState<Exam> = {
    createModalShow: false,
    deleteModalShow: false,
    editModalShow: false,
    viewModalShow: false,
    shuffleModalShow: false,
    data: [],
    dataById: undefined,
    dataFilterList: [],
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
        setShuffleModalVisibility(state, action: { payload: boolean }){
            state.shuffleModalShow = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllExamsThunk.fulfilled, (state, {payload}) => {
                state.data = payload
            })

            .addCase(getExamByIdThunk.fulfilled, (state, {payload}) => {
                state.dataById = payload
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

            .addCase(deleteExamThunk.fulfilled, (state, {payload}) => {
                toast.dismiss(toastId);
                toast.success("Xóa đề thi thành công");
                console.log(payload);
                
                state.data = state.data!.filter(item => item.id!== payload);
                state.deleteModalShow = false;
            })

            .addCase(generateAutoExamThunk.rejected, () => {
                toast.error("Tạo đề thi tự động thất bại");
            })
            .addCase(generateAutoExamThunk.fulfilled, (state, {payload}) => {
                toast.success("Tạo đề thi tự động thành công");
                state.data?.push(payload!);
                state.createModalShow = false;

            })

            .addCase(filterExamThunk.fulfilled, (state, {payload}) => {
                toast.success("Dach sách các câu hỏi được lọc thành công");
                if(payload){
                    state.dataFilterList = payload;
                    console.log(state.dataFilterList);
                }
            })
            .addCase(filterExamThunk.rejected, () => {
                toast.error("Danh sách câu hỏi không tìm thấy");
            })

            .addCase(shuffleExamThunk.fulfilled, (state, {payload}) => {
                toast.success("Trộn đề thi thành công");
            })
            .addCase(shuffleExamThunk.rejected, () => {
                toast.error("Trộn đề thi thất bại");
            })
    }
})

export const { reducer: examReducer, actions: examActions } = examSlice;