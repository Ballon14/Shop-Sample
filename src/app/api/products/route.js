import { NextResponse } from "next/server"
import db from "../../../lib/sqlite-database"

// GET /api/products - Get all products or search
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get("q")
        const category = searchParams.get("category")
        const brand = searchParams.get("brand")
        const minPrice = searchParams.get("minPrice")
        const maxPrice = searchParams.get("maxPrice")
        const rating = searchParams.get("rating")
        const sortBy = searchParams.get("sortBy") || "featured"
        const page = parseInt(searchParams.get("page")) || 1
        const limit = parseInt(searchParams.get("limit")) || 10

        // Build filters object
        const filters = {}
        if (query) filters.query = query
        if (category) filters.category = category
        if (brand) filters.brand = brand
        if (minPrice) filters.minPrice = parseFloat(minPrice)
        if (maxPrice) filters.maxPrice = parseFloat(maxPrice)
        if (rating) filters.rating = parseFloat(rating)
        if (sortBy) filters.sortBy = sortBy
        if (page) filters.page = page
        if (limit) filters.limit = limit

        // Get products from SQLite database
        const result = await db.getProducts(filters)

        if (!result.success) {
            throw new Error(result.error || "Failed to fetch products")
        }

        let products = result.data || []

        // Database already handles filtering, sorting, and pagination
        // Just get the total count for pagination info
        const totalProducts = products.length
        const totalPages = Math.ceil(totalProducts / limit)
        const paginatedProducts = products

        return NextResponse.json({
            success: true,
            data: paginatedProducts,
            pagination: {
                page,
                limit,
                totalProducts,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        })
    } catch (error) {
        console.error("Error fetching products:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch products" },
            { status: 500 }
        )
    }
}

// POST /api/products - Create new product
export async function POST(request) {
    try {
        const body = await request.json()

        // Validate required fields
        const requiredFields = ["name", "price", "category", "brand"]
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    {
                        success: false,
                        error: `Missing required field: ${field}`,
                    },
                    { status: 400 }
                )
            }
        }

        // Create product in SQLite database
        const result = await db.createProduct(body)

        if (!result.success) {
            throw new Error(result.error || "Failed to create product")
        }

        return NextResponse.json(
            {
                success: true,
                data: body,
                message: "Product created successfully",
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Error creating product:", error)
        return NextResponse.json(
            { success: false, error: "Failed to create product" },
            { status: 500 }
        )
    }
}
