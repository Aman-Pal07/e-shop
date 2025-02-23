import React from "react";
import { useSelector } from "react-redux";
import ProductCard from "./ProductCard";

const categories = [
  {
    id: 1,
    src: "https://www.mohanlalsons.com/cdn/shop/files/113X113_KURTA_200x.jpg?v=1691141895",
    label: "Kurta Jawahar Set",
  },
  {
    id: 2,
    src: "https://www.mohanlalsons.com/cdn/shop/files/113X113_INDO_WESTERN_50x.jpg?v=1702465143",
    label: "Nehru Jacket",
  },
  {
    id: 3,
    src: "https://www.mohanlalsons.com/cdn/shop/files/113X113_SHERWANI_9a230589-3736-44e1-a9e1-02ff7ff09762_50x.jpg?v=1702465079",
    label: "Sherwani",
  },
  {
    id: 4,
    src: "https://www.mohanlalsons.com/cdn/shop/files/113X113_KURTA_200x.jpg?v=1691141895",
    label: "Indo Western",
  },
  {
    id: 5,
    src: "https://www.mohanlalsons.com/cdn/shop/files/113X113_INDO_WESTERN_50x.jpg?v=1702465143",
    label: "Suits",
  },
  {
    id: 6,
    src: "https://www.mohanlalsons.com/cdn/shop/files/113X113_SHERWANI_9a230589-3736-44e1-a9e1-02ff7ff09762_50x.jpg?v=1702465079",
    label: "Kids Kurta Pajama",
  },
  {
    id: 7,
    src: "https://www.mohanlalsons.com/cdn/shop/files/113X113_KURTA_200x.jpg?v=1691141895",
    label: "Kids Sherwani",
  },
  {
    id: 8,
    src: "https://www.mohanlalsons.com/cdn/shop/files/113X113_INDO_WESTERN_50x.jpg?v=1702465143",
    label: "Kids Indo",
  },
];

const trendingCategories = [
  {
    id: 1,
    src: "https://www.mohanlalsons.com/cdn/shop/files/Men_Sherwani_img_720x.webp?v=1724827990",
    label: "Men Sherwani",
  },
  {
    id: 2,
    src: "https://www.mohanlalsons.com/cdn/shop/files/Kids_Kurta_Jawahar_Set_img_720x.webp?v=1724827989",
    label: "Kids Kurta Jawahar Set",
  },
  {
    id: 3,
    src: "https://www.mohanlalsons.com/cdn/shop/files/Men_Tuxedo_img_720x.webp?v=1724827990",
    label: "Men Tuxedo",
  },
  {
    id: 4,
    src: "https://www.mohanlalsons.com/cdn/shop/files/Kids_Indo-Western_img_720x.webp?v=1724827989",
    label: "Kids Indo-Western",
  },
];

const CollectionComponent = () => {
  const { allProducts } = useSelector((state) => state.products);
  return (
    <div className="container mx-auto p-4 ">
      {/* Categories Section - Scrollable without a scrollbar */}
      <div className="flex items-center justify-between mt-8 mb-8 overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col items-center text-center mr-4"
          >
            <div className="w-32 h-32 rounded-full overflow-hidden mb-2">
              <img
                src={category.src}
                alt={category.label}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-medium text-gray-800">
              {category.label}
            </span>
          </div>
        ))}
      </div>

      {/* Trending Categories Section */}
      <h2 className="text-center text-2xl font-semibold mb-8">
        Trending Categories
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {allProducts &&
          allProducts.map((i, index) => <ProductCard data={i} key={index} />)}
      </div>
    </div>
  );
};

export default CollectionComponent;
