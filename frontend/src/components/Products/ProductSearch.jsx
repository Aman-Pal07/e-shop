import React, { useState, useEffect, useRef } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { Link } from "react-router-dom";

const ProductSearch = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // Handle search input change
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filtered = data.filter((product) =>
      product.name.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(filtered.slice(0, 5)); // Limit to 5 results
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search data..."
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setIsSearchOpen(true)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all duration-200"
        />
        <AiOutlineSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
      </div>

      {/* Search Results Dropdown */}
      {isSearchOpen && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 max-h-[400px] overflow-y-auto z-50">
          {searchResults.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-none"
              onClick={() => {
                setIsSearchOpen(false);
                setSearchTerm("");
              }}
            >
              {/* Product Image */}
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-grow min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-base font-semibold text-teal-600">
                    ${product.discountPrice}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {isSearchOpen && searchTerm && searchResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 p-4 text-center text-gray-500 z-50">
          No products found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
