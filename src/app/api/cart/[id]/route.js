import { NextResponse } from "next/server"
import db from "../../../../lib/sqlite-database"

// PUT /api/cart/[id] - Update cart item quantity
export async function PUT(request, { params }) {
    try {
        const { id } = params
        const body = await request.json()
        const { quantity } = body

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Cart item ID is required" },
                { status: 400 }
            )
        }

        if (quantity === undefined || quantity < 0) {
            return NextResponse.json(
                { success: false, error: "Valid quantity is required" },
                { status: 400 }
            )
        }

        // Update cart item in SQLite database
        const result = await db.updateCartItem(parseInt(id), quantity)

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error || "Failed to update cart item",
                },
                { status: 400 }
            )
        }

        return NextResponse.json({
            success: true,
            message: "Cart item updated successfully",
        })
    } catch (error) {
        console.error("Error updating cart item:", error)
        return NextResponse.json(
            { success: false, error: "Failed to update cart item" },
            { status: 500 }
        )
    }
}

// DELETE /api/cart/[id] - Remove item from cart
export async function DELETE(request, { params }) {
    try {
        const { id } = params

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Cart item ID is required" },
                { status: 400 }
            )
        }

        // Remove cart item from SQLite database
        const result = await db.removeCartItem(parseInt(id))

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error || "Failed to remove cart item",
                },
                { status: 400 }
            )
        }

        return NextResponse.json({
            success: true,
            message: "Cart item removed successfully",
        })
    } catch (error) {
        console.error("Error removing cart item:", error)
        return NextResponse.json(
            { success: false, error: "Failed to remove cart item" },
            { status: 500 }
        )
    }
}
