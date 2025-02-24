import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import { useSelector } from "react-redux";
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { BsCart3 } from "react-icons/bs";
import { FaUserShield } from "react-icons/fa"; // Admin Icon
import Navbar from "./Navbar";
import Cart from "../cart/Cart";
import Wishlist from "../Wishlist/Wishlist";

const Header = ({ activeHeading }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [active, setActive] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false);

  // Redirect admin users to the dashboard
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  window.addEventListener("scroll", () => {
    setActive(window.scrollY > 70);
  });

  return (
    <>
      {/* Desktop Header */}
      <div
        className={`${
          active ? "shadow-md fixed top-0 left-0 z-10 bg-white" : "bg-gray-50"
        } hidden lg:flex items-center justify-between w-full h-[80px] transition-all duration-300`}
      >
        <div
          className={`${styles.section} flex justify-between max-w-7xl mx-auto px-4`}
        >
          {/* Logo */}
          <div className="h-[60px] mt-[10px] w-[270px] hidden xl:block">
            <Link to="/">
              <h1 className="font-serif font-bold text-gray-900 uppercase">
                Great Way Studio
              </h1>
              <div className="text-gray-600 text-xs">
                <span className="block uppercase tracking-wider">
                  Since 1998
                </span>
                <span className="block tracking-widest mt-0.5">
                  India's Oldest Retailer
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 flex justify-center">
            <Navbar active={activeHeading} />
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            {/* Wishlist */}
            <div
              className="relative cursor-pointer"
              onClick={() => setOpenWishlist(true)}
            >
              <AiOutlineHeart
                size={25}
                className="text-gray-700 hover:text-blue-600"
              />
              <span className="absolute -top-1 -right-1 bg-blue-600 w-4 h-4 text-white text-xs flex items-center justify-center">
                {wishlist?.length}
              </span>
            </div>

            {/* Cart */}
            <div
              className="relative cursor-pointer"
              onClick={() => setOpenCart(true)}
            >
              <BsCart3
                size={25}
                className="text-gray-700 hover:text-blue-600"
              />
              <span className="absolute -top-1 -right-1 bg-blue-600 w-4 h-4 text-white text-xs flex items-center justify-center">
                {cart?.length}
              </span>
            </div>

            {/* Profile & Admin */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {user?.role === "admin" && (
                    <Link to="/dashboard">
                      <FaUserShield
                        size={30}
                        className="text-red-600 hover:text-red-700"
                      />
                    </Link>
                  )}
                  <Link to="/profile">
                    <img
                      src={user?.avatar?.url || "/default-avatar.png"}
                      className="w-[35px] h-[35px] rounded-full border-2 border-gray-700 hover:border-blue-600"
                      alt="User"
                    />
                  </Link>
                </>
              ) : (
                <Link to="/login">
                  <CgProfile
                    size={30}
                    className="text-gray-700 hover:text-blue-600"
                  />
                </Link>
              )}
            </div>

            {/* Cart & Wishlist Popups */}
            {openCart && <Cart setOpenCart={setOpenCart} />}
            {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className={`w-full h-[70px] bg-white shadow-sm lg:hidden`}>
        <div className="w-full flex items-center justify-between px-4 h-full">
          {/* Menu Icon */}
          <BiMenuAltLeft
            size={36}
            className="text-gray-700 cursor-pointer"
            onClick={() => setOpen(true)}
          />

          {/* Logo */}
          <Link to="/">
            <h1 className="text-xl font-serif font-bold text-gray-900 uppercase">
              Great Way Studio
            </h1>
          </Link>

          {/* Cart */}
          <div
            className="relative cursor-pointer"
            onClick={() => setOpenCart(true)}
          >
            <BsCart3 size={28} className="text-gray-700 hover:text-blue-600" />
            <span className="absolute -top-1 -right-1 bg-blue-600 w-4 h-4 text-white text-xs flex items-center justify-center">
              {cart?.length}
            </span>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {open && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setOpen(false)}
          >
            <div className="fixed w-4/5 sm:w-2/3 max-w-xs bg-white h-full top-0 left-0 overflow-y-auto transition-transform duration-300">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <AiOutlineHeart
                  size={26}
                  className="text-gray-700"
                  onClick={() => setOpenWishlist(true)}
                />
                <button
                  className="text-gray-700 text-lg"
                  onClick={() => setOpen(false)}
                >
                  ✖
                </button>
              </div>

              {/* Profile & Admin */}
              <div className="flex justify-center py-6">
                {isAuthenticated ? (
                  <>
                    {user?.role === "admin" && (
                      <Link to="/dashboard" onClick={() => setOpen(false)}>
                        <FaUserShield size={30} className="text-red-600" />
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setOpen(false)}>
                      <img
                        src={user?.avatar?.url || "/default-avatar.png"}
                        className="w-14 h-14 rounded-full border-2 border-blue-600"
                        alt="User"
                      />
                    </Link>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setOpen(false)}>
                    Login
                  </Link>
                )}
              </div>

              {/* Mobile Navigation */}
              <div className="px-4 pb-6">
                <Navbar
                  active={activeHeading}
                  onLinkClick={() => setOpen(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
