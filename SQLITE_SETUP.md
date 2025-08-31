# 🗄️ SQLite Database Setup Guide

## 🎯 **Overview**

Guide lengkap untuk setup dan menggunakan SQLite database di aplikasi shop Next.js Anda.

## 🚀 **Quick Start**

### **1. Install Dependencies**

```bash
# Install SQLite package
yarn add better-sqlite3

# Atau jika ada masalah permission, gunakan:
npm install better-sqlite3
```

### **2. Jalankan Aplikasi**

```bash
yarn dev
```

### **3. Akses Admin Panel**

```
http://localhost:3000/admin
```

## 🏗️ **Database Structure**

### **Tables Created**

-   ✅ **products** - Data produk dengan semua field
-   ✅ **users** - Data user dan admin
-   ✅ **cart** - Shopping cart per user
-   ✅ **orders** - Data order dan history
-   ✅ **order_items** - Detail items dalam order
-   ✅ **categories** - Kategori produk
-   ✅ **brands** - Brand produk

### **Sample Data**

Database akan otomatis terisi dengan:

-   5 sample products
-   2 sample users (admin & customer)
-   8 categories
-   8 brands

## 🔧 **Database Operations**

### **Products**

```javascript
// Get all products
const products = await db.getProducts()

// Get products with filters
const filtered = await db.getProducts({
    category: "Electronics",
    minPrice: 100,
    maxPrice: 500,
    sortBy: "price-low",
})

// Create product
const newProduct = await db.createProduct({
    name: "New Product",
    price: 99.99,
    category: "Electronics",
    brand: "Brand Name",
})
```

### **Cart Operations**

```javascript
// Get user cart
const cart = await db.getCart(userId)

// Add to cart
await db.addToCart(userId, productId, quantity)

// Remove from cart
await db.removeFromCart(userId, productId)
```

### **User Management**

```javascript
// Get user by email
const user = await db.getUserByEmail("user@example.com")

// Create user
const newUser = await db.createUser({
    username: "newuser",
    email: "newuser@example.com",
    password: "password123",
})
```

## 📊 **Admin Panel Features**

### **Product Management**

-   ✅ Add new products
-   ✅ View all products
-   ✅ Delete products
-   ✅ Database statistics

### **Database Tools**

-   ✅ Backup database
-   ✅ Optimize database
-   ✅ View table counts

## 🔄 **Migration dari JSON ke SQLite**

### **Automatic Migration**

```bash
# Run migration script
yarn db:migrate

# Atau manual
node scripts/migrate-to-sqlite.js
```

### **Manual Migration Steps**

1. **Backup JSON files** - Script otomatis backup
2. **Create SQLite tables** - Structure otomatis dibuat
3. **Migrate data** - Data dari JSON dipindah ke SQLite
4. **Verify migration** - Check admin panel

## 🛠️ **Database Scripts**

### **Available Commands**

```bash
# Migrate from JSON to SQLite
yarn db:migrate

# Backup database
yarn db:backup

# Reset database (clear all data)
yarn db:reset
```

### **Custom Scripts**

```bash
# Run migration manually
node scripts/migrate-to-sqlite.js

# Check database status
node scripts/check-database.js
```

## 📁 **File Structure**

```
src/
├── lib/
│   ├── database.js           # JSON-based database (legacy)
│   └── sqlite-database.js    # SQLite database manager
├── app/
│   ├── api/
│   │   ├── products/         # Products API
│   │   └── cart/            # Cart API
│   └── admin/               # Admin panel
├── scripts/
│   ├── migrate-to-sqlite.js # Migration script
│   ├── backup-database.js   # Backup script
│   └── reset-database.js    # Reset script
└── data/                    # Database files
    ├── shop.db             # SQLite database
    └── backup-*/           # Backup folders
```

## 🔍 **Troubleshooting**

### **Common Issues**

#### **1. Permission Errors**

```bash
# Windows - Run as Administrator
# Linux/Mac - Check file permissions
chmod 755 data/
chmod 644 data/*.db
```

#### **2. Database Locked**

```bash
# Stop all processes using database
# Check if another instance is running
# Restart application
```

#### **3. Migration Failed**

```bash
# Check backup folder
# Restore from backup
# Run migration again
```

### **Debug Mode**

```javascript
// Enable debug logging
const DEBUG = true

if (DEBUG) {
    console.log("SQL Query:", sql)
    console.log("Parameters:", params)
}
```

## 📈 **Performance Tips**

### **Optimization**

-   ✅ Use indexes for frequently queried fields
-   ✅ Implement connection pooling
-   ✅ Use prepared statements
-   ✅ Regular database maintenance

### **Monitoring**

```javascript
// Check database size
const stats = await db.getStats()

// Monitor query performance
const slowQueries = await db.getSlowQueries()
```

## 🔒 **Security Best Practices**

### **Current Implementation**

-   ✅ Input validation
-   ✅ SQL injection prevention
-   ✅ Error handling
-   ✅ Data sanitization

### **Recommended**

-   🔄 Password hashing (bcrypt)
-   🔄 JWT authentication
-   🔄 Rate limiting
-   🔄 Data encryption

## 🧪 **Testing**

### **Manual Testing**

```bash
# Test API endpoints
curl http://localhost:3000/api/products
curl http://localhost:3000/api/cart?userId=1

# Test admin panel
http://localhost:3000/admin
```

### **Automated Testing**

```bash
# Run tests
yarn test

# Test database operations
yarn test:db
```

## 📚 **API Reference**

### **Products API**

```
GET    /api/products          # Get all products
GET    /api/products?q=query # Search products
POST   /api/products          # Create product
PUT    /api/products/[id]     # Update product
DELETE /api/products/[id]     # Delete product
```

### **Cart API**

```
GET    /api/cart?userId=1     # Get user cart
POST   /api/cart              # Add to cart
DELETE /api/cart?userId=1&productId=1 # Remove from cart
```

### **Query Parameters**

-   `q` - Search query
-   `category` - Filter by category
-   `brand` - Filter by brand
-   `minPrice` - Minimum price
-   `maxPrice` - Maximum price
-   `rating` - Minimum rating
-   `sortBy` - Sorting (featured, price-low, price-high, rating, newest)
-   `page` - Page number
-   `limit` - Items per page

## 🚀 **Next Steps**

### **Immediate**

1. ✅ Test admin panel
2. ✅ Add more products
3. ✅ Test cart functionality
4. ✅ Verify data persistence

### **Future Enhancements**

-   🔄 Real-time stock updates
-   🔄 User authentication
-   🔄 Payment integration
-   🔄 Order tracking
-   🔄 Analytics dashboard

## 📞 **Support**

### **Getting Help**

-   Check console logs for errors
-   Review database file permissions
-   Verify API endpoint responses
-   Test with admin panel

### **Useful Commands**

```bash
# Check database status
ls -la data/

# View database logs
tail -f logs/database.log

# Backup database
cp data/shop.db data/backup-$(date +%Y%m%d).db
```

## 🎉 **Congratulations!**

Anda telah berhasil setup SQLite database untuk aplikasi shop!

**Database features yang tersedia:**

-   ✅ **Real database** dengan struktur yang proper
-   ✅ **Admin panel** untuk management
-   ✅ **API endpoints** yang powerful
-   ✅ **Migration tools** untuk upgrade
-   ✅ **Backup & restore** functionality
-   ✅ **Performance optimization** ready

**Sekarang Anda bisa:**

1. **Manage products** melalui admin panel
2. **Use real database** untuk data persistence
3. **Scale application** dengan proper database
4. **Migrate easily** ke production database

Happy coding! 🚀
