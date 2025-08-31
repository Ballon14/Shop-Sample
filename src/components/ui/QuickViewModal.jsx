"use client"

import React from "react"
import Button from "./Button"

const QuickViewModal = ({ product, isOpen, onClose, onAddToCart }) => {
    if (!isOpen || !product) return null

    const handleAddToCart = () => {
        onAddToCart(product)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out animate-in slide-in-from-bottom-4">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Quick View
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 lg:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                            {/* Product Image */}
                            <div className="space-y-4">
                                <div className="aspect-square overflow-hidden rounded-xl bg-gray-50 shadow-sm">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                {/* Thumbnail Gallery */}
                                <div className="flex gap-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="w-20 h-20 rounded-lg border-2 border-gray-200 overflow-hidden cursor-pointer hover:border-blue-500 transition-all duration-200 hover:shadow-md"
                                        >
                                            <img
                                                src={product.image}
                                                alt={`${product.name} view ${i}`}
                                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="space-y-6">
                                {/* Badges */}
                                <div className="flex gap-2">
                                    {product.isNew && (
                                        <span className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
                                            New
                                        </span>
                                    )}
                                    {product.discount && (
                                        <span className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
                                            -{product.discount}% OFF
                                        </span>
                                    )}
                                    <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1.5 rounded-full font-medium">
                                        {product.category}
                                    </span>
                                </div>

                                {/* Title & Rating */}
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                        {product.name}
                                    </h1>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`w-5 h-5 ${
                                                        i < product.rating
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
                                        <span className="text-gray-600 font-medium">
                                            {product.rating} (
                                            {product.reviewCount} reviews)
                                        </span>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-4xl font-bold text-gray-900">
                                            ${product.price}
                                        </span>
                                        {product.originalPrice &&
                                            product.originalPrice >
                                                product.price && (
                                                <span className="text-xl text-gray-500 line-through">
                                                    ${product.originalPrice}
                                                </span>
                                            )}
                                    </div>
                                    {product.discount && (
                                        <span className="text-green-600 font-medium text-lg">
                                            Save $
                                            {(
                                                product.originalPrice -
                                                product.price
                                            ).toFixed(2)}
                                            !
                                        </span>
                                    )}
                                </div>

                                {/* Product Details */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600 font-medium">
                                            Category:
                                        </span>
                                        <span className="text-gray-900 bg-gray-100 px-2 py-1 rounded text-sm">
                                            {product.category}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600 font-medium">
                                            Brand:
                                        </span>
                                        <span className="text-gray-900 bg-gray-100 px-2 py-1 rounded text-sm">
                                            {product.brand}
                                        </span>
                                    </div>
                                    {product.description && (
                                        <div className="pt-3 border-t border-gray-200">
                                            <p className="text-gray-600 leading-relaxed">
                                                {product.description}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="space-y-3">
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="w-full"
                                        onClick={handleAddToCart}
                                    >
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                                            />
                                        </svg>
                                        Add to Cart - ${product.price}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="w-full"
                                    >
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                            />
                                        </svg>
                                        Add to Wishlist
                                    </Button>
                                </div>

                                {/* Additional Info */}
                                <div className="pt-6 border-t border-gray-200">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50">
                                            <svg
                                                className="w-4 h-4 text-green-500 flex-shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            <span className="font-medium">
                                                Free Shipping
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50">
                                            <svg
                                                className="w-4 h-4 text-blue-500 flex-shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            <span className="font-medium">
                                                30 Day Returns
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-50">
                                            <svg
                                                className="w-4 h-4 text-purple-500 flex-shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            <span className="font-medium">
                                                Secure Payment
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-50">
                                            <svg
                                                className="w-4 h-4 text-orange-500 flex-shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            <span className="font-medium">
                                                24/7 Support
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuickViewModal
