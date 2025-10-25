# 🍛 Bong Flavours Setup Guide

## 🚨 Quick Fix for Current Issues

Your Bong Flavours restaurant website has been analyzed and the main issues have been identified and fixed. Follow this guide to get everything working again.

## 🔧 Issues Fixed

### 1. **Cart Data Structure Mismatch** ✅
- **Problem**: Cart items used `menuItem` field but Orders API expected `menuItemId`
- **Fixed**: Updated CartContext and all related components to use consistent field names

### 2. **Checkout Data Format** ✅
- **Problem**: Checkout page wasn't sending data in the correct format
- **Fixed**: Updated checkout to properly format order data for the API

### 3. **Orders API Validation** ✅
- **Problem**: API validation was too strict and missing delivery fee calculations
- **Fixed**: Updated validation schema and added proper pricing calculations

### 4. **Invoice Generation** ✅
- **Problem**: Invoice calculations didn't include delivery fee
- **Fixed**: Updated invoice generation to include all fees

## 🏗️ Setup Instructions

### Step 1: Environment Variables

Create a `.env.local` file in the root directory with these variables:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/bong-flavours
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bong-flavours

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_SECRET=your-nextauth-secret-key

# Email Configuration (for invoice sending)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Restaurant Information
NEXT_PUBLIC_RESTAURANT_NAME=Bong Flavours
NEXT_PUBLIC_RESTAURANT_EMAIL=mannadebdoot007@gmail.com
NEXT_PUBLIC_RESTAURANT_PHONE=8238018577
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin Email (will receive order notifications)
ADMIN_EMAIL=mannadebdoot007@gmail.com
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service (varies by OS)
# macOS: brew services start mongodb-community
# Ubuntu: sudo systemctl start mongod
# Windows: Start MongoDB service from Services panel
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://cloud.mongodb.com
2. Create a new cluster
3. Get connection string and update MONGODB_URI

### Step 4: Seed the Database

```bash
# Seed menu items (147 Bengali dishes)
npm run seed:menu

# Optional: Create test users
npm run seed:users
```

### Step 5: Test the System

```bash
# Run our comprehensive test script
node test-system.js
```

### Step 6: Start the Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

## 🧪 Testing the Workflow

### 1. Test Public Menu
- Go to http://localhost:3000
- Click "Menu" in navigation
- Should show static menu with "Order Online" button

### 2. Test Authentication
- Click "Order Online" or go to `/login`
- Create account or login with existing credentials
- Should redirect to private menu at `/app/menu`

### 3. Test Cart & Ordering
- Browse private menu at `/app/menu`
- Add items to cart
- Go to cart at `/app/cart`
- Proceed to checkout at `/app/checkout`
- Fill delivery information
- Place order

### 4. Test Invoice Generation
- After placing order, should auto-open PDF invoice
- Check email for invoice (if SMTP configured)
- Admin should also receive order notification

## 📧 Email Configuration

### Gmail Setup (Recommended)
1. Enable 2-factor authentication on your Gmail
2. Generate an "App Password":
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use this app password in SMTP_PASS

### Other Email Providers
- **Outlook**: smtp.office365.com, port 587
- **Yahoo**: smtp.mail.yahoo.com, port 587
- **Custom SMTP**: Update SMTP_HOST and SMTP_PORT accordingly

## 🗄️ Database Structure

Your database contains these collections:

### `menuitems` (147 dishes)
- Bengali cuisine categories
- Veg/Non-veg classification
- Price and variant information

### `users`
- Customer and admin accounts
- Encrypted passwords
- Role-based access

### `orders`
- Complete order tracking
- Customer information
- Payment and delivery status
- Invoice URLs

### `bookings` (if using table booking feature)
- Restaurant table reservations
- Date/time management

## 🔒 Security Features

- **JWT Authentication** with HTTP-only cookies
- **Password Hashing** with bcrypt (12 salt rounds)
- **Input Validation** with Zod schemas
- **Role-based Access** (Customer/Admin)
- **CSRF Protection** via middleware

## 🎯 Troubleshooting

### Issue: "Authentication Failed"
```bash
# Check JWT_SECRET is set correctly
echo $JWT_SECRET

# Clear browser localStorage and cookies
# Try logging in again
```

### Issue: "Database Connection Failed"
```bash
# Test MongoDB connection
mongosh "your-mongodb-uri"

# Or check if MongoDB service is running
# macOS: brew services list | grep mongodb
# Linux: systemctl status mongod
```

### Issue: "Menu Not Loading"
```bash
# Re-seed the menu
npm run seed:menu

# Check API endpoint
curl http://localhost:3000/api/menu
```

### Issue: "Invoice Generation Failed"
```bash
# Check Puppeteer installation
npm list puppeteer

# Reinstall if needed
npm install puppeteer --force
```

### Issue: "Emails Not Sending"
- Verify SMTP credentials
- Check if Gmail app password is correct
- Test with: `node -e "console.log(process.env.SMTP_USER)"`

## 🚀 Deployment (Production)

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Environment Variables for Production
```bash
MONGODB_URI=mongodb+srv://...
JWT_SECRET=super-secure-production-secret
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-production-email@gmail.com
SMTP_PASS=your-production-app-password
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

## 📱 Features Working

✅ **Authentication System**
- User registration and login
- JWT tokens with cookies
- Role-based access control

✅ **Menu System**
- Public SEO-friendly menu
- Private interactive ordering menu
- Category filtering and search

✅ **Cart & Checkout**
- Add/remove items
- Quantity management
- Order calculation with tax and delivery

✅ **Order Management**
- Order placement and tracking
- Automatic order numbering
- Status management

✅ **Invoice System**
- Automatic PDF generation
- Email delivery to customer and admin
- Professional invoice design

✅ **Admin Features**
- Order management
- User management
- Dashboard analytics

## 🎉 Success Verification

After setup, you should be able to:

1. **Browse public menu** at `/menu`
2. **Login/Register** at `/login` or `/signup`
3. **Order food** via private menu at `/app/menu`
4. **Manage cart** at `/app/cart`
5. **Checkout** at `/app/checkout`
6. **Receive PDF invoice** automatically
7. **Get email notifications** (if configured)

## 📞 Support

If you encounter any issues:

1. Run the test script: `node test-system.js`
2. Check the console for error messages
3. Verify all environment variables are set
4. Ensure MongoDB is accessible
5. Check if all npm dependencies are installed

## 🔄 Quick Reset

If something goes wrong, reset everything:

```bash
# Stop the server
# Clear database (if needed)
mongosh "your-db-uri" --eval "db.dropDatabase()"

# Re-seed
npm run seed:menu

# Restart
npm run dev
```

Your Bong Flavours restaurant website is now fully functional! 🍛✨