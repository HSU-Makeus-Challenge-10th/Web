import { create } from 'zustand';
import cartItemsData from '../constants/cartItems';
import type { CartItem } from '../types/cart';

interface StoreState {
  // Cart state
  cartItems: CartItem[];
  amount: number;
  total: number;

  // Modal state
  isOpen: boolean;

  // Cart actions
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;

  // Modal actions
  openModal: () => void;
  closeModal: () => void;
}

const getInitialTotals = (items: CartItem[]) => {
  return items.reduce(
    (acc, item) => {
      acc.amount += item.amount;
      acc.total += item.amount * Number(item.price);
      return acc;
    },
    { amount: 0, total: 0 }
  );
};

const initialTotals = getInitialTotals(cartItemsData);

export const useStore = create<StoreState>((set) => ({
  // Initial cart state
  cartItems: cartItemsData,
  amount: initialTotals.amount,
  total: initialTotals.total,

  // Initial modal state
  isOpen: false,

  // Cart actions
  increase: (id: string) =>
    set((state) => {
      const item = state.cartItems.find((cartItem) => cartItem.id === id);
      if (item) {
        item.amount += 1;
      }
      return { cartItems: [...state.cartItems] };
    }),

  decrease: (id: string) =>
    set((state) => {
      const item = state.cartItems.find((cartItem) => cartItem.id === id);
      if (item) {
        item.amount -= 1;
      }
      const filteredItems = state.cartItems.filter((cartItem) => cartItem.amount > 0);
      return { cartItems: filteredItems };
    }),

  removeItem: (id: string) =>
    set((state) => {
      const filteredItems = state.cartItems.filter((cartItem) => cartItem.id !== id);
      return { cartItems: filteredItems };
    }),

  clearCart: () =>
    set(() => ({
      cartItems: [],
      amount: 0,
      total: 0,
    })),

  calculateTotals: () =>
    set((state) => {
      const totals = state.cartItems.reduce(
        (acc, item) => {
          acc.amount += item.amount;
          acc.total += item.amount * Number(item.price);
          return acc;
        },
        { amount: 0, total: 0 }
      );

      return {
        amount: totals.amount,
        total: totals.total,
      };
    }),

  // Modal actions
  openModal: () => set(() => ({ isOpen: true })),

  closeModal: () => set(() => ({ isOpen: false })),
}));
