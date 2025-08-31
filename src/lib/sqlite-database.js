import fs from "fs"
import path from "path"
import sqlite3 from "sqlite3"
import { open } from "sqlite"

// SQLite Database Manager
class SQLiteDatabase {
    constructor() {
        this.dbPath = path.join(process.cwd(), "data", "shop.db")
        this.db = null
        this.ensureDbDir()
        this.initDatabase()
    }

    // Ensure database directory exists
    ensureDbDir() {
        const dbDir = path.dirname(this.dbPath)
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true })
        }
    }

    // Initialize database with tables
    async initDatabase() {
        try {
            // Open database connection
            this.db = await open({
                filename: this.dbPath,
                driver: sqlite3.Database,
            })

            // Enable foreign keys
            await this.db.exec("PRAGMA foreign_keys = ON")

            // Create tables if they don't exist
            await this.createTables()

            // Check if sample data exists
            const productCount = await this.db.get(
                "SELECT COUNT(*) as count FROM products"
            )
            if (productCount.count === 0) {
                await this.insertSampleData()
            }

            console.log("✅ SQLite database initialized successfully")
        } catch (error) {
            console.error("❌ Error initializing database:", error)
            throw error
        }
    }

    // Create database tables
    async createTables() {
        try {
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

            for (const table of tables) {
                await this.db.exec(table)
            }

            console.log("✅ Database tables created successfully")
        } catch (error) {
            console.error("❌ Error creating tables:", error)
            throw error
        }
    }

    // Insert sample data
    async insertSampleData() {
        try {
            console.log("📊 Inserting sample data...")

            // Sample products
            const sampleProducts = [
                {
                    name: "Wireless Bluetooth Headphones",
                    price: 89.99,
                    originalPrice: 129.99,
                    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
                    rating: 4.5,
                    reviewCount: 128,
                    isNew: 1,
                    discount: 31,
                    category: "Electronics",
                    brand: "Sony",
                    description:
                        "High-quality wireless headphones with noise cancellation",
                    stock: 50,
                    sku: "SONY-WH-001",
                },
                {
                    name: "Smart Fitness Watch",
                    price: 199.99,
                    originalPrice: null,
                    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
                    rating: 4.8,
                    reviewCount: 89,
                    isNew: 0,
                    discount: null,
                    category: "Electronics",
                    brand: "Apple",
                    description:
                        "Advanced fitness tracking with heart rate monitor",
                    stock: 25,
                    sku: "APPLE-WATCH-001",
                },
                {
                    name: "Premium Coffee Maker",
                    price: 149.99,
                    originalPrice: 199.99,
                    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop",
                    rating: 4.3,
                    reviewCount: 67,
                    isNew: 0,
                    discount: 25,
                    category: "Home & Garden",
                    brand: "Breville",
                    description:
                        "Professional coffee maker for coffee enthusiasts",
                    stock: 15,
                    sku: "BREV-COFF-001",
                },
                {
                    name: "Running Shoes",
                    price: 79.99,
                    originalPrice: null,
                    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
                    rating: 4.6,
                    reviewCount: 156,
                    isNew: 0,
                    discount: null,
                    category: "Sports",
                    brand: "Nike",
                    description:
                        "Lightweight running shoes for maximum comfort",
                    stock: 100,
                    sku: "NIKE-RUN-001",
                },
                {
                    name: "Gaming Laptop",
                    price: 1299.99,
                    originalPrice: 1499.99,
                    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop",
                    rating: 4.7,
                    reviewCount: 234,
                    isNew: 1,
                    discount: 13,
                    category: "Electronics",
                    brand: "Dell",
                    description:
                        "High-performance gaming laptop with RTX graphics",
                    stock: 10,
                    sku: "DELL-GAM-001",
                },
            ]

            // Sample users
            const sampleUsers = [
                {
                    username: "admin",
                    email: "admin@shophub.com",
                    password: "admin123", // In real app, use bcrypt
                    role: "admin",
                    firstName: "Admin",
                    lastName: "User",
                },
                {
                    username: "customer",
                    email: "customer@example.com",
                    password: "customer123",
                    role: "customer",
                    firstName: "John",
                    lastName: "Doe",
                },
            ]

            // Insert products
            for (const product of sampleProducts) {
                await this.db.run(
                    `
          INSERT INTO products (name, price, originalPrice, image, rating, reviewCount, 
                              isNew, discount, category, brand, description, stock, sku)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
                    [
                        product.name,
                        product.price,
                        product.originalPrice,
                        product.image,
                        product.rating,
                        product.reviewCount,
                        product.isNew,
                        product.discount,
                        product.category,
                        product.brand,
                        product.description,
                        product.stock,
                        product.sku,
                    ]
                )
            }

            // Insert users
            for (const user of sampleUsers) {
                await this.db.run(
                    `
          INSERT INTO users (username, email, password, role, firstName, lastName)
          VALUES (?, ?, ?, ?, ?, ?)
        `,
                    [
                        user.username,
                        user.email,
                        user.password,
                        user.role,
                        user.firstName,
                        user.lastName,
                    ]
                )
            }

            console.log(
                `✅ Sample data inserted: ${sampleProducts.length} products, ${sampleUsers.length} users`
            )
        } catch (error) {
            console.error("❌ Error inserting sample data:", error)
            throw error
        }
    }

    // Generic query executor
    async query(sql, params = []) {
        try {
            if (!this.db) {
                throw new Error("Database not initialized")
            }

            const result = await this.db.all(sql, params)
            return { success: true, data: result }
        } catch (error) {
            console.error("Query error:", error)
            return { success: false, error: error.message }
        }
    }

    // Product operations
    async getProducts(filters = {}) {
        try {
            let sql = "SELECT * FROM products WHERE 1=1"
            const params = []

            if (filters.category) {
                sql += " AND category = ?"
                params.push(filters.category)
            }

            if (filters.brand) {
                sql += " AND brand = ?"
                params.push(filters.brand)
            }

            if (filters.minPrice) {
                sql += " AND price >= ?"
                params.push(filters.minPrice)
            }

            if (filters.maxPrice) {
                sql += " AND price <= ?"
                params.push(filters.maxPrice)
            }

            if (filters.rating) {
                sql += " AND rating >= ?"
                params.push(filters.rating)
            }

            if (filters.query) {
                sql +=
                    " AND (name LIKE ? OR description LIKE ? OR brand LIKE ? OR category LIKE ?)"
                const searchTerm = `%${filters.query}%`
                params.push(searchTerm, searchTerm, searchTerm, searchTerm)
            }

            // Add sorting
            if (filters.sortBy) {
                switch (filters.sortBy) {
                    case "price-low":
                        sql += " ORDER BY price ASC"
                        break
                    case "price-high":
                        sql += " ORDER BY price DESC"
                        break
                    case "rating":
                        sql += " ORDER BY rating DESC"
                        break
                    case "newest":
                        sql += " ORDER BY createdAt DESC"
                        break
                    case "name":
                        sql += " ORDER BY name ASC"
                        break
                    default:
                        sql += " ORDER BY id ASC"
                }
            }

            // Add pagination
            if (filters.page && filters.limit) {
                const offset = (filters.page - 1) * filters.limit
                sql += " LIMIT ? OFFSET ?"
                params.push(filters.limit, offset)
            }

            const result = await this.query(sql, params)
            return result
        } catch (error) {
            console.error("Error getting products:", error)
            return { success: false, error: error.message }
        }
    }

    async getProductById(id) {
        try {
            const result = await this.db.get(
                "SELECT * FROM products WHERE id = ?",
                [id]
            )
            return result
        } catch (error) {
            console.error("Error getting product by ID:", error)
            return null
        }
    }

    async createProduct(productData) {
        try {
            const result = await this.db.run(
                `
        INSERT INTO products (name, price, originalPrice, image, rating, reviewCount, 
                            isNew, discount, category, brand, description, stock, sku)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
                [
                    productData.name,
                    productData.price,
                    productData.originalPrice,
                    productData.image,
                    productData.rating || 0,
                    productData.reviewCount || 0,
                    productData.isNew ? 1 : 0,
                    productData.discount,
                    productData.category,
                    productData.brand,
                    productData.description,
                    productData.stock || 0,
                    productData.sku,
                ]
            )

            return { success: true, id: result.lastID }
        } catch (error) {
            console.error("Error creating product:", error)
            return { success: false, error: error.message }
        }
    }

    async updateProduct(id, updateData) {
        try {
            const fields = Object.keys(updateData)
                .filter((key) => key !== "id")
                .map((key) => `${key} = ?`)

            const sql = `UPDATE products SET ${fields.join(
                ", "
            )}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`
            const params = [...Object.values(updateData), id]

            await this.db.run(sql, params)
            return { success: true }
        } catch (error) {
            console.error("Error updating product:", error)
            return { success: false, error: error.message }
        }
    }

    async deleteProduct(id) {
        try {
            await this.db.run("DELETE FROM products WHERE id = ?", [id])
            return { success: true }
        } catch (error) {
            console.error("Error deleting product:", error)
            return { success: false, error: error.message }
        }
    }

    // Cart operations
    async getCart(userId) {
        try {
            const sql = `
        SELECT c.*, p.name, p.price, p.image, p.stock
        FROM cart c
        JOIN products p ON c.productId = p.id
        WHERE c.userId = ?
      `

            const result = await this.query(sql, [userId])
            return result.data || []
        } catch (error) {
            console.error("Error getting cart:", error)
            return []
        }
    }

    async addToCart(userId, productId, quantity = 1) {
        try {
            // Check if item already exists in cart
            const existingItem = await this.db.get(
                "SELECT * FROM cart WHERE userId = ? AND productId = ?",
                [userId, productId]
            )

            if (existingItem) {
                // Update quantity
                await this.db.run(
                    "UPDATE cart SET quantity = quantity + ? WHERE userId = ? AND productId = ?",
                    [quantity, userId, productId]
                )
            } else {
                // Add new item
                await this.db.run(
                    "INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, ?)",
                    [userId, productId, quantity]
                )
            }

            return { success: true }
        } catch (error) {
            console.error("Error adding to cart:", error)
            return { success: false, error: error.message }
        }
    }

    async removeFromCart(userId, productId) {
        try {
            await this.db.run(
                "DELETE FROM cart WHERE userId = ? AND productId = ?",
                [userId, productId]
            )
            return { success: true }
        } catch (error) {
            console.error("Error removing from cart:", error)
            return { success: false, error: error.message }
        }
    }

    async clearCart(userId) {
        try {
            await this.db.run("DELETE FROM cart WHERE userId = ?", [userId])
            return { success: true }
        } catch (error) {
            console.error("Error clearing cart:", error)
            return { success: false, error: error.message }
        }
    }

    // User operations
    async getUserByEmail(email) {
        try {
            const result = await this.db.get(
                "SELECT * FROM users WHERE email = ?",
                [email]
            )
            return result
        } catch (error) {
            console.error("Error getting user by email:", error)
            return null
        }
    }

    async createUser(userData) {
        try {
            const result = await this.db.run(
                `
        INSERT INTO users (username, email, password, role, firstName, lastName)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
                [
                    userData.username,
                    userData.email,
                    userData.password,
                    userData.role || "customer",
                    userData.firstName,
                    userData.lastName,
                ]
            )

            return { success: true, id: result.lastID }
        } catch (error) {
            console.error("Error creating user:", error)
            return { success: false, error: error.message }
        }
    }
}

// Create and export database instance
const db = new SQLiteDatabase()

// Wait for database initialization to complete
let dbReady = false
db.initDatabase()
    .then(() => {
        dbReady = true
        console.log("✅ Database is ready")
    })
    .catch((error) => {
        console.error("❌ Database initialization failed:", error)
    })

// Export a wrapper that ensures database is ready
const dbWrapper = {
    async ensureReady() {
        if (!dbReady) {
            await db.initDatabase()
            dbReady = true
        }
    },

    async getProducts(filters = {}) {
        await this.ensureReady()
        try {
            let sql = "SELECT * FROM products WHERE 1=1"
            const params = []

            if (filters.category) {
                sql += " AND category = ?"
                params.push(filters.category)
            }

            if (filters.brand) {
                sql += " AND brand = ?"
                params.push(filters.brand)
            }

            if (filters.minPrice) {
                sql += " AND price >= ?"
                params.push(filters.minPrice)
            }

            if (filters.maxPrice) {
                sql += " AND price <= ?"
                params.push(filters.maxPrice)
            }

            if (filters.rating) {
                sql += " AND rating >= ?"
                params.push(filters.rating)
            }

            if (filters.query) {
                sql +=
                    " AND (name LIKE ? OR description LIKE ? OR brand LIKE ? OR category LIKE ?)"
                const searchTerm = `%${filters.query}%`
                params.push(searchTerm, searchTerm, searchTerm, searchTerm)
            }

            // Add sorting
            if (filters.sortBy) {
                switch (filters.sortBy) {
                    case "price-low":
                        sql += " ORDER BY price ASC"
                        break
                    case "price-high":
                        sql += " ORDER BY price DESC"
                        break
                    case "rating":
                        sql += " ORDER BY rating DESC"
                        break
                    case "newest":
                        sql += " ORDER BY createdAt DESC"
                        break
                    case "name":
                        sql += " ORDER BY name ASC"
                        break
                    default:
                        sql += " ORDER BY id ASC"
                }
            }

            // Add pagination
            if (filters.page && filters.limit) {
                const offset = (filters.page - 1) * filters.limit
                sql += " LIMIT ? OFFSET ?"
                params.push(filters.limit, offset)
            }

            const result = await db.db.all(sql, params)
            return { success: true, data: result }
        } catch (error) {
            console.error("Error getting products:", error)
            return { success: false, error: error.message }
        }
    },

    async getProduct(id) {
        await this.ensureReady()
        try {
            const result = await db.db.get(
                "SELECT * FROM products WHERE id = ?",
                [id]
            )
            if (result) {
                return { success: true, data: result }
            } else {
                return { success: false, error: "Product not found" }
            }
        } catch (error) {
            console.error("Error getting product:", error)
            return { success: false, error: error.message }
        }
    },

    async createProduct(productData) {
        await this.ensureReady()
        try {
            const result = await db.db.run(
                `INSERT INTO products (
                    name, price, originalPrice, image, rating, reviewCount, 
                    isNew, discount, category, brand, description, stock, sku
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    productData.name,
                    productData.price,
                    productData.originalPrice || null,
                    productData.image || null,
                    productData.rating || 0,
                    productData.reviewCount || 0,
                    productData.isNew ? 1 : 0,
                    productData.discount || null,
                    productData.category,
                    productData.brand,
                    productData.description || null,
                    productData.stock || 0,
                    productData.sku || null,
                ]
            )

            return { success: true, id: result.lastID }
        } catch (error) {
            console.error("Error creating product:", error)
            return { success: false, error: error.message }
        }
    },

    async updateProduct(id, productData) {
        await this.ensureReady()
        try {
            const result = await db.db.run(
                `UPDATE products SET 
                    name = ?, price = ?, originalPrice = ?, image = ?, 
                    rating = ?, reviewCount = ?, isNew = ?, discount = ?, 
                    category = ?, brand = ?, description = ?, stock = ?, 
                    sku = ?, updatedAt = CURRENT_TIMESTAMP
                WHERE id = ?`,
                [
                    productData.name,
                    productData.price,
                    productData.originalPrice || null,
                    productData.image || null,
                    productData.rating || 0,
                    productData.reviewCount || 0,
                    productData.isNew ? 1 : 0,
                    productData.discount || null,
                    productData.category,
                    productData.brand,
                    productData.description || null,
                    productData.stock || 0,
                    productData.sku || null,
                    id,
                ]
            )

            if (result.changes > 0) {
                return { success: true, data: productData }
            } else {
                return { success: false, error: "Product not found" }
            }
        } catch (error) {
            console.error("Error updating product:", error)
            return { success: false, error: error.message }
        }
    },

    async deleteProduct(id) {
        await this.ensureReady()
        try {
            const result = await db.db.run(
                "DELETE FROM products WHERE id = ?",
                [id]
            )
            if (result.changes > 0) {
                return { success: true }
            } else {
                return { success: false, error: "Product not found" }
            }
        } catch (error) {
            console.error("Error deleting product:", error)
            return { success: false, error: error.message }
        }
    },

    async getCategories() {
        await this.ensureReady()
        try {
            const result = await db.db.all(
                "SELECT DISTINCT category FROM products ORDER BY category"
            )
            return result.map((row) => row.category)
        } catch (error) {
            console.error("Error getting categories:", error)
            return []
        }
    },

    async getBrands() {
        await this.ensureReady()
        try {
            const result = await db.db.all(
                "SELECT DISTINCT brand FROM products ORDER BY brand"
            )
            return result.map((row) => row.brand)
        } catch (error) {
            console.error("Error getting brands:", error)
            return []
        }
    },

    async getProductCount() {
        await this.ensureReady()
        try {
            const result = await db.db.get(
                "SELECT COUNT(*) as count FROM products"
            )
            return result.count || 0
        } catch (error) {
            console.error("Error getting product count:", error)
            return 0
        }
    },

    // Cart operations
    async getCartItems(userId) {
        await this.ensureReady()
        try {
            const rows = await db.db.all(
                `
                SELECT 
                    c.id AS cartId,
                    c.productId AS productId,
                    c.quantity AS quantity,
                    c.createdAt AS createdAt,
                    p.name AS name,
                    p.image AS image,
                    p.price AS price,
                    p.originalPrice AS originalPrice,
                    p.rating AS rating,
                    p.reviewCount AS reviewCount,
                    p.isNew AS isNew,
                    p.discount AS discount,
                    p.category AS category,
                    p.brand AS brand,
                    p.description AS description,
                    p.stock AS stock,
                    p.sku AS sku
                FROM cart c
                JOIN products p ON c.productId = p.id
                WHERE c.userId = ?
                ORDER BY c.createdAt DESC
            `,
                [userId]
            )

            const result = rows.map((r) => ({
                id: r.cartId,
                quantity: r.quantity,
                createdAt: r.createdAt,
                product: {
                    id: r.productId,
                    name: r.name,
                    image: r.image,
                    price: r.price,
                    originalPrice: r.originalPrice,
                    rating: r.rating,
                    reviewCount: r.reviewCount,
                    isNew: !!r.isNew,
                    discount: r.discount,
                    category: r.category,
                    brand: r.brand,
                    description: r.description,
                    stock: r.stock,
                    sku: r.sku,
                },
            }))

            return { success: true, data: result }
        } catch (error) {
            console.error("Error getting cart items:", error)
            return { success: false, error: error.message }
        }
    },

    async addToCart(userId, productId, quantity) {
        await this.ensureReady()
        try {
            // Check if item already exists in cart
            const existingItem = await db.db.get(
                "SELECT * FROM cart WHERE userId = ? AND productId = ?",
                [userId, productId]
            )

            if (existingItem) {
                // Update quantity
                await db.db.run(
                    "UPDATE cart SET quantity = quantity + ? WHERE userId = ? AND productId = ?",
                    [quantity, userId, productId]
                )
            } else {
                // Add new item
                await db.db.run(
                    "INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, ?)",
                    [userId, productId, quantity]
                )
            }

            return { success: true, data: { userId, productId, quantity } }
        } catch (error) {
            console.error("Error adding to cart:", error)
            return { success: false, error: error.message }
        }
    },

    async updateCartItem(cartItemId, quantity) {
        await this.ensureReady()
        try {
            if (quantity <= 0) {
                await db.db.run("DELETE FROM cart WHERE id = ?", [cartItemId])
            } else {
                await db.db.run("UPDATE cart SET quantity = ? WHERE id = ?", [
                    quantity,
                    cartItemId,
                ])
            }

            return { success: true }
        } catch (error) {
            console.error("Error updating cart item:", error)
            return { success: false, error: error.message }
        }
    },

    async removeCartItem(cartItemId) {
        await this.ensureReady()
        try {
            await db.db.run("DELETE FROM cart WHERE id = ?", [cartItemId])
            return { success: true }
        } catch (error) {
            console.error("Error removing cart item:", error)
            return { success: false, error: error.message }
        }
    },

    // Database maintenance
    async backup() {
        await this.ensureReady()
        try {
            const backupPath = db.dbPath.replace(
                ".db",
                `-backup-${Date.now()}.db`
            )
            if (fs.existsSync(db.dbPath)) {
                fs.copyFileSync(db.dbPath, backupPath)
                console.log(`✅ Database backed up to: ${backupPath}`)
                return { success: true, backupPath }
            }
            return { success: false, error: "Database file not found" }
        } catch (error) {
            console.error("Error backing up database:", error)
            return { success: false, error: error.message }
        }
    },

    async vacuum() {
        await this.ensureReady()
        try {
            await db.db.exec("VACUUM")
            console.log("✅ Database vacuum completed")
            return { success: true }
        } catch (error) {
            console.error("Error vacuuming database:", error)
            return { success: false, error: error.message }
        }
    },

    async close() {
        if (db.db) {
            await db.db.close()
            console.log("✅ Database connection closed")
        }
    },
}

export { dbWrapper }
export default dbWrapper
