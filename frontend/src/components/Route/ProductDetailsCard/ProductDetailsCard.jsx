import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addTocart } from "../../../redux/actions/cart";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";

const ProductDetailsCard = ({ setOpen, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  //   const [select, setSelect] = useState(false);

  const handleMessageSubmit = () => {};

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < count) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  return (
    <div className="bg-white">
      {data && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center backdrop-blur-sm transition-opacity duration-300">
          <div className="w-[90%] sm:w-[70%] md:w-[60%] max-w-4xl h-[90vh] sm:h-[80vh] bg-white rounded-xl shadow-2xl relative p-6 overflow-y-auto">
            {/* Close Button */}
            <RxCross1
              size={28}
              className="absolute right-4 top-4 text-gray-600 hover:text-gray-900 cursor-pointer transition-colors duration-200 z-50"
              onClick={() => setOpen(false)}
            />

            <div className="flex flex-col sm:flex-row gap-6">
              {/* Left Side - Product Image & Shop Info */}
              <div className="w-full sm:w-1/2 flex flex-col">
                <img
                  src={data.images?.[0]}
                  alt={data.name}
                  className="w-full h-64 sm:h-80 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                />
                <div className="flex items-center mt-4">
                  <Link
                    to={`/shop/preview/${data?.shop._id}`}
                    className="flex items-center group"
                  >
                    <img
                      src={data?.shop?.avatar}
                      alt={data.shop.name}
                      className="w-12 h-12 rounded-full shadow-md group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-teal-600 transition-colors">
                        {data.shop.name}
                      </h3>
                      <h5 className="text-sm text-gray-500">(4.5) Ratings</h5>
                    </div>
                  </Link>
                </div>

                <button
                  className="w-full mt-4 bg-gradient-to-r from-gray-800 to-black text-white py-2 rounded-md font-semibold flex items-center justify-center shadow-md hover:from-gray-700 hover:to-gray-900 transition-all duration-200"
                  onClick={handleMessageSubmit}
                >
                  Send Message <AiOutlineMessage className="ml-2" size={20} />
                </button>

                <h5 className="text-lg text-red-500 font-medium mt-4">
                  {data.sold_out} Sold
                </h5>
              </div>

              {/* Right Side - Product Details */}
              <div className="w-full sm:w-1/2 pt-6 sm:pt-0 sm:pl-6 flex flex-col">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  {data.name}
                </h1>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {data.description}
                </p>

                <div className="flex items-center mb-4">
                  <h4 className="text-2xl font-bold text-teal-600">
                    ₹{data.discountPrice}
                  </h4>
                  {data.originalPrice && (
                    <h3 className="text-lg text-gray-500 line-through ml-3">
                      ₹{data.originalPrice}
                    </h3>
                  )}
                </div>

                {/* Quantity Selector and Wishlist */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                    <button
                      className="bg-teal-500 text-white font-bold px-4 py-2 hover:bg-teal-600 transition-colors duration-200"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="bg-gray-100 text-gray-800 font-medium px-6 py-2">
                      {count}
                    </span>
                    <button
                      className="bg-teal-500 text-white font-bold px-4 py-2 hover:bg-teal-600 transition-colors duration-200"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>

                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer text-red-500 hover:scale-110 transition-transform duration-200"
                        onClick={() => removeFromWishlistHandler(data)}
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer text-gray-600 hover:text-red-500 hover:scale-110 transition-transform duration-200"
                        onClick={() => addToWishlistHandler(data)}
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold py-3 rounded-md shadow-lg flex items-center justify-center hover:from-teal-600 hover:to-teal-800 transition-all duration-200"
                  onClick={() => addToCartHandler(data._id)}
                >
                  Add to Cart{" "}
                  <AiOutlineShoppingCart className="ml-2" size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsCard;
