import React, { useState } from "react";
import { useShade } from "../context/ShadeContext";
import ProductCard from "./ProductCard";
import Sidebar from "./Sidebar";

import { FaSearch, FaFilter } from "react-icons/fa";
import { products } from "../data/products";

// Update the Product interface to match products.ts
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  shortDescription: string;
  originalPrice: number;
  images: string[];
  shades: { name: string; color: string }[];
  details: {
    description: string;
    ingredients: string;
    howToUse: string[];
  };
  category?: string; // Make category optional since it's not in products.ts
  isNewArrival?: boolean; // Make isNewArrival optional
  rating?: number; // Make rating optional
}

const Shop: React.FC = () => {
  const { selectedShade } = useShade();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]); // Increase max price range
  const [showNewArrivals, setShowNewArrivals] = useState(false);

  // Map the products with default values for missing fields
  const allProducts: Product[] = products.map((product) => ({
    ...product,
    rating: 4.5,
    category: "face",
    isNewArrival: false,
    price: product.price, // Convert price from cents to dollars if needed
  }));

  const filteredProducts = allProducts
    .filter((product) => {
      // Add console.log to debug filter conditions
      console.log("Filtering product:", product.name);
      console.log(
        "Search term match:",
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log(
        "Category match:",
        selectedCategory === "all" || product.category === selectedCategory
      );
      console.log(
        "Price range match:",
        product.price >= priceRange[0] && product.price <= priceRange[1]
      );
      console.log(
        "New arrivals match:",
        !showNewArrivals || product.isNewArrival
      );
      console.log(
        "Shade match:",
        !selectedShade ||
          product.shades.some((shade) => shade.name === selectedShade)
      );

      return (
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "all" || product.category === selectedCategory) &&
        product.price >= priceRange[0] &&
        product.price <= priceRange[1] &&
        (!showNewArrivals || product.isNewArrival) &&
        (!selectedShade ||
          product.shades.some((shade) => shade.name === selectedShade))
      );
    })
    .sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );

  const categories = [
    "all",
    ...new Set(allProducts.map((product) => product.category)),
  ];

  return (
    <div className="shop bg-gray-50 min-h-screen">
      <div className="max-w-[2000px] mx-auto">
        {/* Hero Section */}

        <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4">
          {/* Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
              <div className="lg:hidden flex justify-between items-center p-4 bg-white rounded-lg shadow-sm mb-4">
                <h2 className="text-xl font-bold">Filters</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-gray-600 hover:text-black"
                >
                  <FaFilter size={20} />
                </button>
              </div>
              <div
                className={`${
                  showFilters ? "block" : "hidden lg:block"
                } bg-white rounded-lg shadow-sm p-6`}
              >
                <Sidebar
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  showNewArrivals={showNewArrivals}
                  setShowNewArrivals={setShowNewArrivals}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                  categories={categories as string[]}
                  showFilters={showFilters}
                  setShowFilters={setShowFilters}
                />
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-grow lg:pl-8 mt-8 lg:mt-0">
            {/* Search and Results Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="relative w-full mb-6">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors duration-300"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-gray-600">
                  Showing {filteredProducts.length} products
                </p>
                {selectedShade && (
                  <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
                    <span className="text-sm font-medium">
                      Shade: {selectedShade}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Product grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500 text-lg mb-2">No products found</p>
                <p className="text-gray-400">
                  Try adjusting your filters or search term
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="h-full flex">
                    <div className="w-full flex flex-col">
                      <ProductCard
                        {...product}
                        rating={product.rating || 4.5}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
