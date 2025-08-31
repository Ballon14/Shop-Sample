# Database System Documentation

## 📊 **Overview**

Sistem database ini menggunakan file-based storage dengan struktur JSON yang mirip dengan SQLite. Data disimpan dalam folder `data/` dengan file terpisah untuk setiap entitas.

## 🗂️ **Struktur Database**

### **Folder Structure**

```
data/
├── products.json      # Data produk
├── users.json         # Data user
├── cart.json          # Data shopping cart
└── orders.json        # Data order
```

### **Database Files**

-   **`products.json`** - Menyimpan semua data produk
-   **`users.json`** - Menyimpan data user dan admin
-   **`cart.json`** - Menyimpan shopping cart per user
-   **`orders.json`** - Menyimpan history order

## 🏗️ **Database Schema**

### **Products Table**

```json
{
    "id": 1,
    "name": "Product Name",
    "price": 99.99,
    "originalPrice": 129.99,
    "image": "image_url",
    "rating": 4.5,
    "reviewCount": 100,
    "isNew": true,
    "discount": 25,
    "category": "Electronics",
    "brand": "Brand Name",
    "description": "Product description",
    "stock": 50,
    "sku": "SKU-001",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### **Users Table**

```json
{
    "id": 1,
    "username": "username",
    "email": "email@example.com",
    "password": "hashed_password",
    "role": "customer|admin",
    "firstName": "First Name",
    "lastName": "Last Name",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### **Cart Table**

```json
{
    "userId": 1,
    "items": [
        {
            "productId": 1,
            "quantity": 2
        }
    ]
}
```

### **Orders Table**

```json
{
    "id": 1,
    "userId": 1,
    "items": [
        {
            "productId": 1,
            "quantity": 2,
            "price": 99.99
        }
    ],
    "total": 199.98,
    "status": "pending|processing|shipped|delivered|cancelled",
    "shippingAddress": "Address details",
    "paymentMethod": "credit_card|paypal",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🔧 **API Endpoints**

### **Products API**

-   `GET /api/products` - Get all products with filters
-   `GET /api/products/[id]` - Get product by ID
-   `POST /api/products` - Create new product
-   `PUT /api/products/[id]` - Update product
-   `DELETE /api/products/[id]` - Delete product

### **Cart API**

-   `GET /api/cart?userId=1` - Get user cart
-   `POST /api/cart` - Add item to cart
-   `DELETE /api/cart?userId=1&productId=1` - Remove item from cart

### **Query Parameters**

-   `q` - Search query
-   `category` - Filter by category
-   `brand` - Filter by brand
-   `minPrice` - Minimum price filter
-   `maxPrice` - Maximum price filter
-   `rating` - Minimum rating filter
-   `sortBy` - Sorting (featured, price-low, price-high, rating, newest)
-   `page` - Page number for pagination
-   `limit` - Items per page

## 💾 **Database Operations**

### **ProductDB**

```javascript
import { ProductDB } from "../lib/database"

// Get all products
const products = ProductDB.getAll()

// Get product by ID
const product = ProductDB.getById(1)

// Search products
const results = ProductDB.search("headphones")

// Create product
const newProduct = ProductDB.create(productData)

// Update product
const updated = ProductDB.update(1, updateData)

// Delete product
const deleted = ProductDB.delete(1)
```

### **UserDB**

```javascript
import { UserDB } from "../lib/database"

// Get user by email
const user = UserDB.getByEmail("user@example.com")

// Create user
const newUser = UserDB.create(userData)

// Update user
const updated = UserDB.update(1, updateData)
```

### **CartDB**

```javascript
import { CartDB } from "../lib/database"

// Get user cart
const cart = CartDB.getByUserId(1)

// Add item to cart
const updatedCart = CartDB.addItem(1, 1, 2)

// Remove item from cart
const removed = CartDB.removeItem(1, 1)

// Clear cart
const cleared = CartDB.clearCart(1)
```

### **OrderDB**

```javascript
import { OrderDB } from "../lib/database"

// Get user orders
const orders = OrderDB.getByUserId(1)

// Create order
const newOrder = OrderDB.create(orderData)

// Update order status
const updated = OrderDB.updateStatus(1, "shipped")
```

## 🚀 **Features**

### **✅ Implemented**

-   CRUD operations untuk semua entitas
-   Search dan filtering products
-   Shopping cart management
-   Order management
-   User management
-   Pagination dan sorting
-   Data validation
-   Error handling

### **🔄 Planned**

-   Real-time stock updates
-   User authentication & authorization
-   Payment integration
-   Order tracking
-   Review & rating system
-   Inventory management
-   Analytics & reporting

## 🔒 **Security Considerations**

### **Current**

-   Basic input validation
-   Error handling untuk file operations
-   Data sanitization

### **Recommended**

-   Password hashing dengan bcrypt
-   JWT authentication
-   Input sanitization
-   SQL injection prevention
-   Rate limiting
-   Data encryption

## 📈 **Performance Optimization**

### **Current**

-   File-based storage untuk development
-   In-memory operations
-   Basic pagination

### **Recommended**

-   Database indexing
-   Connection pooling
-   Query optimization
-   Caching (Redis)
-   Database sharding untuk scale

## 🧪 **Testing**

### **Manual Testing**

```bash
# Test products API
curl http://localhost:3000/api/products

# Test cart API
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "productId": 1, "quantity": 1}'
```

### **Automated Testing**

-   Unit tests untuk database operations
-   Integration tests untuk API endpoints
-   E2E tests untuk user flows

## 🔄 **Migration to Real Database**

### **SQLite Migration**

```bash
# Install SQLite
npm install better-sqlite3

# Create migration script
node scripts/migrate-to-sqlite.js
```

### **PostgreSQL Migration**

```bash
# Install PostgreSQL client
npm install pg

# Create migration script
node scripts/migrate-to-postgresql.js
```

## 📝 **Maintenance**

### **Backup**

```bash
# Backup database files
cp -r data/ data-backup-$(date +%Y%m%d)/
```

### **Cleanup**

```bash
# Remove old backups
find data-backup-* -mtime +30 -exec rm -rf {} \;
```

## 🆘 **Troubleshooting**

### **Common Issues**

1. **File permission errors** - Check folder permissions
2. **Data corruption** - Restore from backup
3. **Memory issues** - Implement pagination
4. **Performance** - Consider database migration

### **Debug Mode**

```javascript
// Enable debug logging
const DEBUG = true

if (DEBUG) {
    console.log("Database operation:", operation)
}
```

## 📚 **References**

-   [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
-   [File System API](https://nodejs.org/api/fs.html)
-   [JSON Schema](https://json-schema.org/)
-   [REST API Best Practices](https://restfulapi.net/)
