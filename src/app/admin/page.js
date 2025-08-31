"use client"

import React, { useState, useEffect } from "react"
import Button from "../../components/ui/Button"
import Toast from "../../components/ui/Toast"
import ImageUpload from "../../components/ui/ImageUpload"
import { getRole, isLoggedIn } from "../../lib/auth"
import { useRouter } from "next/navigation"
import { BarChart, DonutChart } from "../../components/ui/Charts"

export default function AdminPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("overview")
    const [products, setProducts] = useState([])
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        originalPrice: "",
        category: "",
        brand: "",
        description: "",
        stock: "",
        sku: "",
        image: "",
        rating: "",
        reviewCount: "",
        isNew: true,
        discount: "",
    })
    const [toast, setToast] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterCategory, setFilterCategory] = useState("")
    const [filterBrand, setFilterBrand] = useState("")

    // Role guard
    useEffect(() => {
        const role = getRole()
        if (!isLoggedIn() || role !== "admin") {
            router.replace("/login")
        }
    }, [router])

    // Load products on component mount
    useEffect(() => {
        loadProducts()
    }, [])

    const loadProducts = async () => {
        try {
            const response = await fetch("/api/products")
            const result = await response.json()
            if (result.success) {
                setProducts(result.data)
            }
        } catch (error) {
            console.error("Error loading products:", error)
            showToast("Failed to load products", "error")
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        if (isEditing) {
            setEditingProduct((prev) => ({
                ...prev,
                [name]: value,
            }))
        } else {
            setNewProduct((prev) => ({
                ...prev,
                [name]: value,
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const productData = {
                ...newProduct,
                price: parseFloat(newProduct.price) || 0,
                originalPrice: newProduct.originalPrice
                    ? parseFloat(newProduct.originalPrice)
                    : null,
                stock: parseInt(newProduct.stock) || 0,
                rating: newProduct.rating ? parseFloat(newProduct.rating) : 0,
                reviewCount: newProduct.reviewCount
                    ? parseInt(newProduct.reviewCount)
                    : 0,
                discount: newProduct.discount
                    ? parseFloat(newProduct.discount)
                    : null,
                image:
                    newProduct.image ||
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
            }

            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            })

            const result = await response.json()

            if (result.success) {
                showToast("Product created successfully!", "success")
                setNewProduct({
                    name: "",
                    price: "",
                    originalPrice: "",
                    category: "",
                    brand: "",
                    description: "",
                    stock: "",
                    sku: "",
                    image: "",
                    rating: "",
                    reviewCount: "",
                    isNew: true,
                    discount: "",
                })
                loadProducts() // Reload products
            } else {
                showToast(result.error || "Failed to create product", "error")
            }
        } catch (error) {
            console.error("Error creating product:", error)
            showToast("Failed to create product", "error")
        } finally {
            setIsLoading(false)
        }
    }

    const deleteProduct = async (id) => {
        if (!confirm("Are you sure you want to delete this product?")) return

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            })

            const result = await response.json()

            if (result.success) {
                showToast("Product deleted successfully!", "success")
                loadProducts() // Reload products
            } else {
                showToast(result.error || "Failed to delete product", "error")
            }
        } catch (error) {
            console.error("Error deleting product:", error)
            showToast("Failed to delete product", "error")
        }
    }

    const showToast = (message, type = "info") => {
        setToast({ message, type, duration: 3000 })
    }

    const handleImageUpload = (imageUrl) => {
        if (isEditing) {
            setEditingProduct((prev) => ({
                ...prev,
                image: imageUrl,
            }))
        } else {
            setNewProduct((prev) => ({
                ...prev,
                image: imageUrl,
            }))
        }
    }

    const handleEditProduct = (product) => {
        setEditingProduct({
            ...product,
            originalPrice: product.originalPrice || "",
            discount: product.discount || "",
            rating: product.rating || "",
            reviewCount: product.reviewCount || "",
        })
        setIsEditing(true)
    }

    const handleUpdateProduct = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const productData = {
                ...editingProduct,
                price: parseFloat(editingProduct.price) || 0,
                originalPrice: editingProduct.originalPrice
                    ? parseFloat(editingProduct.originalPrice)
                    : null,
                stock: parseInt(editingProduct.stock) || 0,
                rating: editingProduct.rating
                    ? parseFloat(editingProduct.rating)
                    : 0,
                reviewCount: editingProduct.reviewCount
                    ? parseInt(editingProduct.reviewCount)
                    : 0,
                discount: editingProduct.discount
                    ? parseFloat(editingProduct.discount)
                    : null,
            }

            const response = await fetch(`/api/products/${editingProduct.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            })

            const result = await response.json()

            if (result.success) {
                showToast("Product updated successfully!", "success")
                setEditingProduct(null)
                setIsEditing(false)
                loadProducts()
            } else {
                showToast(result.error || "Failed to update product", "error")
            }
        } catch (error) {
            console.error("Error updating product:", error)
            showToast("Failed to update product", "error")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancelEdit = () => {
        setEditingProduct(null)
        setIsEditing(false)
    }

    // Derived metrics for Overview
    const totalProducts = products.length
    const totalValue = products.reduce(
        (sum, p) => sum + (Number(p.price) || 0) * (Number(p.stock) || 0),
        0
    )
    const lowStock = products.filter((p) => (Number(p.stock) || 0) <= 5).length
    const averagePrice = totalProducts
        ? products.reduce((s, p) => s + (Number(p.price) || 0), 0) /
          totalProducts
        : 0
    const categoryCountMap = products.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1
        return acc
    }, {})
    const categoryBarData = Object.entries(categoryCountMap).map(
        ([label, count]) => ({ label, value: count })
    )
    const stockCoverage = products.reduce(
        (s, p) => s + (Number(p.stock) || 0),
        0
    )

    // Filter products
    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory =
            !filterCategory || product.category === filterCategory
        const matchesBrand = !filterBrand || product.brand === filterBrand

        return matchesSearch && matchesCategory && matchesBrand
    })

    const categories = [
        "Electronics",
        "Clothing",
        "Home & Garden",
        "Sports",
        "Books",
        "Beauty",
        "Automotive",
        "Toys",
    ]
    const brands = [
        "Apple",
        "Samsung",
        "Nike",
        "Adidas",
        "Sony",
        "LG",
        "Canon",
        "Dell",
        "Other",
    ]

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Admin</h1>
                    <p className="text-gray-600 mt-2">
                        Manage your store data and settings
                    </p>
                </div>

                {/* Admin Nav Tabs */}
                <div className="mb-8 border-b border-gray-200">
                    <nav className="flex gap-2">
                        {[
                            { id: "overview", label: "Overview" },
                            { id: "products", label: "Products" },
                            { id: "orders", label: "Orders" },
                            { id: "users", label: "Users" },
                            { id: "settings", label: "Settings" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${
                                    activeTab === tab.id
                                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent"
                                } px-3 py-2 rounded-md text-sm font-medium`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Overview */}
                {activeTab === "overview" && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                <p className="text-sm text-gray-500">
                                    Total Products
                                </p>
                                <p className="text-2xl font-bold mt-1 text-gray-900">
                                    {totalProducts}
                                </p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                <p className="text-sm text-gray-500">
                                    Inventory Value
                                </p>
                                <p className="text-2xl font-bold mt-1 text-gray-900">
                                    ${totalValue.toFixed(2)}
                                </p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                <p className="text-sm text-gray-500">
                                    Avg. Price
                                </p>
                                <p className="text-2xl font-bold mt-1 text-gray-900">
                                    ${averagePrice.toFixed(2)}
                                </p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                <p className="text-sm text-gray-500">
                                    Low Stock
                                </p>
                                <p className="text-2xl font-bold mt-1 text-gray-900">
                                    {lowStock}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm lg:col-span-2">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-gray-900">
                                        Products by Category
                                    </h3>
                                    <span className="text-xs text-gray-500">
                                        count
                                    </span>
                                </div>
                                <BarChart
                                    data={categoryBarData}
                                    height={180}
                                    className="max-h-48"
                                />
                                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                                    {categoryBarData.map((d) => (
                                        <div
                                            key={d.label}
                                            className="flex justify-between"
                                        >
                                            <span>{d.label}</span>
                                            <span className="font-medium">
                                                {d.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                <h3 className="font-semibold text-gray-900 mb-3">
                                    Stock Coverage
                                </h3>
                                <div className="flex items-center justify-center">
                                    <DonutChart
                                        value={stockCoverage}
                                        max={Math.max(stockCoverage, 100)}
                                        label="in stock"
                                        className="max-w-[140px]"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 text-center mt-2">
                                    Total units in stock across products
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {/* Products tab */}
                {activeTab === "products" && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Add/Edit Product Form */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    {isEditing
                                        ? "Edit Product"
                                        : "Add New Product"}
                                </h2>

                                <form
                                    onSubmit={
                                        isEditing
                                            ? handleUpdateProduct
                                            : handleSubmit
                                    }
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={
                                                isEditing
                                                    ? editingProduct.name
                                                    : newProduct.name
                                            }
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter product name"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Price *
                                            </label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={
                                                    isEditing
                                                        ? editingProduct.price
                                                        : newProduct.price
                                                }
                                                onChange={handleInputChange}
                                                required
                                                step="0.01"
                                                min="0"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="0.00"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Original Price
                                            </label>
                                            <input
                                                type="number"
                                                name="originalPrice"
                                                value={
                                                    isEditing
                                                        ? editingProduct.originalPrice
                                                        : newProduct.originalPrice
                                                }
                                                onChange={handleInputChange}
                                                step="0.01"
                                                min="0"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Stock *
                                            </label>
                                            <input
                                                type="number"
                                                name="stock"
                                                value={
                                                    isEditing
                                                        ? editingProduct.stock
                                                        : newProduct.stock
                                                }
                                                onChange={handleInputChange}
                                                required
                                                min="0"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="0"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Rating
                                            </label>
                                            <input
                                                type="number"
                                                name="rating"
                                                value={
                                                    isEditing
                                                        ? editingProduct.rating
                                                        : newProduct.rating
                                                }
                                                onChange={handleInputChange}
                                                step="0.1"
                                                min="0"
                                                max="5"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="0.0"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Review Count
                                            </label>
                                            <input
                                                type="number"
                                                name="reviewCount"
                                                value={
                                                    isEditing
                                                        ? editingProduct.reviewCount
                                                        : newProduct.reviewCount
                                                }
                                                onChange={handleInputChange}
                                                min="0"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Discount (%)
                                            </label>
                                            <input
                                                type="number"
                                                name="discount"
                                                value={
                                                    isEditing
                                                        ? editingProduct.discount
                                                        : newProduct.discount
                                                }
                                                onChange={handleInputChange}
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="0"
                                            />
                                        </div>

                                        <div className="flex items-center">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="isNew"
                                                    checked={
                                                        isEditing
                                                            ? !!editingProduct.isNew
                                                            : !!newProduct.isNew
                                                    }
                                                    onChange={(e) =>
                                                        isEditing
                                                            ? setEditingProduct(
                                                                  (prev) => ({
                                                                      ...prev,
                                                                      isNew: e
                                                                          .target
                                                                          .checked,
                                                                  })
                                                              )
                                                            : setNewProduct(
                                                                  (prev) => ({
                                                                      ...prev,
                                                                      isNew: e
                                                                          .target
                                                                          .checked,
                                                                  })
                                                              )
                                                    }
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">
                                                    Mark as New Product
                                                </span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Category *
                                            </label>
                                            <select
                                                name="category"
                                                value={
                                                    isEditing
                                                        ? editingProduct.category
                                                        : newProduct.category
                                                }
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">
                                                    Select category
                                                </option>
                                                {categories.map((category) => (
                                                    <option
                                                        key={category}
                                                        value={category}
                                                    >
                                                        {category}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Brand *
                                            </label>
                                            <select
                                                name="brand"
                                                value={
                                                    isEditing
                                                        ? editingProduct.brand
                                                        : newProduct.brand
                                                }
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">
                                                    Select brand
                                                </option>
                                                {brands.map((brand) => (
                                                    <option
                                                        key={brand}
                                                        value={brand}
                                                    >
                                                        {brand}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            SKU *
                                        </label>
                                        <input
                                            type="text"
                                            name="sku"
                                            value={
                                                isEditing
                                                    ? editingProduct.sku
                                                    : newProduct.sku
                                            }
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter SKU"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={
                                                isEditing
                                                    ? editingProduct.description
                                                    : newProduct.description
                                            }
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter product description"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Image
                                        </label>
                                        <ImageUpload
                                            onImageUpload={handleImageUpload}
                                            currentImage={
                                                isEditing
                                                    ? editingProduct.image
                                                    : newProduct.image
                                            }
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="lg"
                                            className="flex-1"
                                            disabled={isLoading}
                                        >
                                            {isLoading
                                                ? isEditing
                                                    ? "Updating..."
                                                    : "Creating..."
                                                : isEditing
                                                ? "Update Product"
                                                : "Create Product"}
                                        </Button>

                                        {isEditing && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="lg"
                                                onClick={handleCancelEdit}
                                                disabled={isLoading}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {/* Database Stats */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    Database Statistics
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                        <span className="text-blue-700 font-medium">
                                            Total Products
                                        </span>
                                        <span className="text-blue-900 font-bold text-xl">
                                            {products.length}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <span className="text-green-700 font-medium">
                                            Categories
                                        </span>
                                        <span className="text-green-900 font-bold text-xl">
                                            {categories.length}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                        <span className="text-purple-700 font-medium">
                                            Brands
                                        </span>
                                        <span className="text-purple-900 font-bold text-xl">
                                            {brands.length}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                        <span className="text-orange-700 font-medium">
                                            Total Value
                                        </span>
                                        <span className="text-orange-900 font-bold text-xl">
                                            $
                                            {products
                                                .reduce(
                                                    (sum, p) =>
                                                        sum + p.price * p.stock,
                                                    0
                                                )
                                                .toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                                        <span className="text-indigo-700 font-medium">
                                            Avg. Price
                                        </span>
                                        <span className="text-indigo-900 font-bold text-xl">
                                            $
                                            {products.length > 0
                                                ? (
                                                      products.reduce(
                                                          (sum, p) =>
                                                              sum + p.price,
                                                          0
                                                      ) / products.length
                                                  ).toFixed(2)
                                                : "0.00"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                                        <span className="text-pink-700 font-medium">
                                            Low Stock (≤5)
                                        </span>
                                        <span className="text-pink-900 font-bold text-xl">
                                            {
                                                products.filter(
                                                    (p) => p.stock <= 5
                                                ).length
                                            }
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={async () => {
                                            try {
                                                const response = await fetch(
                                                    "/api/admin/backup",
                                                    { method: "POST" }
                                                )
                                                const result =
                                                    await response.json()
                                                if (result.success) {
                                                    showToast(
                                                        "Database backup completed!",
                                                        "success"
                                                    )
                                                } else {
                                                    showToast(
                                                        result.error ||
                                                            "Backup failed",
                                                        "error"
                                                    )
                                                }
                                            } catch (error) {
                                                showToast(
                                                    "Backup failed",
                                                    "error"
                                                )
                                            }
                                        }}
                                    >
                                        Backup Database
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={async () => {
                                            try {
                                                const response = await fetch(
                                                    "/api/admin/optimize",
                                                    { method: "POST" }
                                                )
                                                const result =
                                                    await response.json()
                                                if (result.success) {
                                                    showToast(
                                                        "Database optimized!",
                                                        "success"
                                                    )
                                                } else {
                                                    showToast(
                                                        result.error ||
                                                            "Optimization failed",
                                                        "error"
                                                    )
                                                }
                                            } catch (error) {
                                                showToast(
                                                    "Optimization failed",
                                                    "error"
                                                )
                                            }
                                        }}
                                    >
                                        Optimize Database
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Low Stock Alert */}
                        {products.filter((p) => p.stock <= 5).length > 0 && (
                            <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <svg
                                        className="w-5 h-5 text-red-400 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <h3 className="text-lg font-medium text-red-800">
                                        Low Stock Alert
                                    </h3>
                                </div>
                                <p className="text-red-700 mt-1">
                                    {
                                        products.filter((p) => p.stock <= 5)
                                            .length
                                    }{" "}
                                    product(s) have low stock (≤5 items)
                                </p>
                            </div>
                        )}

                        {/* Products List */}
                        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Current Products (
                                        {filteredProducts.length} of{" "}
                                        {products.length})
                                    </h2>

                                    {/* Search and Filters */}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />

                                        <select
                                            value={filterCategory}
                                            onChange={(e) =>
                                                setFilterCategory(
                                                    e.target.value
                                                )
                                            }
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">
                                                All Categories
                                            </option>
                                            {categories.map((category) => (
                                                <option
                                                    key={category}
                                                    value={category}
                                                >
                                                    {category}
                                                </option>
                                            ))}
                                        </select>

                                        <select
                                            value={filterBrand}
                                            onChange={(e) =>
                                                setFilterBrand(e.target.value)
                                            }
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">All Brands</option>
                                            {brands.map((brand) => (
                                                <option
                                                    key={brand}
                                                    value={brand}
                                                >
                                                    {brand}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Brand
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Stock
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredProducts.length > 0 ? (
                                            filteredProducts.map((product) => (
                                                <tr key={product.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <img
                                                                className="h-10 w-10 rounded-lg object-cover"
                                                                src={
                                                                    product.image
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                            />
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {
                                                                        product.name
                                                                    }
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {
                                                                        product.sku
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {product.category}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {product.brand}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        ${product.price}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        <div className="flex items-center">
                                                            <span
                                                                className={
                                                                    product.stock <=
                                                                    5
                                                                        ? "text-red-600 font-medium"
                                                                        : ""
                                                                }
                                                            >
                                                                {product.stock}
                                                            </span>
                                                            {product.stock <=
                                                                5 && (
                                                                <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                                                    Low
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleEditProduct(
                                                                        product
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                onClick={() =>
                                                                    deleteProduct(
                                                                        product.id
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    className="px-6 py-12 text-center"
                                                >
                                                    <div className="text-gray-500">
                                                        <svg
                                                            className="mx-auto h-12 w-12 text-gray-400 mb-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                                            />
                                                        </svg>
                                                        <p className="text-lg font-medium text-gray-900 mb-2">
                                                            No products found
                                                        </p>
                                                        <p className="text-gray-500">
                                                            Try adjusting your
                                                            search or filter
                                                            criteria.
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* Orders tab */}
                {activeTab === "orders" && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Orders
                        </h2>
                        <p className="text-gray-600">
                            Manage and view all orders placed on the platform.
                        </p>
                        <div className="mt-6">
                            <Button variant="primary" size="lg">
                                View All Orders
                            </Button>
                        </div>
                    </div>
                )}

                {/* Users tab */}
                {activeTab === "users" && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Users
                        </h2>
                        <p className="text-gray-600">
                            Manage and view all registered users.
                        </p>
                        <div className="mt-6">
                            <Button variant="primary" size="lg">
                                View All Users
                            </Button>
                        </div>
                    </div>
                )}

                {/* Settings tab */}
                {activeTab === "settings" && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Settings
                        </h2>
                        <p className="text-gray-600">
                            Configure application settings and preferences.
                        </p>
                        <div className="mt-6">
                            <Button variant="primary" size="lg">
                                Manage Settings
                            </Button>
                        </div>
                    </div>
                )}
            </div>

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
