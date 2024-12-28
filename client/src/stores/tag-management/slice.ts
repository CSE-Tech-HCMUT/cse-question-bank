import { ReduxState } from "@/types/reduxState";
import { createSlice } from "@reduxjs/toolkit";
import { createTagThunk, deleteTagThunk, getAllTagsThunk, getTagByIdThunk } from "./thunk";
import { Id, toast } from "react-toastify";
import { TagQuestion } from "@/types/tagQuestion";

const initialState: ReduxState<TagQuestion> = {
    createModalShow: false,
    deleteModalShow: false,
    editModalShow: false,
    viewModalShow: false,
    data: [],
    dataById: undefined,
}

let toastId: Id;

export const tagManagementSlice = createSlice({
    name: 'tagManagement',
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
            .addCase(getAllTagsThunk.fulfilled, (state, {payload}) => { 
                state.data = payload;
            })

            .addCase(createTagThunk.pending, () => {
                toastId = toast.loading("Đang thực hiện");
            })
            .addCase(createTagThunk.fulfilled, (state, {payload}) => {
                toast.dismiss(toastId);
                toast.success("Thêm nhãn thành công");
                state.createModalShow = false;
                state.data?.push(payload);
            })
            .addCase(createTagThunk.rejected, () => {
                toast.dismiss(toastId);
                toast.error("Thêm nhãn thất bại");
            })

            .addCase(getTagByIdThunk.fulfilled, (state, {payload}) => { 
                state.dataById = payload;
            })

            .addCase(deleteTagThunk.pending, () => {
                toastId = toast.loading("Đang thực hiện");
            })
            .addCase(deleteTagThunk.fulfilled, (state, {payload}) => {
                toast.dismiss(toastId);
                toast.success("Xóa nhãn thành công");
                state.data = state.data!.filter(item => item.id!== payload);
                state.deleteModalShow = false;
            })
            .addCase(deleteTagThunk.rejected, () => {
                toast.dismiss(toastId);
                toast.error("Xóa nhãn thất bại");
            })
    }
})

export const { reducer: tagManagementReducer, actions: tagManagementActions } = tagManagementSlice;