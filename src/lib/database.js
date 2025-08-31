import fs from "fs"
import path from "path"

// Database file paths
const DB_DIR = path.join(process.cwd(), "data")
const PRODUCTS_DB = path.join(DB_DIR, "products.json")
const USERS_DB = path.join(DB_DIR, "users.json")
const ORDERS_DB = path.join(DB_DIR, "orders.json")
const CART_DB = path.join(DB_DIR, "cart.json")

// Ensure database directory exists
const ensureDbDir = () => {
    if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true })
    }
}

// Initialize database with sample data
const initializeDatabase = () => {
    ensureDbDir()

    // Initialize products if not exists
    if (!fs.existsSync(PRODUCTS_DB)) {
        const sampleProducts = [
            {
                id: 1,
                name: "Wireless Bluetooth Headphones",
                price: 89.99,
                originalPrice: 129.99,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
                rating: 4.5,
                reviewCount: 128,
                isNew: true,
                discount: 31,
                category: "Electronics",
                brand: "Sony",
                description:
                    "High-quality wireless headphones with noise cancellation",
                stock: 50,
                sku: "SONY-WH-001",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: 2,
                name: "Smart Fitness Watch",
                price: 199.99,
                originalPrice: null,
                image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
                rating: 4.8,
                reviewCount: 89,
                isNew: false,
                discount: null,
                category: "Electronics",
                brand: "Apple",
                description:
                    "Advanced fitness tracking with heart rate monitor",
                stock: 25,
                sku: "APPLE-WATCH-001",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: 3,
                name: "Premium Coffee Maker",
                price: 149.99,
                originalPrice: 199.99,
                image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop",
                rating: 4.3,
                reviewCount: 67,
                isNew: false,
                discount: 25,
                category: "Home & Garden",
                brand: "Breville",
                description: "Professional coffee maker for coffee enthusiasts",
                stock: 15,
                sku: "BREV-COFF-001",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: 4,
                name: "Running Shoes",
                price: 79.99,
                originalPrice: null,
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
                rating: 4.6,
                reviewCount: 156,
                isNew: false,
                discount: null,
                category: "Sports",
                brand: "Nike",
                description: "Lightweight running shoes for maximum comfort",
                stock: 100,
                sku: "NIKE-RUN-001",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: 5,
                name: "Gaming Laptop",
                price: 1299.99,
                originalPrice: 1499.99,
                image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop",
                rating: 4.7,
                reviewCount: 234,
                isNew: true,
                discount: 13,
                category: "Electronics",
                brand: "Dell",
                description: "High-performance gaming laptop with RTX graphics",
                stock: 10,
                sku: "DELL-GAM-001",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ]
        fs.writeFileSync(PRODUCTS_DB, JSON.stringify(sampleProducts, null, 2))
    }

    // Initialize users if not exists
    if (!fs.existsSync(USERS_DB)) {
        const sampleUsers = [
            {
                id: 1,
                username: "admin",
                email: "admin@shophub.com",
                password: "hashed_password_here", // In real app, use bcrypt
                role: "admin",
                firstName: "Admin",
                lastName: "User",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: 2,
                username: "customer",
                email: "customer@example.com",
                password: "hashed_password_here",
                role: "customer",
                firstName: "John",
                lastName: "Doe",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ]
        fs.writeFileSync(USERS_DB, JSON.stringify(sampleUsers, null, 2))
    }

    // Initialize orders if not exists
    if (!fs.existsSync(ORDERS_DB)) {
        fs.writeFileSync(ORDERS_DB, JSON.stringify([], null, 2))
    }

    // Initialize cart if not exists
    if (!fs.existsSync(CART_DB)) {
        fs.writeFileSync(CART_DB, JSON.stringify([], null, 2))
    }
}

// Generic read function
const readData = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, "utf8")
        return JSON.parse(data)
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error)
        return []
    }
}

// Generic write function
const writeData = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
        return true
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error)
        return false
    }
}

