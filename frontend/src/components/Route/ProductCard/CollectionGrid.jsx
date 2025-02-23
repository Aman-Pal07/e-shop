import React from "react";
import Masonry from "react-masonry-css";
import { Link } from "react-router-dom";

const data = [
  {
    id: 1,
    type: "text",
    content: "Flat 50% off on Selected Stock",
    style: "bg-red-700 text-yellow-200",
  },
  {
    id: 2,
    type: "image",
    src: "https://www.mohanlalsons.com/cdn/shop/files/Webgrid_7_2_720x.jpg?v=1730464645",
    alt: "Festive & Wedding Collection 2024-25",
  },
  {
    id: 3,
    type: "image",
    src: "https://www.mohanlalsons.com/cdn/shop/files/Webgrid_6_1_720x.jpg?v=1730464645",
    alt: "Kurta Pajama",
  },
  {
    id: 4,
    type: "image",
    src: "https://www.mohanlalsons.com/cdn/shop/files/Webgrid_1_2_720x.jpg?v=1730464645",
    alt: "Traditional Outfit",
  },
  {
    id: 9,
    type: "text",
    content: "Flat 50% off on Selected Stock",
    style: "bg-blue-700 text-yellow-200",
  },
  {
    id: 5,
    type: "image",
    src: "https://www.mohanlalsons.com/cdn/shop/files/Webgrid_2_2_720x.jpg?v=1730464645",
    alt: "Another Outfit",
  },
  {
    id: 6,
    type: "image",
    src: "https://www.mohanlalsons.com/cdn/shop/files/Webgrid_3_1_720x.jpg?v=1730464645",
    alt: "Another Outfit",
  },
  {
    id: 7,
    type: "image",
    src: "https://www.mohanlalsons.com/cdn/shop/files/Webgrid_4_1_720x.jpg?v=1730464645",
    alt: "Another Outfit",
  },
  {
    id: 8,
    type: "image",
    src: "https://www.mohanlalsons.com/cdn/shop/files/Webgrid_5_1_720x.jpg?v=1730464645",
    alt: "Another Outfit",
  },
  {
    id: 10,
    type: "image",
    src: "https://www.mohanlalsons.com/cdn/shop/files/Webgrid_6_1_720x.jpg?v=1730464645",
    alt: "Kurta Pajama",
  },
  {
    id: 11,
    type: "text",
    content: "Flat 50% off on Selected Stock",
    style: "bg-green-700 text-yellow-200",
  },
];

const breakpoints = {
  default: 3,
  1100: 2,
  700: 1,
};

const CollectionGrid = () => {
  return (
    <div className="mt-[15rem] sm:mt-8 px-4">
      {/* Margin for mobile devices */}

      <div className="flex flex-col items-center justify-center text-center text-black mb-12 sm:mb-0">
        <h2 className="text-[1.5rem] sm:text-[2rem] font-bold tracking-[2px] sm:tracking-[3px]">
          Khaas lamhon ke liye..
        </h2>
        <p className="mt-2 text-base sm:text-lg px-2 sm:px-4 tracking-[0.5px] italic font-light">
          "Unleash timeless elegance on your special day with our exquisite{" "}
          <br className="hidden sm:block" /> wedding collection."
        </p>
      </div>

      <Masonry
        breakpointCols={breakpoints}
        className="flex w-full ml-[-6px] mt-[-2rem] "
        columnClassName="pl-4 bg-clip-padding"
      >
        {data.map((item, index) => {
          // Determine if the current item is the center item
          const isCenterItem = index === Math.floor(data.length / 10);

          return (
            <div
              key={item.id}
              className={`mb-4 relative group ${
                isCenterItem ? "mt-4 sm:mt-[5rem]" : "mt-0 sm:mt-[1rem]"
              }`}
            >
              {item.type === "image" ? (
                <div className="relative overflow-hidden rounded-lg shadow-md">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-auto object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out bg-black bg-opacity-50">
                    <Link to={`/products`}>
                      <button className="px-3 py-1 sm:px-4 sm:py-2 text-black bg-white rounded hover:bg-gray-100 text-xs sm:text-sm md:text-base lg:text-lg">
                        Shop Now
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div
                  className={`flex items-center justify-center h-52 sm:h-80 text-xl sm:text-2xl font-semibold rounded-lg shadow-md ${item.style}`}
                >
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </Masonry>
    </div>
  );
};

export default CollectionGrid;
