'use client'
import React, { useState } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";

const AllProducts = () => {
    const { products } = useAppContext();

    // Get unique categories
    const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

    // State for selected category
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Filter products by category
    const filteredProducts = selectedCategory === "All"
        ? products
        : products.filter(product => product.category === selectedCategory);

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
                <div className="flex flex-col items-end pt-12 w-full">
                    <p className="text-2xl font-medium">All products</p>
                    <div className="w-16 h-0.5 bg-orange-600 rounded-full mb-4"></div>
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`px-4 py-1 rounded-full border ${selectedCategory === category ? "bg-orange-600 text-white" : "bg-white text-gray-700 border-gray-300"}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-4 pb-14 w-full">
                    {filteredProducts.map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AllProducts;
