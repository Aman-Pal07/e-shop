import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import { ShoppingCart, Tag } from "lucide-react";
import CountDown from "./CountDown";
import styles from "../../styles/styles";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const addToCartHandler = (data) => {
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-5 mx-4 sm:mx-10 mt-10 flex items-center gap-6 border border-gray-200 transform hover:-translate-y-1">
      {/* Image Section */}
      <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 shadow-inner transition-transform duration-500 hover:scale-105">
        <img
          src={`${data.images[0]?.url}`}
          alt={data.name}
          className="w-full h-full object-cover p-2"
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 space-y-3">
        {/* Title & Description */}
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 line-clamp-1 hover:text-teal-600 transition-colors duration-200">
          {data.name}
        </h2>
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {data.description}
        </p>

        {/* Pricing & Stock */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="text-green-500" size={16} />
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              ₹{data.discountPrice}
            </span>
            {data.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₹{data.originalPrice}
              </span>
            )}
          </div>
          <span className="text-xs sm:text-sm text-gray-500 font-medium">
            {data.sold_out} Sold
          </span>
        </div>

        {/* Countdown Timer */}
        <div className="mt-2">
          <CountDown data={data} />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-4">
          <Link to={`/product/${data._id}?isEvent=true`}>
            <button className="px-4 py-2 text-sm rounded-lg bg-teal-600 text-white font-semibold shadow-md hover:bg-teal-700 hover:scale-105 transition-all duration-200">
              See Details
            </button>
          </Link>
          <button
            className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 hover:scale-105 transition-all duration-200 flex items-center gap-1"
            onClick={() => addToCartHandler(data)}
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