// Product operations
export const ProductDB = {
    getAll: () => readData(PRODUCTS_DB),

    getById: (id) => {
        const products = readData(PRODUCTS_DB)
        return products.find((p) => p.id === id)
    },

    getByCategory: (category) => {
        const products = readData(PRODUCTS_DB)
        return products.filter((p) => p.category === category)
    },

    getByBrand: (brand) => {
        const products = readData(PRODUCTS_DB)
        return products.filter((p) => p.brand === brand)
    },

    search: (query) => {
        const products = readData(PRODUCTS_DB)
        const searchTerm = query.toLowerCase()
        return products.filter(
            (p) =>
                p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm) ||
                p.brand.toLowerCase().includes(searchTerm) ||
                p.category.toLowerCase().includes(searchTerm)
        )
    },

    create: (productData) => {
        const products = readData(PRODUCTS_DB)
        const newProduct = {
            id: Math.max(...products.map((p) => p.id), 0) + 1,
            ...productData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        products.push(newProduct)
        writeData(PRODUCTS_DB, products)
        return newProduct
    },

    update: (id, updateData) => {
        const products = readData(PRODUCTS_DB)
        const index = products.findIndex((p) => p.id === id)
        if (index !== -1) {
            products[index] = {
                ...products[index],
                ...updateData,
                updatedAt: new Date().toISOString(),
            }
            writeData(PRODUCTS_DB, products)
            return products[index]
        }
        return null
    },

    delete: (id) => {
        const products = readData(PRODUCTS_DB)
        const filtered = products.filter((p) => p.id !== id)
        if (filtered.length !== products.length) {
            writeData(PRODUCTS_DB, filtered)
            return true
        }
        return false
    },
}

// User operations
export const UserDB = {
    getAll: () => readData(USERS_DB),

    getById: (id) => {
        const users = readData(USERS_DB)
        return users.find((u) => u.id === id)
    },

    getByEmail: (email) => {
        const users = readData(USERS_DB)
        return users.find((u) => u.email === email)
    },

    create: (userData) => {
        const users = readData(USERS_DB)
        const newUser = {
            id: Math.max(...users.map((u) => u.id), 0) + 1,
            ...userData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        users.push(newUser)
        writeData(USERS_DB, users)
        return newUser
    },

    update: (id, updateData) => {
        const users = readData(USERS_DB)
        const index = users.findIndex((u) => u.id === id)
        if (index !== -1) {
            users[index] = {
                ...users[index],
                ...updateData,
                updatedAt: new Date().toISOString(),
            }
            writeData(USERS_DB, users)
            return users[index]
        }
        return null
    },
}

// Cart operations
export const CartDB = {
    getByUserId: (userId) => {
        const carts = readData(CART_DB)
        return carts.find((c) => c.userId === userId) || { userId, items: [] }
    },

    addItem: (userId, productId, quantity = 1) => {
        const carts = readData(CART_DB)
        let userCart = carts.find((c) => c.userId === userId)

        if (!userCart) {
            userCart = { userId, items: [] }
            carts.push(userCart)
        }

        const existingItem = userCart.items.find(
            (item) => item.productId === productId
        )
        if (existingItem) {
            existingItem.quantity += quantity
        } else {
            userCart.items.push({ productId, quantity })
        }

        writeData(CART_DB, carts)
        return userCart
    },

    removeItem: (userId, productId) => {
        const carts = readData(CART_DB)
        const userCart = carts.find((c) => c.userId === userId)

        if (userCart) {
            userCart.items = userCart.items.filter(
                (item) => item.productId !== productId
            )
            writeData(CART_DB, carts)
            return true
        }
        return false
    },

    clearCart: (userId) => {
        const carts = readData(CART_DB)
        const userCart = carts.find((c) => c.userId === userId)

        if (userCart) {
            userCart.items = []
            writeData(CART_DB, carts)
            return true
        }
        return false
    },
}

// Order operations
export const OrderDB = {
    getByUserId: (userId) => {
        const orders = readData(ORDERS_DB)
        return orders.filter((o) => o.userId === userId)
    },

    create: (orderData) => {
        const orders = readData(ORDERS_DB)
        const newOrder = {
            id: Math.max(...orders.map((o) => o.id), 0) + 1,
            ...orderData,
            status: "pending",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        orders.push(newOrder)
        writeData(ORDERS_DB, orders)
        return newOrder
    },

    updateStatus: (id, status) => {
        const orders = readData(ORDERS_DB)
        const order = orders.find((o) => o.id === id)
        if (order) {
            order.status = status
            order.updatedAt = new Date().toISOString()
            writeData(ORDERS_DB, orders)
            return order
        }
        return null
    },
}

// Initialize database on import
initializeDatabase()

export default {
    ProductDB,
    UserDB,
    CartDB,
    OrderDB,
}
