import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit"; 
import cartItems from "../constants/cartItems";
import type { CartItems } from "../types/cart";

export interface CartState {
    cartItems: CartItems;
    amount: number;
    total: number;
}

const initialState: CartState = {

    cartItems: cartItems as unknown as CartItems, 
    amount: 0,
    total: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // 1. 증가
        increase: (state, action: PayloadAction<{ id: string }>) => {
            const itemId = action.payload.id;
            const item = state.cartItems.find((cartItem) => cartItem.id === itemId);
            if (item) {
                item.amount += 1;
            }
        },

        // 2. 감소
        decrease: (state, action: PayloadAction<{ id: string }>) => {
            const itemId = action.payload.id;
            const item = state.cartItems.find((cartItem) => cartItem.id === itemId);
            if (item) {
                if (item.amount > 1) {
                    item.amount -= 1;
                }
            }
        },

        // 3. 아이템 제거
        removeItem: (state, action: PayloadAction<{ id: string }>) => {
            const itemId = action.payload.id;
            state.cartItems = state.cartItems.filter(
                (cartItem) => cartItem.id !== itemId
            );
        },

        // 4. 장바구니 비우기
        clearCart: (state) => {
            state.cartItems = [];
        },

        // 5. 총액 및 총 수량 계산
        calculateTotals: (state) => {
            let Amount = 0;
            let total = 0;

            state.cartItems.forEach((item) => {
                Amount += item.amount;
                total += item.amount * item.price;
            });

            state.amount = Amount;
            state.total = total;
        }
    },
});

export const { increase, decrease, removeItem, clearCart, calculateTotals } = cartSlice.actions;

export default cartSlice.reducer;