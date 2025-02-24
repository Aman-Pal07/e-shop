import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Eye, ShoppingCart, Award, TrendingUp } from "lucide-react";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import { addTocart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "../../Products/Ratings";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";

const ProductCard = ({ data, isEvent }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data._id]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
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

  const discountPercentage = data.originalPrice
    ? Math.round(
        ((data.originalPrice - data.discountPrice) / data.originalPrice) * 100
      )
    : 0;

  return (
    <div
      className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-[28rem] w-full" // Fixed height and width
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      {discountPercentage > 0 && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            {discountPercentage}% OFF
          </div>
        </div>
      )}

      {data.sold_out > 100 && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
            <TrendingUp size={12} />
            Trending
          </div>
        </div>
      )}

      {/* Image Container */}
      <Link
        to={`${
          isEvent ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`
        }`}
        className="block relative w-full h-64 bg-gray-50 flex-shrink-0" // Fixed height
      >
        <img
          src={`${data.images && data.images[0]?.url}`}
          alt={data.name}
          className="w-full h-full object-contain p-4 transition-transform duration-500 hover:scale-105"
        />
        {data.stock < 1 && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white font-semibold text-lg tracking-wide bg-red-600 px-4 py-1 rounded-md">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Action Buttons */}
      <div
        className={`absolute right-4 top-4 flex flex-col gap-2 transition-all duration-300 ${
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
        }`}
      >
        <button
          onClick={() =>
            click ? removeFromWishlistHandler(data) : addToWishlistHandler(data)
          }
          className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          title={click ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={18}
            className={
              click
                ? "fill-red-500 stroke-red-500"
                : "text-gray-600 hover:text-red-500"
            }
          />
        </button>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Quick view"
        >
          <Eye size={18} className="text-gray-600 hover:text-blue-500" />
        </button>
        <button
          onClick={() => addToCartHandler(data._id)}
          disabled={data.stock < 1}
          className={`p-2 rounded-full shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            data.stock < 1
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-white hover:bg-blue-50"
          }`}
          title="Add to cart"
        >
          <ShoppingCart
            size={18}
            className={
              data.stock < 1
                ? "text-gray-400"
                : "text-gray-600 hover:text-blue-500"
            }
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors">
            {data.name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                ₹{data.discountPrice}
              </span>
              {data.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{data.originalPrice}
                </span>
              )}
            </div>
            {data.ratings >= 4.5 && (
              <div className="flex items-center gap-1 text-yellow-500">
                <Award size={14} />
                <span className="text-xs font-medium">Top Rated</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Ratings rating={data?.ratings} />
              <span className="text-gray-600">({data?.ratings || 0})</span>
            </div>
            <span className="text-green-600 font-medium">
              {data?.sold_out} Sold
            </span>
          </div>
        </div>

        {data.stock > 0 && data.stock < 10 && (
          <div className="mt-2 text-xs text-orange-500 font-medium">
            Only {data.stock} left in stock!
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {open && <ProductDetailsCard setOpen={setOpen} data={data} />}
    </div>
  );
};

export default ProductCard;
