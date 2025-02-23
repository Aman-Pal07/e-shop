import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  cart: JSON.parse(localStorage.getItem("cartItems")) || [],
};

export const cartReducer = createReducer(initialState, (builder) => {
  builder
    // Add to Cart
    .addCase("addToCart", (state, action) => {
      const item = action.payload;
      const isItemExist = state.cart.find((i) => i._id === item._id);

      if (isItemExist) {
        state.cart = state.cart.map((i) =>
          i._id === isItemExist._id ? item : i
        );
      } else {
        state.cart.push(item);
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    })

    // Remove from Cart
    .addCase("removeFromCart", (state, action) => {
      state.cart = state.cart.filter((i) => i._id !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    });
});
