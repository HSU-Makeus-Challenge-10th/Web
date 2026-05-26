import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import cartItems from "../constants/cartItems";
import type { CartItems } from "../types/cart";

export interface CartState {
  cartItems: CartItems;
  amount: number;
  total: number;
}

const initialItems = cartItems;
let initialAmount = 0;
let initialTotal = 0;

initialItems.forEach((item) => {
  initialAmount += item.amount;
  initialTotal += item.amount * item.price;
});

const initialState: CartState = {
  cartItems: initialItems,
  amount: initialAmount,
  total: initialTotal,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    increase: (state, action: PayloadAction<{ id: string }>) => {
      const itemId = action.payload.id;
      const item = state.cartItems.find((cartItem) => cartItem.id === itemId);
      if (item) {
        item.amount += 1;
      }
      cartSlice.caseReducers.calculateTotals(state);
    },
    decrease: (state, action: PayloadAction<{ id: string }>) => {
      const itemId = action.payload.id;
      const item = state.cartItems.find((cartItem) => cartItem.id === itemId);
      if (item) {
        item.amount -= 1;
        // 수량 0개 되면 삭제
        if (item.amount === 0) {
          state.cartItems = state.cartItems.filter(
            (cartItem) => cartItem.id !== itemId,
          );
        }
      }
      cartSlice.caseReducers.calculateTotals(state);
    },

    removeItem: (state, action: PayloadAction<{ id: string }>) => {
      const itemId = action.payload.id;
      state.cartItems = state.cartItems.filter(
        (cartItems) => cartItems.id !== itemId,
      );
      cartSlice.caseReducers.calculateTotals(state);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;

      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });
      state.amount = amount;
      state.total = total;
    },
  },
});

export const { increase, decrease, removeItem, clearCart, calculateTotals } =
  cartSlice.actions;

const cartReducer = cartSlice.reducer;

export default cartReducer;
