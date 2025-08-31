import React from "react"
import Link from "next/link"
import Button from "./Button"

const ProductCard = ({
    product,
    onAddToCart,
    onViewDetails,
    className = "",
}) => {
    const {
        id,
        name,
        price,
        originalPrice,
        image,
        rating,
        reviewCount,
        isNew,
        discount,
    } = product

    return (
        <div
            className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group h-full flex flex-col ${className}`}
        >
            {/* Product Image */}
            <Link href={`/products/${id}`}>
                <div className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {isNew && (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                New
                            </span>
                        )}
                        {discount && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                -{discount}%
                            </span>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <svg
                                className="w-4 h-4 text-gray-600"
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
                        </button>
                    </div>
                </div>
            </Link>

            {/* Product Info */}
            <div className="p-4 flex-1 flex flex-col">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
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
                    <span className="text-sm text-gray-500 ml-1">
                        ({reviewCount})
                    </span>
                </div>

                {/* Product Name */}
                <Link href={`/products/${id}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer">
                        {name}
                    </h3>
                </Link>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-gray-900">
                        ${price}
                    </span>
                    {originalPrice && originalPrice > price && (
                        <span className="text-sm text-gray-500 line-through">
                            ${originalPrice}
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                    <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => onAddToCart(product)}
                    >
                        Add to Cart
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(product)}
                    >
                        Quick View
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard
