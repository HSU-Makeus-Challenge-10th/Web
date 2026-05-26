import { create } from "zustand";
import cartItems, { type CartItem } from "../constants/cartItems";

interface Totals {
  amount: number;
  total: number;
}

interface PlaylistState {
  cartItems: CartItem[];
  amount: number;
  total: number;
  isOpen: boolean;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
  openModal: () => void;
  closeModal: () => void;
  confirmClearCart: () => void;
}

function getTotals(items: CartItem[]): Totals {
  return items.reduce(
    (acc, item) => {
      const price = Number(item.price);

      return {
        amount: acc.amount + item.amount,
        total: acc.total + price * item.amount,
      };
    },
    { amount: 0, total: 0 },
  );
}

const initialCartItems = cartItems.map((item) => ({ ...item }));
const initialTotals = getTotals(initialCartItems);

export const usePlaylistStore = create<PlaylistState>((set) => ({
  cartItems: initialCartItems,
  amount: initialTotals.amount,
  total: initialTotals.total,
  isOpen: false,
  increase: (id) =>
    set((state) => {
      const nextItems = state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item,
      );
      const totals = getTotals(nextItems);

      return {
        cartItems: nextItems,
        amount: totals.amount,
        total: totals.total,
      };
    }),
  decrease: (id) =>
    set((state) => {
      const nextItems = state.cartItems
        .map((item) =>
          item.id === id ? { ...item, amount: item.amount - 1 } : item,
        )
        .filter((item) => item.amount > 0);
      const totals = getTotals(nextItems);

      return {
        cartItems: nextItems,
        amount: totals.amount,
        total: totals.total,
      };
    }),
  removeItem: (id) =>
    set((state) => {
      const nextItems = state.cartItems.filter((item) => item.id !== id);
      const totals = getTotals(nextItems);

      return {
        cartItems: nextItems,
        amount: totals.amount,
        total: totals.total,
      };
    }),
  clearCart: () =>
    set({
      cartItems: [],
      amount: 0,
      total: 0,
    }),
  calculateTotals: () =>
    set((state) => {
      const totals = getTotals(state.cartItems);

      return {
        amount: totals.amount,
        total: totals.total,
      };
    }),
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
  confirmClearCart: () =>
    set({
      cartItems: [],
      amount: 0,
      total: 0,
      isOpen: false,
    }),
}));
