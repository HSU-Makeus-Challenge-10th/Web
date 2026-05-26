import { create } from 'zustand';
import cartItems from '../constants/cartItems';

interface CartItem {
  id: string;
  title: string;
  singer: string;
  price: string;
  img: string;
  amount: number;
}

interface CartState {
  cartItems: CartItem[];
  amount: number;
  total: number; // 총 금액 상태 추가
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalAmounts: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cartItems: cartItems,
  amount: 0,
  total: 0, // 총 금액 초기값 추가

  increase: (id: string) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item
      ),
    })),

  decrease: (id: string) =>
    set((state) => ({
      cartItems: state.cartItems
        .map((item) =>
          item.id === id ? { ...item, amount: item.amount - 1 } : item
        )
        .filter((item) => item.amount >= 1),
    })),

  removeItem: (id: string) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),

  clearCart: () =>
    set({
      cartItems: [],
      amount: 0,
      total: 0, // 전체 삭제 시 총 금액도 0으로 초기화
    }),

  totalAmounts: () =>
    set((state) => {
      let amount = 0;
      let total = 0;
      
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * parseInt(item.price); 
      });
      
      return { amount, total }; // 계산된 수량과 총 금액을 상태에 반영
    }),
}));