import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import cartItems from '../constants/cartItems';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: cartItems,
    amount: 0,
    total: 0,
  },
  reducers: {
    increase: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) {
        item.amount += 1;
      }
    },
    decrease: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
    
      if (item) {
        item.amount -= 1;
        if (item.amount < 1) {
          state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
        }
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0; 
    },
    totalAmounts: (state) => {
      let amount = 0;
      let total = 0; 
      
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * parseInt(item.price); 
      });
      
      state.amount = amount;
      state.total = total; 
    },
  },
});

export const { increase, decrease, removeItem, clearCart, totalAmounts } = cartSlice.actions;
export default cartSlice.reducer;