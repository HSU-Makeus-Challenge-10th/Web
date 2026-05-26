import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import cartItems from "../constants/cartItems";
import type { CartItems } from "../types/cart";

interface CartState {
  cartItems: CartItems;
  amount: number;
  total: number;
  isOpen: boolean;
}

interface CartActions {
  actions: {
    increase: (id: string) => void;
    decrease: (id: string) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    calculateTotals: () => void;
    openModal: () => void; 
    closeModal: () => void; 
  };
}

export type CartStoreState = CartState & CartActions;

export const useCartStore = create<CartStoreState>()(
  immer((set) => ({
    cartItems: cartItems as unknown as CartItems,
    amount: 0,
    total: 0,
    isOpen: false, 

    actions: {
      increase: (id) =>
        set((state) => {
          const item = state.cartItems.find((cartItem) => cartItem.id === id);
          if (item) item.amount += 1;
        }),

      decrease: (id) =>
        set((state) => {
          const item = state.cartItems.find((cartItem) => cartItem.id === id);
          if (item && item.amount > 1) item.amount -= 1;
        }),

      removeItem: (id) =>
        set((state) => {
          state.cartItems = state.cartItems.filter((cartItem) => cartItem.id !== id);
        }),

      clearCart: () =>
        set((state) => {
          state.cartItems = [];
          state.amount = 0;
          state.total = 0;
        }),

      calculateTotals: () =>
        set((state) => {
          let amount = 0;
          let total = 0;
          state.cartItems.forEach((item) => {
            amount += item.amount;
            total += item.amount * item.price;
          });
          state.amount = amount;
          state.total = total;
        }),

      openModal: () =>
        set((state) => {
          state.isOpen = true;
        }),

      closeModal: () =>
        set((state) => {
          state.isOpen = false;
        }),
    },
  }))
);

export const useCartInfo = () =>
  useCartStore(
    useShallow((state) => ({
      cartItems: state.cartItems,
      amount: state.amount,
      total: state.total,
      isOpen: state.isOpen, // 💡 6. 정보 반환 훅에도 isOpen 포함하기
    }))
  );

export const useCartActions = () => useCartStore((state) => state.actions);