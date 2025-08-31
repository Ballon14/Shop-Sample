"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Button from "./Button"
import { isLoggedIn, getRole } from "../../lib/auth"

const Header = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isAccountOpen, setIsAccountOpen] = useState(false)
    const [cartCount, setCartCount] = useState(0)
    const [authState, setAuthState] = useState({ loggedIn: false, role: null })
    const accountRef = useRef(null)

    // Fetch cart count
    useEffect(() => {
        const fetchCartCount = async () => {
            try {
                const response = await fetch("/api/cart?userId=1")
                const result = await response.json()
                if (result.success) {
                    const totalItems = result.data.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                    )
                    setCartCount(totalItems)
                }
            } catch (error) {
                console.error("Error fetching cart count:", error)
            }
        }

        fetchCartCount()
    }, [])

    // Auth state sync
    useEffect(() => {
        const update = () => {
            setAuthState({ loggedIn: isLoggedIn(), role: getRole() })
        }
        update()
        if (typeof window !== "undefined") {
            window.addEventListener("auth-changed", update)
        }
        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("auth-changed", update)
            }
        }
    }, [])

    // Close account menu on outside click / escape
    useEffect(() => {
        const handleClick = (e) => {
            if (
                isAccountOpen &&
                accountRef.current &&
                !accountRef.current.contains(e.target)
            ) {
                setIsAccountOpen(false)
            }
        }
        const handleKey = (e) => {
            if (e.key === "Escape") setIsAccountOpen(false)
        }
        document.addEventListener("mousedown", handleClick)
        document.addEventListener("keydown", handleKey)
        return () => {
            document.removeEventListener("mousedown", handleClick)
            document.removeEventListener("keydown", handleKey)
        }
    }, [isAccountOpen])

    const navigation = [
        { name: "Home", href: "/" },
        { name: "Shop", href: "/shop" },
        { name: "Categories", href: "/categories" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ]

    return (
        <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0">
                            <h1 className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                ShopHub
                            </h1>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-gray-700 hover:text-blue-600 px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 hover:bg-gray-50"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side actions */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Search */}
                        <div className="relative">
                            {isSearchOpen ? (
                                <div className="absolute right-0 top-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <div className="relative flex-1">
                                                <svg
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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
                                                <input
                                                    type="text"
                                                    placeholder="Search products, brands, categories..."
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    autoFocus
                                                />
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    setIsSearchOpen(false)
                                                }
                                                className="ml-2"
                                            >
                                                ✕
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                    aria-label="Open search"
                                >
                                    <svg
                                        className="w-5 h-5"
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
                            )}
                        </div>

                        {/* Account */}
                        {authState.loggedIn ? (
                            <div className="relative" ref={accountRef}>
                                <button
                                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                    aria-haspopup="menu"
                                    aria-expanded={isAccountOpen}
                                    aria-label="Account menu"
                                    onClick={() => setIsAccountOpen((v) => !v)}
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </button>
                                {isAccountOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                                        <div className="py-1">
                                            {authState.role === "admin" && (
                                                <Link
                                                    href="/admin"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    onClick={() =>
                                                        setIsAccountOpen(false)
                                                    }
                                                >
                                                    Admin
                                                </Link>
                                            )}
                                            <Link
                                                href="/logout"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                onClick={() =>
                                                    setIsAccountOpen(false)
                                                }
                                            >
                                                Logout
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium"
                            >
                                Sign in
                            </Link>
                        )}

                        {/* Cart */}
                        <Link
                            href="/cart"
                            className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            <svg
                                className="w-5 h-5"
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
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
                            aria-label="Open menu"
                            aria-expanded={isMobileMenuOpen}
                            onClick={() => setIsMobileMenuOpen((v) => !v)}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isMobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white">
                    <nav className="px-4 py-3 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    )
}

export default Header
