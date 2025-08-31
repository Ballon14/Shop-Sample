import { NextResponse } from "next/server"
import db from "../../../lib/sqlite-database"

// GET /api/cart - Get cart items for a user
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")

        if (!userId) {
            return NextResponse.json(
                { success: false, error: "User ID is required" },
                { status: 400 }
            )
        }

        // Get cart items from SQLite database
        const result = await db.getCartItems(parseInt(userId))

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error || "Failed to fetch cart items",
                },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            data: result.data,
        })
    } catch (error) {
        console.error("Error fetching cart items:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch cart items" },
            { status: 500 }
        )
    }
}

// POST /api/cart - Add item to cart
export async function POST(request) {
    try {
        const body = await request.json()
        const { userId, productId, quantity = 1 } = body

        // Validate required fields
        if (!userId || !productId) {
            return NextResponse.json(
                {
                    success: false,
                    error: "User ID and Product ID are required",
                },
                { status: 400 }
            )
        }

        // Add item to cart in SQLite database
        const result = await db.addToCart(
            parseInt(userId),
            parseInt(productId),
            quantity
        )

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error || "Failed to add item to cart",
                },
                { status: 400 }
            )
        }

        return NextResponse.json({
            success: true,
            data: result.data,
            message: "Item added to cart successfully",
        })
    } catch (error) {
        console.error("Error adding item to cart:", error)
        return NextResponse.json(
            { success: false, error: "Failed to add item to cart" },
            { status: 500 }
        )
    }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")
        const productId = searchParams.get("productId")

        if (!userId || !productId) {
            return NextResponse.json(
                {
                    success: false,
                    error: "User ID and Product ID are required",
                },
                { status: 400 }
            )
        }

        const result = await db.removeFromCart(
            parseInt(userId),
            parseInt(productId)
        )

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error || "Failed to remove item from cart",
                },
                { status: 500 }
            )
        }

        // Get updated cart
        const updatedCart = await db.getCart(parseInt(userId))

        return NextResponse.json({
            success: true,
            data: updatedCart,
            message: "Item removed from cart successfully",
        })
    } catch (error) {
        console.error("Error removing item from cart:", error)
        return NextResponse.json(
            { success: false, error: "Failed to remove item from cart" },
            { status: 500 }
        )
    }
}
