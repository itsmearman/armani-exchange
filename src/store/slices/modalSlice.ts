import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  message: string;
}

const initialState: ModalState = {
  isOpen: false,
  message: "",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<string>) {
      state.isOpen = true;
      state.message = action.payload;
    },
    closeModal(state) {
      state.isOpen = false;
      state.message = "";
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
