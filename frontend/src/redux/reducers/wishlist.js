import { createReducer } from "@reduxjs/toolkit";

const loadWishlistFromLocalStorage = () => {
  try {
    const wishlistItems = localStorage.getItem("wishlistItems");
    return wishlistItems ? JSON.parse(wishlistItems) : [];
  } catch (error) {
    console.error("Error loading wishlist from localStorage:", error);
    return [];
  }
};

const initialState = {
  wishlist: loadWishlistFromLocalStorage(),
};

export const wishlistReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("addToWishlist", (state, action) => {
      const item = action.payload;
      const isItemExist = state.wishlist.find((i) => i._id === item._id);

      if (isItemExist) {
        // Update existing item
        state.wishlist = state.wishlist.map((i) =>
          i._id === item._id ? item : i
        );
      } else {
        // Add new item
        state.wishlist.push(item);
      }

      localStorage.setItem("wishlistItems", JSON.stringify(state.wishlist));
    })
    .addCase("removeFromWishlist", (state, action) => {
      state.wishlist = state.wishlist.filter((i) => i._id !== action.payload);
      localStorage.setItem("wishlistItems", JSON.stringify(state.wishlist));
    });
});
