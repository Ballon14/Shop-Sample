"use client"

import React, { useState, useEffect } from "react"
import Button from "./Button"

const FilterSidebar = ({ onFilterChange, onSortChange }) => {
    const [priceRange, setPriceRange] = useState([0, 1000])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedBrands, setSelectedBrands] = useState([])
    const [selectedRatings, setSelectedRatings] = useState([])
    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const ratings = [5, 4, 3, 2, 1]

    // Fetch categories and brands from API
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [categoriesRes, brandsRes] = await Promise.all([
                    fetch("/api/products?limit=1000"),
                    fetch("/api/products?limit=1000"),
                ])

                const categoriesData = await categoriesRes.json()
                const brandsData = await brandsRes.json()

                if (categoriesData.success) {
                    const uniqueCategories = [
                        ...new Set(categoriesData.data.map((p) => p.category)),
                    ].sort()
                    setCategories(uniqueCategories)
                }

                if (brandsData.success) {
                    const uniqueBrands = [
                        ...new Set(brandsData.data.map((p) => p.brand)),
                    ].sort()
                    setBrands(uniqueBrands)
                }
            } catch (error) {
                console.error("Error fetching filters:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchFilters()
    }, [])

    const handleCategoryChange = (category) => {
        const newCategories = selectedCategories.includes(category)
            ? selectedCategories.filter((c) => c !== category)
            : [...selectedCategories, category]
        setSelectedCategories(newCategories)
        onFilterChange({ categories: newCategories })
    }

    const handleBrandChange = (brand) => {
        const newBrands = selectedBrands.includes(brand)
            ? selectedBrands.filter((b) => b !== brand)
            : [...selectedBrands, brand]
        setSelectedBrands(newBrands)
        onFilterChange({ brands: newBrands })
    }

    const handleRatingChange = (rating) => {
        const newRatings = selectedRatings.includes(rating)
            ? selectedRatings.filter((r) => r !== rating)
            : [...selectedRatings, rating]
        setSelectedRatings(newRatings)
        onFilterChange({ ratings: newRatings })
    }

    const handlePriceChange = (min, max) => {
        setPriceRange([min, max])
        onFilterChange({ priceRange: [min, max] })
    }

    const clearFilters = () => {
        setSelectedCategories([])
        setSelectedBrands([])
        setSelectedRatings([])
        setPriceRange([0, 1000])
        onFilterChange({})
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i}>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                                <div className="space-y-2">
                                    {[...Array(3)].map((_, j) => (
                                        <div
                                            key={j}
                                            className="h-3 bg-gray-200 rounded w-3/4"
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                </Button>
            </div>

            {/* Sort */}
            <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Sort By</h4>
                <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => onSortChange(e.target.value)}
                >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                </select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={priceRange[0]}
                            onChange={(e) =>
                                handlePriceChange(
                                    Number(e.target.value),
                                    priceRange[1]
                                )
                            }
                        />
                        <span className="text-gray-500">-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={priceRange[1]}
                            onChange={(e) =>
                                handlePriceChange(
                                    priceRange[0],
                                    Number(e.target.value)
                                )
                            }
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            step="10"
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            value={priceRange[1]}
                            onChange={(e) =>
                                handlePriceChange(
                                    priceRange[0],
                                    Number(e.target.value)
                                )
                            }
                            style={{
                                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                                    (priceRange[1] / 1000) * 100
                                }%, #E5E7EB ${
                                    (priceRange[1] / 1000) * 100
                                }%, #E5E7EB 100%)`,
                            }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>$0</span>
                            <span>${priceRange[1]}</span>
                            <span>$1000</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map((category) => (
                        <label
                            key={category}
                            className="flex items-center justify-between hover:bg-gray-50 p-1 rounded cursor-pointer"
                        >
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(
                                        category
                                    )}
                                    onChange={() =>
                                        handleCategoryChange(category)
                                    }
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    {category}
                                </span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Brands */}
            <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Brands</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {brands.map((brand) => (
                        <label
                            key={brand}
                            className="flex items-center justify-between hover:bg-gray-50 p-1 rounded cursor-pointer"
                        >
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedBrands.includes(brand)}
                                    onChange={() => handleBrandChange(brand)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    {brand}
                                </span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Ratings */}
            <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Rating</h4>
                <div className="space-y-2">
                    {ratings.map((rating) => (
                        <label
                            key={rating}
                            className="flex items-center justify-between hover:bg-gray-50 p-1 rounded cursor-pointer"
                        >
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedRatings.includes(rating)}
                                    onChange={() => handleRatingChange(rating)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <div className="ml-2 flex items-center">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-4 h-4 ${
                                                    i < rating
                                                        ? "text-yellow-400"
                                                        : "text-gray-300"
                                                }`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="ml-1 text-sm text-gray-700">
                                        & up
                                    </span>
                                </div>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FilterSidebar
