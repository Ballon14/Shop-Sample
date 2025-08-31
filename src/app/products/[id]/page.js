"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Header from "../../../components/ui/Header"
import Button from "../../../components/ui/Button"
import Toast from "../../../components/ui/Toast"
import { ProductCardSkeleton } from "../../../components/ui/Skeleton"

const fetchProduct = async (id) => {
    try {
        const response = await fetch(`/api/products/${id}`)
        const result = await response.json()

        if (result.success) {
            return result.data
        } else {
            throw new Error(result.error)
        }
    } catch (error) {
        console.error("Error fetching product:", error)
        return null
    }
}

const addToCart = async (productId, quantity = 1) => {
    try {
        const response = await fetch("/api/cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: 1,
                productId,
                quantity,
            }),
        })

        const result = await response.json()
        return result.success
    } catch (error) {
        console.error("Error adding to cart:", error)
        return false
    }
}

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [product, setProduct] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(0)
    const [toast, setToast] = useState(null)
    const [relatedProducts, setRelatedProducts] = useState([])

    useEffect(() => {
        const loadProduct = async () => {
            if (params.id) {
                const productData = await fetchProduct(params.id)
                setProduct(productData)

                // Load related products
                if (productData) {
                    const response = await fetch(
                        `/api/products?category=${productData.category}&limit=4`
                    )
                    const result = await response.json()
                    if (result.success) {
                        setRelatedProducts(
                            result.data.filter((p) => p.id !== productData.id)
                        )
                    }
                }
            }
            setIsLoading(false)
        }

        loadProduct()
    }, [params.id])

    const handleAddToCart = async () => {
        if (!product) return

        const success = await addToCart(product.id, quantity)
        if (success) {
            setToast({
                message: `${quantity}x ${product.name} added to cart!`,
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

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
            setQuantity(newQuantity)
        }
    }

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <svg
                key={i}
                className={`w-5 h-5 ${
                    i < rating ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <ProductCardSkeleton />
                        <div className="space-y-6">
                            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-12">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Product not found
                        </h1>
                        <p className="text-gray-600 mb-6">
                            The product you're looking for doesn't exist or has
                            been removed.
                        </p>
                        <Button onClick={() => router.push("/")}>
                            Back to Shop
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex mb-8" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <button
                                onClick={() => router.push("/")}
                                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                            >
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                </svg>
                                Home
                            </button>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg
                                    className="w-6 h-6 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <button
                                    onClick={() => router.push("/")}
                                    className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                                >
                                    Products
                                </button>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <svg
                                    className="w-6 h-6 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                                    {product.name}
                                </span>
                            </div>
                        </li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-sm">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Image Gallery (if multiple images) */}
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 ${
                                            selectedImage === index
                                                ? "border-blue-500"
                                                : "border-gray-200"
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Badges */}
                        <div className="flex gap-2">
                            {product.isNew && (
                                <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                                    New
                                </span>
                            )}
                            {product.discount && (
                                <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                                    -{product.discount}% OFF
                                </span>
                            )}
                            <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                                {product.category}
                            </span>
                        </div>

                        {/* Product Name */}
                        <h1 className="text-3xl font-bold text-gray-900">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center">
                                {renderStars(product.rating)}
                            </div>
                            <span className="text-sm text-gray-600">
                                {product.rating} ({product.reviewCount} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-bold text-gray-900">
                                ${product.price}
                            </span>
                            {product.originalPrice &&
                                product.originalPrice > product.price && (
                                    <span className="text-xl text-gray-500 line-through">
                                        ${product.originalPrice}
                                    </span>
                                )}
                            {product.discount && (
                                <span className="text-sm text-green-600 font-medium">
                                    Save $
                                    {(
                                        product.originalPrice - product.price
                                    ).toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Description
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {product.description ||
                                    "No description available."}
                            </p>
                        </div>

                        {/* Product Details */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm text-gray-500">
                                    Brand
                                </span>
                                <p className="font-medium text-gray-900">
                                    {product.brand}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">
                                    SKU
                                </span>
                                <p className="font-medium text-gray-900">
                                    {product.sku}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">
                                    Category
                                </span>
                                <p className="font-medium text-gray-900">
                                    {product.category}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">
                                    Stock
                                </span>
                                <p className="font-medium text-gray-900">
                                    {product.stock > 0
                                        ? `${product.stock} available`
                                        : "Out of stock"}
                                </p>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quantity
                            </label>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() =>
                                        handleQuantityChange(quantity - 1)
                                    }
                                    disabled={quantity <= 1}
                                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                            d="M20 12H4"
                                        />
                                    </svg>
                                </button>
                                <span className="w-16 text-center text-lg font-medium">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() =>
                                        handleQuantityChange(quantity + 1)
                                    }
                                    disabled={quantity >= (product.stock || 10)}
                                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <Button
                                variant="primary"
                                size="lg"
                                className="flex-1"
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                            >
                                {product.stock === 0
                                    ? "Out of Stock"
                                    : "Add to Cart"}
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-12 h-12 p-0"
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
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            </Button>
                        </div>

                        {/* Additional Info */}
                        <div className="border-t pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <div>
                                    <svg
                                        className="w-8 h-8 text-green-500 mx-auto mb-2"
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
                                    <p className="text-sm font-medium text-gray-900">
                                        Free Shipping
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        On orders over $50
                                    </p>
                                </div>
                                <div>
                                    <svg
                                        className="w-8 h-8 text-blue-500 mx-auto mb-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <p className="text-sm font-medium text-gray-900">
                                        30 Day Returns
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Money back guarantee
                                    </p>
                                </div>
                                <div>
                                    <svg
                                        className="w-8 h-8 text-purple-500 mx-auto mb-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z"
                                        />
                                    </svg>
                                    <p className="text-sm font-medium text-gray-900">
                                        24/7 Support
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Always here to help
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">
                            Related Products
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <div
                                    key={relatedProduct.id}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer"
                                    onClick={() =>
                                        router.push(
                                            `/products/${relatedProduct.id}`
                                        )
                                    }
                                >
                                    <div className="aspect-square overflow-hidden bg-gray-50">
                                        <img
                                            src={relatedProduct.image}
                                            alt={relatedProduct.name}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                            {relatedProduct.name}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-gray-900">
                                                ${relatedProduct.price}
                                            </span>
                                            {relatedProduct.originalPrice && (
                                                <span className="text-sm text-gray-500 line-through">
                                                    $
                                                    {
                                                        relatedProduct.originalPrice
                                                    }
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

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
