"use client"

import React, { useState, useEffect } from "react"
import Header from "../components/ui/Header"
import ProductCard from "../components/ui/ProductCard"
import FilterSidebar from "../components/ui/FilterSidebar"
import Button from "../components/ui/Button"
import QuickViewModal from "../components/ui/QuickViewModal"
import Toast from "../components/ui/Toast"
import { ProductCardSkeleton, FilterSkeleton } from "../components/ui/Skeleton"

// Database API functions
const fetchProducts = async (filters = {}) => {
    try {
        const params = new URLSearchParams()

        if (filters.query) params.append("q", filters.query)
        if (filters.category) params.append("category", filters.category)
        if (filters.brand) params.append("brand", filters.brand)
        if (filters.minPrice) params.append("minPrice", filters.minPrice)
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice)
        if (filters.rating) params.append("rating", filters.rating)
        if (filters.sortBy) params.append("sortBy", filters.sortBy)
        if (filters.page) params.append("page", filters.page)
        if (filters.limit) params.append("limit", filters.limit)

        const response = await fetch(`/api/products?${params.toString()}`)
        const result = await response.json()

        if (result.success) {
            return result
        } else {
            throw new Error(result.error)
        }
    } catch (error) {
        console.error("Error fetching products:", error)
        return { data: [], pagination: {} }
    }
}

const addToCart = async (productId, userId = 1) => {
    try {
        const response = await fetch("/api/cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId,
                productId,
                quantity: 1,
            }),
        })

        const result = await response.json()
        return result.success
    } catch (error) {
        console.error("Error adding to cart:", error)
        return false
    }
}

