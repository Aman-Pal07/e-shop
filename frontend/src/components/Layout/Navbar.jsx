import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { navItems } from "../../static/data";

const Navbar = () => {
  const location = useLocation();
  const [active, setActive] = useState("");

  // Update active state based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = navItems.find((item) => item.url === currentPath);
    if (activeItem) {
      setActive(activeItem.title);
    }
  }, [location.pathname]);

  const handleActive = (title) => {
    setActive(title);
  };

  return (
    <div className="w-full">
      {/* Desktop Navigation */}
      {navItems && (
        <nav className="hidden md:flex flex-1 justify-center gap-10">
          {navItems.map((link, index) => (
            <Link
              key={index}
              to={link.url}
              onClick={() => handleActive(link.title)}
              className={`relative text-sm uppercase font-semibold tracking-wide group ${
                active === link.title
                  ? "text-teal-600"
                  : link.isSpecial
                  ? "text-red-600"
                  : "text-gray-700"
              }`}
            >
              {link.title}
              <span
                className={`absolute bottom-[-4px] left-0 w-full h-[2px] scale-x-0 origin-center transition-transform duration-300 ${
                  active === link.title
                    ? "bg-teal-600 scale-x-100"
                    : link.isSpecial
                    ? "bg-red-600 group-hover:bg-red-700"
                    : "bg-gray-700 group-hover:bg-teal-600"
                } group-hover:scale-x-100`}
              />
            </Link>
          ))}
        </nav>
      )}

      {/* Mobile Navigation */}
      {navItems && (
        <nav className="md:hidden w-full px-4 py-2 bg-white">
          {navItems.map((link, index) => (
            <Link
              key={index}
              to={link.url}
              onClick={() => handleActive(link.title)}
              className={`block py-3 px-4 border-b border-gray-200 last:border-b-0 relative ${
                active === link.title
                  ? "text-teal-600 bg-teal-50"
                  : link.isSpecial
                  ? "text-red-600"
                  : "text-gray-700 hover:bg-gray-50"
              } transition-colors duration-200`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase font-medium">
                  {link.title}
                </span>
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              {/* Active Indicator */}
              {active === link.title && (
                <span className="absolute left-0 top-0 h-full w-1 bg-teal-600" />
              )}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
};

export default Navbar;
