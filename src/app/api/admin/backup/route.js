import { NextResponse } from "next/server"
import { dbWrapper } from "../../../../lib/sqlite-database"

export async function POST() {
    try {
        const result = await dbWrapper.backup()

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: "Database backup completed successfully",
                backupPath: result.backupPath,
            })
        } else {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            )
        }
    } catch (error) {
        console.error("Backup error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to backup database" },
            { status: 500 }
        )
    }
}
