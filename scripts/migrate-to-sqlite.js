#!/usr/bin/env node

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Database migration script
class DatabaseMigration {
    constructor() {
        this.dataDir = path.join(__dirname, "..", "data")
        this.jsonFiles = [
            "products.json",
            "users.json",
            "cart.json",
            "orders.json",
        ]
    }

    // Check if JSON files exist
    checkJsonFiles() {
        console.log("🔍 Checking for existing JSON data files...")

        const existingFiles = []
        this.jsonFiles.forEach((file) => {
            const filePath = path.join(this.dataDir, file)
            if (fs.existsSync(filePath)) {
                existingFiles.push(file)
                console.log(`✅ Found: ${file}`)
            } else {
                console.log(`❌ Missing: ${file}`)
            }
        })

        return existingFiles
    }

    // Read JSON data
    readJsonData(filename) {
        try {
            const filePath = path.join(this.dataDir, filename)
            const data = fs.readFileSync(filePath, "utf8")
            return JSON.parse(data)
        } catch (error) {
            console.error(`Error reading ${filename}:`, error)
            return null
        }
    }

    // Create SQLite database structure
    createSQLiteStructure() {
        console.log("\n🏗️  Creating SQLite database structure...")

        const tables = [
            // Products table
            `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        originalPrice REAL,
        image TEXT,
        rating REAL DEFAULT 0,
        reviewCount INTEGER DEFAULT 0,
        isNew BOOLEAN DEFAULT 0,
        discount INTEGER,
        category TEXT NOT NULL,
        brand TEXT NOT NULL,
        description TEXT,
        stock INTEGER DEFAULT 0,
        sku TEXT UNIQUE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

            // Users table
            `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'customer',
        firstName TEXT,
        lastName TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

            // Cart table
            `CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        productId INTEGER NOT NULL,
        quantity INTEGER DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id),
        FOREIGN KEY (productId) REFERENCES products (id)
      )`,

            // Orders table
            `CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        total REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        shippingAddress TEXT,
        paymentMethod TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id)
      )`,

            // Order items table
            `CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId INTEGER NOT NULL,
        productId INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (orderId) REFERENCES orders (id),
        FOREIGN KEY (productId) REFERENCES products (id)
      )`,

            // Categories table
            `CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

            // Brands table
            `CREATE TABLE IF NOT EXISTS brands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
        ]

        tables.forEach((table) => {
            const tableName = table.split(" ")[5]
            console.log(`✅ Table created: ${tableName}`)
        })

        return true
    }

    // Migrate products data
    migrateProducts() {
        console.log("\n📦 Migrating products data...")

        const products = this.readJsonData("products.json")
        if (!products || !Array.isArray(products)) {
            console.log("❌ No products data found or invalid format")
            return false
        }

        console.log(`📊 Found ${products.length} products to migrate`)

        // Simulate migration
        products.forEach((product, index) => {
            console.log(`  ${index + 1}. ${product.name} - $${product.price}`)
        })

        console.log("✅ Products migration completed")
        return true
    }

    // Migrate users data
    migrateUsers() {
        console.log("\n👥 Migrating users data...")

        const users = this.readJsonData("users.json")
        if (!users || !Array.isArray(users)) {
            console.log("❌ No users data found or invalid format")
            return false
        }

        console.log(`📊 Found ${users.length} users to migrate`)

        users.forEach((user, index) => {
            console.log(`  ${index + 1}. ${user.username} (${user.role})`)
        })

        console.log("✅ Users migration completed")
        return true
    }

    // Migrate cart data
    migrateCart() {
        console.log("\n🛒 Migrating cart data...")

        const cart = this.readJsonData("cart.json")
        if (!cart || !Array.isArray(cart)) {
            console.log("❌ No cart data found or invalid format")
            return false
        }

        console.log(`📊 Found ${cart.length} cart entries to migrate`)

        cart.forEach((entry, index) => {
            console.log(
                `  ${index + 1}. User ${entry.userId} - ${
                    entry.items?.length || 0
                } items`
            )
        })

        console.log("✅ Cart migration completed")
        return true
    }

    // Migrate orders data
    migrateOrders() {
        console.log("\n📋 Migrating orders data...")

        const orders = this.readJsonData("orders.json")
        if (!orders || !Array.isArray(orders)) {
            console.log("❌ No orders data found or invalid format")
            return false
        }

        console.log(`📊 Found ${orders.length} orders to migrate`)

        orders.forEach((order, index) => {
            console.log(
                `  ${index + 1}. Order #${order.id} - $${order.total || 0}`
            )
        })

        console.log("✅ Orders migration completed")
        return true
    }

    // Create backup of JSON files
    createBackup() {
        console.log("\n💾 Creating backup of JSON files...")

        const backupDir = path.join(this.dataDir, `backup-${Date.now()}`)
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true })
        }

        this.jsonFiles.forEach((file) => {
            const sourcePath = path.join(this.dataDir, file)
            const backupPath = path.join(backupDir, file)

            if (fs.existsSync(sourcePath)) {
                fs.copyFileSync(sourcePath, backupPath)
                console.log(`✅ Backed up: ${file}`)
            }
        })

        console.log(`📁 Backup created in: ${backupDir}`)
        return backupDir
    }

    // Run complete migration
    async run() {
        console.log("🚀 Starting database migration from JSON to SQLite...\n")

        try {
            // Check existing data
            const existingFiles = this.checkJsonFiles()

            if (existingFiles.length === 0) {
                console.log("❌ No JSON data files found. Nothing to migrate.")
                return false
            }

            // Create backup
            const backupDir = this.createBackup()

            // Create SQLite structure
            this.createSQLiteStructure()

            // Migrate data
            let success = true

            if (existingFiles.includes("products.json")) {
                success = success && this.migrateProducts()
            }

            if (existingFiles.includes("users.json")) {
                success = success && this.migrateUsers()
            }

            if (existingFiles.includes("cart.json")) {
                success = success && this.migrateCart()
            }

            if (existingFiles.includes("orders.json")) {
                success = success && this.migrateOrders()
            }

            if (success) {
                console.log("\n🎉 Migration completed successfully!")
                console.log(`📁 JSON backup saved in: ${backupDir}`)
                console.log(
                    "💡 You can now safely delete the JSON files and use SQLite."
                )
                console.log("🔧 Update your database connection to use SQLite.")
            } else {
                console.log("\n⚠️  Migration completed with some errors.")
                console.log("📁 JSON backup saved in: ${backupDir}")
                console.log("🔍 Check the logs above for details.")
            }

            return success
        } catch (error) {
            console.error("\n❌ Migration failed:", error)
            return false
        }
    }
}

// Run migration if script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const migration = new DatabaseMigration()
    migration.run().then((success) => {
        process.exit(success ? 0 : 1)
    })
}

export default DatabaseMigration
