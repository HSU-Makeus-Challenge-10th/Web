import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import cartItemsData from '../../constants/cartItems';
import type { CartItem } from '../../types/cart';

interface CartState {
  cartItems: CartItem[];
  amount: number;
  total: number;
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

const initialState: CartState = {
  cartItems: cartItemsData,
  amount: initialTotals.amount,
  total: initialTotals.total,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increase: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((cartItem) => cartItem.id === action.payload);
      if (item) {
        item.amount += 1;
      }
    },
    decrease: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((cartItem) => cartItem.id === action.payload);
      if (item) {
        item.amount -= 1;
      }
      state.cartItems = state.cartItems.filter((cartItem) => cartItem.amount > 0);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((cartItem) => cartItem.id !== action.payload);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },
    calculateTotals: (state) => {
      const totals = state.cartItems.reduce(
        (acc, item) => {
          acc.amount += item.amount;
          acc.total += item.amount * Number(item.price);
          return acc;
        },
        { amount: 0, total: 0 }
      );

      state.amount = totals.amount;
      state.total = totals.total;
    },
  },
});

export const { increase, decrease, removeItem, clearCart, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;
