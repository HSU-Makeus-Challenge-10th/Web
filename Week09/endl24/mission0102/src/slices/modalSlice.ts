import { createSlice } from "@reduxjs/toolkit";

export interface modalState {
  isOpen: boolean;
}
const initialState: modalState = {
  isOpen: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal:(state)=>{
        state.isOpen = true;
    },
    closeModal:(state)=>{
        state.isOpen = false;
    }
  },
});

export const {openModal, closeModal}=modalSlice.actions;

const modalReducer = modalSlice.reducer;

export default modalReducer;
