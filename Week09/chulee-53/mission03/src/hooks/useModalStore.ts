import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface ModalActions {
  open: () => void;
  close: () => void;
}

interface ModalState {
  isOpen: boolean;
  actions: ModalActions;
}

export const useModalStore = create<ModalState>()(
  immer((set, _) => ({
    isOpen: false,
    actions: {
      open: () =>
        set((state) => {
          state.isOpen = true;
        }),
      close: () =>
        set((state) => {
          state.isOpen = false;
        }),
    },
  })),
);

export const useModalInfo = () => useModalStore((state) => state.isOpen);
export const useModalActions = () => useModalStore((state) => state.actions);
