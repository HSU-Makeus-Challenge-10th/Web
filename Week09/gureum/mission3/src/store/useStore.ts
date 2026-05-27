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

const buildCartState = (items: CartItem[]) => {
  const totals = getInitialTotals(items);
  return {
    cartItems: items,
    amount: totals.amount,
    total: totals.total,
  };
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
      const nextItems = state.cartItems.map((cartItem) =>
        cartItem.id === id
          ? { ...cartItem, amount: cartItem.amount + 1 }
          : cartItem
      );

      return buildCartState(nextItems);
    }),

  decrease: (id: string) =>
    set((state) => {
      const nextItems = state.cartItems
        .map((cartItem) =>
          cartItem.id === id
            ? { ...cartItem, amount: cartItem.amount - 1 }
            : cartItem
        )
        .filter((cartItem) => cartItem.amount > 0);

      return buildCartState(nextItems);
    }),

  removeItem: (id: string) =>
    set((state) => {
      const nextItems = state.cartItems.filter((cartItem) => cartItem.id !== id);
      return buildCartState(nextItems);
    }),

  clearCart: () =>
    set(() => buildCartState([])),

  // Modal actions
  openModal: () => set(() => ({ isOpen: true })),

  closeModal: () => set(() => ({ isOpen: false })),
}));
