import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import { categoriesData } from "../static/data";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const { allProducts = [], isLoading } = useSelector(
    (state) => state.products
  );

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);

  useEffect(() => {
    if (!categoryData) {
      setData(allProducts);
    } else {
      const filteredData = allProducts.filter(
        (i) => i.category === categoryData
      );
      setData(filteredData);
    }
  }, [categoryData, allProducts]);

  useEffect(() => {
    if (searchTerm) {
      const filteredProducts = allProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchData(filteredProducts);
    } else {
      setSearchData(null);
    }
  }, [searchTerm, allProducts]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={3} />
          <div className="mt-16 md:mt-20" />{" "}
          {/* Adjusted margin for header space */}
          <div className="flex">
            {/* Sidebar */}
            <div className="w-[250px] min-h-screen bg-gray-100 p-5 hidden md:block">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Categories
              </h2>
              <ul className="space-y-2">
                <li
                  className={`cursor-pointer py-2 px-4 rounded-md text-sm font-medium ${
                    !categoryData
                      ? "bg-teal-500 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  } transition-colors duration-200`}
                  onClick={() => setSearchParams({})}
                >
                  All Products
                </li>
                {categoriesData.map((category) => (
                  <li
                    key={category.id}
                    className={`cursor-pointer py-2 px-4 rounded-md text-sm font-medium ${
                      categoryData === category.title
                        ? "bg-teal-500 text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    } transition-colors duration-200`}
                    onClick={() =>
                      setSearchParams({ category: category.title })
                    }
                  >
                    {category.title}
                  </li>
                ))}
              </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-5">
              <div className="relative w-full px-4 md:px-0 md:w-[50%] mx-auto mb-8">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search products..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 text-sm"
                />
                {searchTerm && searchData && (
                  <div className="absolute top-full left-0 right-0 bg-white z-50 shadow-xl rounded-lg mt-2 max-h-[400px] overflow-y-auto border border-gray-100">
                    {searchData.length > 0 ? (
                      searchData.map((i) => (
                        <Link
                          key={i._id}
                          to={`/product/${i._id}`}
                          className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-100 transition-colors duration-150"
                        >
                          <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 border border-gray-100">
                            <img
                              src={`${i.images[0]?.url}`}
                              alt={i.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-3 flex-grow">
                            <h5 className="text-sm font-medium text-gray-800 truncate">
                              {i.name}
                            </h5>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-base font-semibold text-teal-600">
                                ₹{i.discountPrice}
                              </span>
                              {i.originalPrice && (
                                <span className="text-xs text-gray-400 line-through">
                                  ₹{i.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No products found
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className={`${styles.section} mt-8`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {data.map((i, index) => (
                    <div key={index} className="w-full">
                      <ProductCard data={i} isEvent={false} />
                    </div>
                  ))}
                </div>
                {(!searchTerm && data.length === 0) ||
                (searchTerm && searchData && searchData.length === 0) ? (
                  <h1 className="text-center w-full py-16 text-xl text-gray-600">
                    No products found!
                  </h1>
                ) : null}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default ProductsPage;
