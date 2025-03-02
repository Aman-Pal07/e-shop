import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import { categoriesData, productData } from "../../static/data";
import {
  AiOutlineHeart,
  AiOutlineMail,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import Cart from "../cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import { RxCross1 } from "react-icons/rx";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  X,
  Menu,
  Contact,
  Contact2,
  BookUser,
} from "lucide-react";
import { BsCart3 } from "react-icons/bs";
import { MdContactSupport } from "react-icons/md";

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { allProducts } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredProducts =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
  };

  window.addEventListener("scroll", () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
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
          className={`${styles.section} relative ${styles.noramlFlex} justify-between max-w-7xl mx-auto px-4`}
        >
          {/* Categories/Logo */}
          <div>
            <div className="relative mt-[10px] w-[200px]  hidden xl:block pb-2">
              <div className=" hidden xl:block">
                <Link to="/">
                  <img src="/image.png" alt="" />
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 flex justify-center">
            <Navbar active={activeHeading} />
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <div className={`${styles.noramlFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px] group"
                onClick={() => setOpenWishlist(true)}
              >
                <AiOutlineHeart
                  size={25}
                  className="text-gray-700 group-hover:text-blue-600 transition-colors"
                />
                <span className="absolute -top-1 -right-1 rounded-full bg-blue-600 w-4 h-4 text-white font-mono text-[12px] flex items-center justify-center">
                  {wishlist && wishlist.length}
                </span>
              </div>
            </div>

            <div className={`${styles.noramlFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px] group"
                onClick={() => setOpenCart(true)}
              >
                <BsCart3
                  size={25}
                  className="text-gray-700 group-hover:text-blue-600 transition-colors"
                />
                <span className="absolute -top-1 -right-1 rounded-full bg-blue-600 w-4 h-4 text-white font-mono text-[12px] flex items-center justify-center">
                  {cart && cart.length}
                </span>
              </div>
            </div>

            <div className={`${styles.noramlFlex}`}>
              <div className="relative cursor-pointer mr-[15px] group">
                <Link to="/contact">
                  <BookUser
                    size={25}
                    className="text-gray-700 group-hover:text-blue-600 transition-colors"
                  />
                </Link>
              </div>
            </div>

            <div className={`${styles.noramlFlex}`}>
              <div className="relative cursor-pointer mr-[15px] group">
                {isAuthenticated ? (
                  <Link to="/profile">
                    <img
                      src={`${user.avatar}`}
                      className="w-[35px] h-[35px] rounded-full border-2 border-gray-700 group-hover:border-blue-600 transition-colors"
                      alt=""
                    />
                  </Link>
                ) : (
                  <Link to="/login">
                    <CgProfile
                      size={30}
                      className="text-gray-700 group-hover:text-blue-600 transition-colors"
                    />
                  </Link>
                )}
              </div>
            </div>

            {/* Cart and Wishlist Popups */}
            {openCart ? <Cart setOpenCart={setOpenCart} /> : null}
            {openWishlist ? (
              <Wishlist setOpenWishlist={setOpenWishlist} />
            ) : null}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div
        className={`${
          active ? "shadow-md fixed top-0 left-0 z-10" : ""
        } w-full h-[70px] bg-white z-50 shadow-sm lg:hidden transition-all duration-300`}
      >
        <div className="w-full flex items-center justify-between px-4 h-full">
          <div>
            <BiMenuAltLeft
              size={36}
              className="ml-2 text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => setOpen(true)}
            />
          </div>
          <div>
            <div className="text-center">
              <Link to="/">
                <h1 className="text-xl font-serif font-bold text-gray-900 uppercase tracking-wide">
                  Great Way Studio
                </h1>
                <div className="text-gray-600 text-[10px]">
                  <span className="block uppercase tracking-wider">
                    Since 1998
                  </span>
                  <span className="block tracking-widest mt-0.5">
                    India's Oldest Retailer
                  </span>
                </div>
              </Link>
            </div>
          </div>
          <div>
            <div
              className="relative mr-[20px] cursor-pointer group"
              onClick={() => setOpenCart(true)}
            >
              <BsCart3
                size={28}
                className="text-gray-700 group-hover:text-blue-600 transition-colors"
              />
              <span className="absolute -top-1 -right-1 rounded-full bg-blue-600 w-4 h-4 text-white font-mono text-[12px] flex items-center justify-center">
                {cart && cart.length}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {open && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300"
            onClick={() => setOpen(false)}
          >
            <div
              className={`fixed w-4/5 sm:w-2/3 max-w-xs bg-white h-full top-0 left-0 z-30 overflow-y-auto transition-transform duration-300 ${
                open ? "translate-x-0" : "-translate-x-full"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div
                  className="relative cursor-pointer group"
                  onClick={() => setOpenWishlist(true)}
                >
                  <AiOutlineHeart
                    size={26}
                    className="text-gray-700 group-hover:text-blue-600 transition-colors"
                  />
                  <span className="absolute -top-1 -right-1 rounded-full bg-blue-600 w-4 h-4 text-white font-mono text-[12px] flex items-center justify-center">
                    {wishlist && wishlist.length}
                  </span>
                </div>
                <RxCross1
                  size={26}
                  className="text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => setOpen(false)}
                />
              </div>

              {/* Search Bar */}
              <div className="my-6 px-4">
                <input
                  type="search"
                  placeholder="Search Product..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm transition duration-150 ease-in-out"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchData && searchData.length > 0 && (
                  <div className="absolute left-4 right-4 bg-white shadow-lg rounded-b-md p-2 mt-1 z-10">
                    {searchData.map((i) => (
                      <Link
                        to={`/product/${i.id}`}
                        key={i.id}
                        className="flex items-center py-2 hover:bg-gray-100 rounded-md"
                        onClick={() => setOpen(false)}
                      >
                        <img
                          src={`${i.images[0]?.url}`}
                          alt={i.name}
                          className="w-10 h-10 object-cover mr-2"
                        />
                        <span className="text-sm text-gray-700">{i.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* User Profile Section */}
              <div className="flex justify-center py-6">
                {isAuthenticated ? (
                  <Link to="/profile" onClick={() => setOpen(false)}>
                    <img
                      src={`${user?.avatar?.url}`}
                      alt="Profile"
                      className="w-14 h-14 rounded-full border-2 border-blue-600 hover:border-blue-700 transition-colors"
                    />
                  </Link>
                ) : (
                  <div className="flex space-x-4">
                    <Link
                      to="/login"
                      className="text-lg text-gray-700 hover:text-blue-600 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/sign-up"
                      className="text-lg text-gray-700 hover:text-blue-600 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      Sign up
                    </Link>
                  </div>
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
