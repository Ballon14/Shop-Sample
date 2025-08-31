"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Button from "../../components/ui/Button"
import { setAuth, isLoggedIn, deriveRoleFromUsername } from "../../lib/auth"

export default function LoginPage() {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (isLoggedIn()) router.replace("/")
    }, [router])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        if (!username.trim()) {
            setError("Please enter your username")
            return
        }
        setLoading(true)
        const role = deriveRoleFromUsername(username.trim())
        setAuth({ user: { name: username.trim() }, role })
        router.replace("/")
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-6">
                    <Link href="/" className="inline-block">
                        <span className="text-3xl font-bold text-blue-600">
                            ShopHub
                        </span>
                    </Link>
                    <p className="text-gray-600 mt-2">
                        Sign in to continue to your account
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <h1 className="text-xl font-semibold text-gray-900">
                        Sign in
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Use your username. Admin access is granted by allowlist.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                htmlFor="username"
                            >
                                Username
                            </label>
                            <div className="relative">
                                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <svg
                                        className="h-5 w-5"
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
                                </span>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        error
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="Your username"
                                />
                            </div>
                            {error && (
                                <p className="mt-1 text-sm text-red-600">
                                    {error}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="text-sm text-blue-600 hover:text-blue-700"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">
                    Admins: set NEXT_PUBLIC_ADMIN_USERS in .env.local and login
                    with a listed username.
                </p>
            </div>
        </div>
    )
}
