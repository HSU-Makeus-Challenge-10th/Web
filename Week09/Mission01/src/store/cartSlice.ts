import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import cartItems, { type CartItem } from "../constants/cartItems";

interface CartState {
  cartItems: CartItem[];
  amount: number;
  total: number;
}

function getTotals(items: CartItem[]) {
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

const initialTotals = getTotals(cartItems);

const initialState: CartState = {
  cartItems,
  amount: initialTotals.amount,
  total: initialTotals.total,
};

const cartSlice = createSlice({
  name: "cart",
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

      if (!item) return;

      if (item.amount === 1) {
        state.cartItems = state.cartItems.filter(
          (cartItem) => cartItem.id !== action.payload,
        );
        return;
      }

      item.amount -= 1;
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (cartItem) => cartItem.id !== action.payload,
      );
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },
    calculateTotals: (state) => {
      const totals = getTotals(state.cartItems);

      state.amount = totals.amount;
      state.total = totals.total;
    },
  },
});

export const { increase, decrease, removeItem, clearCart, calculateTotals } =
  cartSlice.actions;

export default cartSlice.reducer;