export default function ShopPage() {
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [filters, setFilters] = useState({})
    const [sortBy, setSortBy] = useState("featured")
    const [currentPage, setCurrentPage] = useState(1)
    const [productsPerPage] = useState(8)
    const [isLoading, setIsLoading] = useState(true)
    const [quickViewProduct, setQuickViewProduct] = useState(null)
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
    const [toast, setToast] = useState(null)

    // Simulate loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1500)
        return () => clearTimeout(timer)
    }, [])

    // Load products from database
    useEffect(() => {
        const loadProducts = async () => {
            const result = await fetchProducts({
                sortBy,
                page: currentPage,
                limit: productsPerPage,
            })
            setProducts(result.data)
            setFilteredProducts(result.data)
        }

        if (!isLoading) {
            loadProducts()
        }
    }, [isLoading, sortBy, currentPage, productsPerPage])

    // Filter dan sort products
    useEffect(() => {
        let result = [...products]

        // Apply filters
        if (filters.categories && filters.categories.length > 0) {
            result = result.filter((product) =>
                filters.categories.includes(product.category)
            )
        }

        if (filters.brands && filters.brands.length > 0) {
            result = result.filter((product) =>
                filters.brands.includes(product.brand)
            )
        }

        if (filters.ratings && filters.ratings.length > 0) {
            result = result.filter((product) =>
                filters.ratings.some((rating) => product.rating >= rating)
            )
        }

        if (filters.priceRange) {
            result = result.filter(
                (product) =>
                    product.price >= filters.priceRange[0] &&
                    product.price <= filters.priceRange[1]
            )
        }

        setFilteredProducts(result)
        setCurrentPage(1)
    }, [filters, products])

    // Pagination
    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentProducts = filteredProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    )
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

    const handleFilterChange = (newFilters) => {
        setFilters((prev) => ({ ...prev, ...newFilters }))
    }

    const handleSortChange = (newSort) => {
        setSortBy(newSort)
    }

    const handleAddToCart = async (product) => {
        const success = await addToCart(product.id)
        if (success) {
            setToast({
                message: `${product.name} added to cart!`,
                type: "success",
                duration: 3000,
            })
        } else {
            setToast({
                message: "Failed to add to cart. Please try again.",
                type: "error",
                duration: 3000,
            })
        }
    }

    const handleViewDetails = (product) => {
        setQuickViewProduct(product)
        setIsQuickViewOpen(true)
    }

    const showToast = (message, type = "info") => {
        setToast({ message, type, duration: 3000 })
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
                {/* Hero Section */}
                <div className="text-center mb-8 lg:mb-12">
                    <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
                        Discover Amazing Products
                    </h1>
                    <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-6 lg:mb-8">
                        Shop the latest trends with our curated collection of
                        premium products. Find exactly what you&apos;re looking
                        for with our advanced filters and sorting options.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full px-4 lg:px-6 py-3 lg:py-4 text-base lg:text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onChange={(e) => {
                                    const query = e.target.value
                                    if (query.trim()) {
                                        fetchProducts({ query }).then(
                                            (result) => {
                                                setProducts(result.data)
                                                setFilteredProducts(result.data)
                                            }
                                        )
                                    } else {
                                        fetchProducts({
                                            sortBy,
                                            page: currentPage,
                                            limit: productsPerPage,
                                        }).then((result) => {
                                            setProducts(result.data)
                                            setFilteredProducts(result.data)
                                        })
                                    }
                                }}
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 lg:p-2.5 rounded-full hover:bg-blue-700 transition-colors">
                                <svg
                                    className="w-5 h-5 lg:w-6 lg:h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
                    <div className="bg-white rounded-xl p-4 lg:p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-1 lg:mb-2">
                            {filteredProducts.length}
                        </div>
                        <div className="text-sm lg:text-base text-gray-600 font-medium">
                            Products
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 lg:p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="text-2xl lg:text-3xl font-bold text-green-600 mb-1 lg:mb-2">
                            Free
                        </div>
                        <div className="text-sm lg:text-base text-gray-600 font-medium">
                            Shipping
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 lg:p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="text-2xl lg:text-3xl font-bold text-purple-600 mb-1 lg:mb-2">
                            24/7
                        </div>
                        <div className="text-sm lg:text-base text-gray-600 font-medium">
                            Support
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 lg:p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="text-2xl lg:text-3xl font-bold text-orange-600 mb-1 lg:mb-2">
                            30 Days
                        </div>
                        <div className="text-sm lg:text-base text-gray-600 font-medium">
                            Returns
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
                    {/* Filter Sidebar */}
                    <div className="lg:w-80 flex-shrink-0 order-2 lg:order-1">
                        <div className="lg:sticky lg:top-24">
                            <FilterSidebar
                                onFilterChange={handleFilterChange}
                                onSortChange={handleSortChange}
                            />
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1 min-w-0 order-1 lg:order-2">
                        {/* Results Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 lg:gap-4 mb-4 lg:mb-6">
                            <div className="text-xs lg:text-sm text-gray-600">
                                Showing{" "}
                                <span className="font-medium">
                                    {indexOfFirstProduct + 1}
                                </span>
                                -
                                <span className="font-medium">
                                    {Math.min(
                                        indexOfLastProduct,
                                        filteredProducts.length
                                    )}
                                </span>{" "}
                                of{" "}
                                <span className="font-medium">
                                    {filteredProducts.length}
                                </span>{" "}
                                products
                            </div>
                            <div className="flex items-center gap-2 lg:gap-3">
                                <span className="text-xs lg:text-sm text-gray-600 font-medium">
                                    Sort by:
                                </span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 lg:px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="featured">Featured</option>
                                    <option value="price-low">
                                        Price: Low to High
                                    </option>
                                    <option value="price-high">
                                        Price: High to Low
                                    </option>
                                    <option value="rating">
                                        Highest Rated
                                    </option>
                                    <option value="newest">Newest</option>
                                    <option value="name">Name A-Z</option>
                                </select>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : currentProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                                {currentProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onAddToCart={handleAddToCart}
                                        onViewDetails={handleViewDetails}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 lg:py-16">
                                <div className="text-gray-400 mb-4 lg:mb-6">
                                    <svg
                                        className="mx-auto h-16 w-16 lg:h-24 lg:w-24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-3 lg:mb-4">
                                    No products found
                                </h3>
                                <p className="text-gray-600 mb-6 lg:mb-8 max-w-md mx-auto text-sm lg:text-base">
                                    We couldn't find any products matching your
                                    criteria. Try adjusting your filters or
                                    search terms.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setFilters({})
                                        setSortBy("featured")
                                    }}
                                >
                                    Clear All Filters
                                </Button>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center mt-8 lg:mt-12">
                                <nav className="flex items-center gap-1 lg:gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handlePageChange(currentPage - 1)
                                        }
                                        disabled={currentPage === 1}
                                        className="flex items-center gap-1"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 19l-7-7 7-7"
                                            />
                                        </svg>
                                        Previous
                                    </Button>

                                    {[...Array(totalPages)].map((_, i) => {
                                        const pageNumber = i + 1
                                        if (
                                            pageNumber === 1 ||
                                            pageNumber === totalPages ||
                                            (pageNumber >= currentPage - 1 &&
                                                pageNumber <= currentPage + 1)
                                        ) {
                                            return (
                                                <Button
                                                    key={pageNumber}
                                                    variant={
                                                        currentPage ===
                                                        pageNumber
                                                            ? "primary"
                                                            : "outline"
                                                    }
                                                    size="sm"
                                                    onClick={() =>
                                                        handlePageChange(
                                                            pageNumber
                                                        )
                                                    }
                                                >
                                                    {pageNumber}
                                                </Button>
                                            )
                                        } else if (
                                            pageNumber === currentPage - 2 ||
                                            pageNumber === currentPage + 2
                                        ) {
                                            return (
                                                <span
                                                    key={pageNumber}
                                                    className="px-3 py-2 text-gray-500"
                                                >
                                                    ...
                                                </span>
                                            )
                                        }
                                        return null
                                    })}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handlePageChange(currentPage + 1)
                                        }
                                        disabled={currentPage === totalPages}
                                        className="flex items-center gap-1"
                                    >
                                        Next
                                        <svg
                                            className="w-4 h-4"
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
                                    </Button>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Quick View Modal */}
            <QuickViewModal
                product={quickViewProduct}
                isOpen={isQuickViewOpen}
                onClose={() => {
                    setIsQuickViewOpen(false)
                    setQuickViewProduct(null)
                }}
                onAddToCart={handleAddToCart}
            />

            {/* Toast Notifications */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    )
}
