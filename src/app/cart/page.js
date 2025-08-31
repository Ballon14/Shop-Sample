"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Header from "../../components/ui/Header"
import Button from "../../components/ui/Button"
import Toast from "../../components/ui/Toast"

const fetchCart = async (userId = 1) => {
    try {
        const response = await fetch(`/api/cart?userId=${userId}`)
        const result = await response.json()

        if (result.success) {
            return result.data
        } else {
            throw new Error(result.error)
        }
    } catch (error) {
        console.error("Error fetching cart:", error)
        return []
    }
}

const updateCartItem = async (cartItemId, quantity) => {
    try {
        const response = await fetch(`/api/cart/${cartItemId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity }),
        })

        const result = await response.json()
        return result.success
    } catch (error) {
        console.error("Error updating cart item:", error)
        return false
    }
}

const removeCartItem = async (cartItemId) => {
    try {
        const response = await fetch(`/api/cart/${cartItemId}`, {
            method: "DELETE",
        })

        const result = await response.json()
        return result.success
    } catch (error) {
        console.error("Error removing cart item:", error)
        return false
    }
}

export default function CartPage() {
    const [cartItems, setCartItems] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [toast, setToast] = useState(null)

    useEffect(() => {
        const loadCart = async () => {
            const items = await fetchCart()
            setCartItems(items)
            setIsLoading(false)
        }

        loadCart()
    }, [])

    const handleQuantityChange = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return

        const success = await updateCartItem(cartItemId, newQuantity)
        if (success) {
            setCartItems((prev) =>
                prev.map((item) =>
                    item.id === cartItemId
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            )
        } else {
            setToast({
                message: "Failed to update quantity. Please try again.",
                type: "error",
                duration: 3000,
            })
        }
    }

    const handleRemoveItem = async (cartItemId) => {
        const success = await removeCartItem(cartItemId)
        if (success) {
            setCartItems((prev) =>
                prev.filter((item) => item.id !== cartItemId)
            )
            setToast({
                message: "Item removed from cart",
                type: "success",
                duration: 3000,
            })
        } else {
            setToast({
                message: "Failed to remove item. Please try again.",
                type: "error",
                duration: 3000,
            })
        }
    }

    const calculateSubtotal = () => {
        return cartItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        )
    }

    const calculateShipping = () => {
        return calculateSubtotal() > 50 ? 0 : 5.99
    }

    const calculateTotal = () => {
        return calculateSubtotal() + calculateShipping()
    }

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <svg
                key={i}
                className={`w-4 h-4 ${
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
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-lg p-6 shadow-sm"
                                >
                                    <div className="flex gap-4">
                                        <div className="w-24 h-24 bg-gray-200 rounded"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                            <Link
                                href="/"
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
                            </Link>
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
                                    Shopping Cart
                                </span>
                            </div>
                        </li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">
                            Shopping Cart ({cartItems.length} items)
                        </h1>

                        {cartItems.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                                <div className="text-gray-400 mb-4">
                                    <svg
                                        className="mx-auto h-16 w-16"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                                        />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    Your cart is empty
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Looks like you haven't added any items to
                                    your cart yet.
                                </p>
                                <Link href="/">
                                    <Button variant="primary">
                                        Start Shopping
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-lg shadow-sm p-6"
                                    >
                                        <div className="flex gap-4">
                                            {/* Product Image */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    className="w-24 h-24 object-cover rounded-lg"
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <Link
                                                            href={`/products/${item.product.id}`}
                                                        >
                                                            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                                                {
                                                                    item.product
                                                                        .name
                                                                }
                                                            </h3>
                                                        </Link>
                                                        <p className="text-sm text-gray-500 mb-2">
                                                            {item.product.brand}{" "}
                                                            •{" "}
                                                            {
                                                                item.product
                                                                    .category
                                                            }
                                                        </p>

                                                        {/* Rating */}
                                                        <div className="flex items-center gap-1 mb-2">
                                                            <div className="flex items-center">
                                                                {renderStars(
                                                                    item.product
                                                                        .rating
                                                                )}
                                                            </div>
                                                            <span className="text-sm text-gray-500">
                                                                (
                                                                {
                                                                    item.product
                                                                        .reviewCount
                                                                }
                                                                )
                                                            </span>
                                                        </div>

                                                        {/* Price */}
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg font-bold text-gray-900">
                                                                $
                                                                {
                                                                    item.product
                                                                        .price
                                                                }
                                                            </span>
                                                            {item.product
                                                                .originalPrice &&
                                                                item.product
                                                                    .originalPrice >
                                                                    item.product
                                                                        .price && (
                                                                    <span className="text-sm text-gray-500 line-through">
                                                                        $
                                                                        {
                                                                            item
                                                                                .product
                                                                                .originalPrice
                                                                        }
                                                                    </span>
                                                                )}
                                                        </div>
                                                    </div>

                                                    {/* Quantity Controls */}
                                                    <div className="flex flex-col items-end gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleQuantityChange(
                                                                        item.id,
                                                                        item.quantity -
                                                                            1
                                                                    )
                                                                }
                                                                disabled={
                                                                    item.quantity <=
                                                                    1
                                                                }
                                                                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M20 12H4"
                                                                    />
                                                                </svg>
                                                            </button>
                                                            <span className="w-12 text-center font-medium">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    handleQuantityChange(
                                                                        item.id,
                                                                        item.quantity +
                                                                            1
                                                                    )
                                                                }
                                                                disabled={
                                                                    item.quantity >=
                                                                    (item
                                                                        .product
                                                                        .stock ||
                                                                        10)
                                                                }
                                                                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M12 4v16m8-8H4"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </div>

                                                        {/* Remove Button */}
                                                        <button
                                                            onClick={() =>
                                                                handleRemoveItem(
                                                                    item.id
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Item Total */}
                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">
                                                            Item Total:
                                                        </span>
                                                        <span className="font-semibold text-gray-900">
                                                            $
                                                            {(
                                                                item.product
                                                                    .price *
                                                                item.quantity
                                                            ).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Order Summary
                            </h2>

                            {cartItems.length > 0 ? (
                                <>
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                Subtotal
                                            </span>
                                            <span className="font-medium">
                                                $
                                                {calculateSubtotal().toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                Shipping
                                            </span>
                                            <span className="font-medium">
                                                {calculateShipping() === 0
                                                    ? "Free"
                                                    : `$${calculateShipping().toFixed(
                                                          2
                                                      )}`}
                                            </span>
                                        </div>
                                        {calculateShipping() > 0 && (
                                            <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                                                Add $
                                                {(
                                                    50 - calculateSubtotal()
                                                ).toFixed(2)}{" "}
                                                more for free shipping
                                            </div>
                                        )}
                                        <div className="border-t pt-4">
                                            <div className="flex justify-between text-lg font-semibold">
                                                <span>Total</span>
                                                <span>
                                                    $
                                                    {calculateTotal().toFixed(
                                                        2
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="primary"
                                        className="w-full mb-4"
                                    >
                                        Proceed to Checkout
                                    </Button>

                                    <Link href="/">
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Continue Shopping
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <div className="text-center text-gray-500">
                                    <p>No items in cart</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
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
