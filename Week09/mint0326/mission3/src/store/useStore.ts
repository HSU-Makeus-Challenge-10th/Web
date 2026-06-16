import { create } from 'zustand';
import cartItems, { type CartItemType } from '../constants/cartItems';

interface StoreState {
  cartItems: CartItemType[];
  amount: number;
  total: number;
  isOpen: boolean;

  clearCart: () => void;
  removeItem: (id: string) => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  calculateTotals: () => void;
  openModal: () => void;
  closeModal: () => void;
}

const useStore = create<StoreState>((set) => ({
  cartItems: cartItems,
  amount: 0,
  total: 0,
  isOpen: false,

  clearCart: () => set({ cartItems: [] }),
  removeItem: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),
  increase: (id) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) => {
        if (item.id === id) {
          return { ...item, amount: item.amount + 1 };
        }
        return item;
      }),
    })),
  decrease: (id) =>
    set((state) => {
      const newItems = state.cartItems
        .map((item) => {
          if (item.id === id) {
            return { ...item, amount: item.amount - 1 };
          }
          return item;
        })
        .filter((item) => item.amount > 0);
      return { cartItems: newItems };
    }),
  calculateTotals: () =>
    set((state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * Number(item.price);
      });
      return { amount, total };
    }),
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));

export default useStore;
