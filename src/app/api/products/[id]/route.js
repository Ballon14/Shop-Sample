import { NextResponse } from "next/server"
import db from "../../../../lib/sqlite-database"

// GET /api/products/[id] - Get product by ID
export async function GET(request, { params }) {
    try {
        const { id } = params

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Product ID is required" },
                { status: 400 }
            )
        }

        // Get product from SQLite database
        const result = await db.getProduct(parseInt(id))

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error || "Product not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: result.data,
        })
    } catch (error) {
        console.error("Error fetching product:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch product" },
            { status: 500 }
        )
    }
}

// PUT /api/products/[id] - Update product
export async function PUT(request, { params }) {
    try {
        const { id } = params
        const body = await request.json()

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Product ID is required" },
                { status: 400 }
            )
        }

        // Update product in SQLite database
        const result = await db.updateProduct(parseInt(id), body)

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error || "Failed to update product",
                },
                { status: 400 }
            )
        }

        return NextResponse.json({
            success: true,
            data: result.data,
            message: "Product updated successfully",
        })
    } catch (error) {
        console.error("Error updating product:", error)
        return NextResponse.json(
            { success: false, error: "Failed to update product" },
            { status: 500 }
        )
    }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(request, { params }) {
    try {
        const { id } = params

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Product ID is required" },
                { status: 400 }
            )
        }

        // Delete product from SQLite database
        const result = await db.deleteProduct(parseInt(id))

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error || "Failed to delete product",
                },
                { status: 400 }
            )
        }

        return NextResponse.json({
            success: true,
            message: "Product deleted successfully",
        })
    } catch (error) {
        console.error("Error deleting product:", error)
        return NextResponse.json(
            { success: false, error: "Failed to delete product" },
            { status: 500 }
        )
    }
}
