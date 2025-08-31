import { NextResponse } from "next/server"
import { dbWrapper } from "../../../../lib/sqlite-database"

export async function POST() {
    try {
        const result = await dbWrapper.vacuum()

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: "Database optimization completed successfully",
            })
        } else {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            )
        }
    } catch (error) {
        console.error("Optimization error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to optimize database" },
            { status: 500 }
        )
    }
}
