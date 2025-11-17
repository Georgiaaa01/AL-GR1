// client/src/store/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    count: 0, // total bucăți în coș
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCartState: (state, action) => {
            const items = action.payload || [];
            state.items = items;
            state.count = items.reduce(
                (sum, item) => sum + (item.quantity || 0),
                0
            );
        },
        clearCartState: (state) => {
            state.items = [];
            state.count = 0;
        },
    },
});

export const { setCartState, clearCartState } = cartSlice.actions;

export default cartSlice.reducer;
