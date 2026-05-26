import { create } from "zustand";
import type { CartItems } from "../types/cart";
import { immer } from "zustand/middleware/immer";
import cartItems from "../constants/cartItems";
import { useShallow } from "zustand/shallow";

interface CartActions {
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

let initialAmount = 0;
let initialTotal = 0;

cartItems.forEach((item) => {
  initialAmount += item.amount;
  initialTotal += item.amount * item.price;
});
interface CartState {
  cartItems: CartItems;
  amount: number;
  total: number;

  actions: CartActions;
}

export const useCartStore = create<CartState>()(
  immer((set, get) => ({
    cartItems: cartItems,
    amount: initialAmount,
    total: initialTotal,
    actions: {
      increase: (id: string) => {
        set((state) => {
          const cartItem = state.cartItems.find((item) => item.id === id);

          if (cartItem) {
            cartItem.amount += 1;
          }
        });
        get().actions.calculateTotals();
      },
      decrease: (id: string) => {
        set((state) => {
          const cartItem = state.cartItems.find((item) => item.id === id);

          if (cartItem && cartItem.amount > 0) {
            cartItem.amount -= 1;
            if (cartItem.amount === 0) {
              state.cartItems = state.cartItems.filter(
                (item) => item.id !== id,
              );
            }
          }
        });
        get().actions.calculateTotals();
      },
      removeItem: (id: string) => {
        set((state) => {
          state.cartItems = state.cartItems.filter((item) => item.id !== id);
        });
        get().actions.calculateTotals();
      },
      clearCart: () => {
        set((state) => {
          state.cartItems = [];
          state.amount = 0;
          state.total = 0;
        });
      },
      calculateTotals: () => {
        set((state) => {
          let amount = 0;
          let total = 0;

          state.cartItems.forEach((item) => {
            amount += item.amount;
            total += item.amount * item.price;
          });
          state.amount = amount;
          state.total = total;
        });
      },
    },
  })),
);

export const useCartInfo = () =>
  useCartStore(
    useShallow((state) => ({
      cartItems: state.cartItems,
      amount: state.amount,
      total: state.total,
    })),
  );

export const useCartActions = () => useCartStore((state) => state.actions);
