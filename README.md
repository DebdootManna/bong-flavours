# Bong Flavours - Bengali Restaurant E-Commerce Platform

A comprehensive Next.js-based e-commerce platform for a Bengali restaurant featuring advanced order management, automated PDF bill generation, and dual-delivery email system.

## � Features

### Core Functionality

- **Interactive Menu System**: Browse authentic Bengali dishes with detailed descriptions
- **User Authentication**: Secure login/signup with JWT tokens and dual authentication support
- **Order Management**: Complete order lifecycle from cart to delivery
- **Automated Bill Generation**: PDF invoices generated using Puppeteer with professional formatting
- **Dual Email Delivery**: Bills automatically sent to both customer and admin
- **Profile Management**: User profile updates with address management
- **Admin Dashboard**: Order management and system administration

### Technical Highlights

- **Next.js 15.5.0** with App Router and TypeScript
- **MongoDB Atlas** for data persistence with comprehensive models
- **Dual Authentication System**: Cookie-based and Bearer token support for browser compatibility
- **Puppeteer PDF Generation** with Chrome path detection and fallback support
- **Nodemailer Integration** for reliable email delivery
- **Responsive Design** with Tailwind CSS
- **Server-Side Validation** using Zod schemas

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account or local MongoDB instance
- SMTP email service (Gmail recommended)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/DebdootManna/bong-flavours
   cd bong-flavours
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:

   ```env
   # MongoDB Configuration
   MONGODB_URI=your_mongodb_connection_string

   # JWT Configuration
   JWT_SECRET=your_super_secure_jwt_secret_key_here

   # Email Configuration (SMTP)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_specific_password
   ADMIN_EMAIL=admin@bongflavours.com

   # Application Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 🗄️ MongoDB Database Setup

### Automated Database Setup

The application includes comprehensive MongoDB models with automatic validation and schema enforcement.

### Required Collections

The following collections will be automatically created:

#### 1. Users Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, indexed),
  phone: String (required, unique, indexed),
  password: String (required, hashed),
  role: String (enum: ['customer', 'admin'], default: 'customer'),
  address: String (optional),
  city: String (optional),
  zipCode: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. Orders Collection

```javascript
{
  _id: ObjectId,
  orderNumber: String (required, unique, auto-generated),
  userId: ObjectId (required, references Users),
  items: [{
    menuItemId: String (required),
    name: String (required),
    price: Number (required),
    quantity: Number (required),
    variant: String (optional),
    specialInstructions: String (optional)
  }],
  customerInfo: {
    name: String (required),
    email: String (required),
    phone: String (required),
    address: String (required)
  },
  deliveryInfo: {
    address: String (required),
    phone: String (required),
    deliveryNotes: String (optional)
  },
  total: Number (required),
  status: String (enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'], default: 'pending'),
  paymentMethod: String (enum: ['cod', 'online'], default: 'cod'),
  notes: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Database Seeding Instructions for Local Development

#### Method 1: Using MongoDB Compass (Recommended for Beginners)

1. **Install MongoDB Compass**
   Download from [MongoDB Compass](https://www.mongodb.com/products/compass)

2. **Connect to your MongoDB instance**

   - Local: `mongodb://localhost:27017`
   - Atlas: Use your connection string from MongoDB Atlas

3. **Create Database**

   - Database name: `bongflavours`

4. **Import Sample Data**
   Create the following collections and import sample documents:

   **Users Collection Sample:**

   ```json
   [
     {
       "name": "Admin User",
       "email": "admin@bongflavours.com",
       "phone": "9876543210",
       "password": "$2b$10$hashedPasswordHere",
       "role": "admin",
       "createdAt": new Date(),
       "updatedAt": new Date()
     },
     {
       "name": "John Customer",
       "email": "customer@example.com",
       "phone": "9876543211",
       "password": "$2b$10$hashedPasswordHere",
       "role": "customer",
       "address": "123 Main Street",
       "city": "Kolkata",
       "zipCode": "700001",
       "createdAt": new Date(),
       "updatedAt": new Date()
     }
   ]
   ```

#### Method 2: Using MongoDB Shell

1. **Connect to MongoDB**

   ```bash
   mongosh "your_mongodb_connection_string"
   ```

2. **Switch to database**

   ```javascript
   use bongflavours
   ```

3. **Create admin user**

   ```javascript
   db.users.insertOne({
     name: "Admin User",
     email: "admin@bongflavours.com",
     phone: "9876543210",
     password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password"
     role: "admin",
     createdAt: new Date(),
     updatedAt: new Date(),
   });
   ```

4. **Create sample customer**

   ```javascript
   db.users.insertOne({
     name: "Test Customer",
     email: "customer@example.com",
     phone: "9876543211",
     password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password"
     role: "customer",
     address: "123 Main Street",
     city: "Kolkata",
     zipCode: "700001",
     createdAt: new Date(),
     updatedAt: new Date(),
   });
   ```

5. **Create indexes for performance**
   ```javascript
   db.users.createIndex({ email: 1 }, { unique: true });
   db.users.createIndex({ phone: 1 }, { unique: true });
   db.orders.createIndex({ userId: 1 });
   db.orders.createIndex({ orderNumber: 1 }, { unique: true });
   db.orders.createIndex({ createdAt: -1 });
   ```

#### Method 3: Using Node.js Seeding Script

Create a seeding script `scripts/seed.js`:

```javascript
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

const MONGODB_URI = "your_mongodb_connection_string";

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db("bongflavours");

    // Hash password
    const hashedPassword = await bcrypt.hash("password", 10);

    // Insert admin user
    await db.collection("users").insertOne({
      name: "Admin User",
      email: "admin@bongflavours.com",
      phone: "9876543210",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Insert sample customer
    await db.collection("users").insertOne({
      name: "Test Customer",
      email: "customer@example.com",
      phone: "9876543211",
      password: hashedPassword,
      role: "customer",
      address: "123 Main Street",
      city: "Kolkata",
      zipCode: "700001",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await client.close();
  }
}

seedDatabase();
```

Run the seeding script:

```bash
node scripts/seed.js
```

### Environment-Specific Database Configuration

#### For Local Development

```env
MONGODB_URI=mongodb://localhost:27017/bongflavours
```

#### For MongoDB Atlas (Production)

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bongflavours?retryWrites=true&w=majority
```

## 🔧 Configuration Guide

### Email Configuration (Gmail)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Update Environment Variables**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_16_character_app_password
   ```

### MongoDB Atlas Setup

1. **Create MongoDB Atlas Account** at [mongodb.com](https://mongodb.com)
2. **Create a New Cluster**
3. **Configure Network Access**:
   - Add your IP address (or 0.0.0.0/0 for development)
4. **Create Database User**:
   - Username/password for database access
5. **Get Connection String**:
   - Replace `<password>` with your database user password
   - Update `MONGODB_URI` in `.env.local`

### JWT Configuration

Generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add to `.env.local`:

```env
JWT_SECRET=your_generated_secret_here
```

## 🏗️ Project Structure

```
bong-flavours/
├── src/
│   ├── app/
│   │   ├── api/                 # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── orders/         # Order management
│   │   │   └── menu/           # Menu system
│   │   ├── app/                # Protected application routes
│   │   │   ├── menu/           # Menu browsing
│   │   │   ├── checkout/       # Order checkout
│   │   │   └── profile/        # User profile
│   │   ├── admin/              # Admin dashboard
│   │   ├── login/              # Authentication pages
│   │   └── signup/
│   ├── components/             # Reusable UI components
│   ├── contexts/               # React contexts (Auth, Cart)
│   ├── lib/                    # Utility libraries
│   │   ├── mongodb.ts          # Database connection
│   │   ├── auth.ts             # Authentication utilities
│   │   ├── invoice.ts          # PDF generation
│   │   └── mailer.ts           # Email utilities
│   ├── models/                 # MongoDB models
│   └── data/                   # Static data (menu items)
├── public/                     # Static assets
└── package.json
```

## 🔒 Authentication System

### Dual Authentication Support

The application supports both cookie-based and Bearer token authentication for maximum browser compatibility:

1. **Cookie Authentication**: Traditional httpOnly cookies (primary)
2. **Bearer Token Authentication**: localStorage-based tokens (fallback for VS Code Simple Browser)

### Authentication Flow

1. User logs in via `/api/auth/login-v2`
2. JWT token stored in both httpOnly cookie and localStorage
3. API requests check Authorization header first, then cookie
4. Profile updates work seamlessly across all browser environments

## 📧 Email System

### Bill Generation and Delivery

1. **Order Creation**: Triggers automatic PDF generation
2. **PDF Generation**: Professional invoice created using Puppeteer
3. **Dual Delivery**: Email sent to both customer and admin
4. **Error Handling**: Robust error handling with detailed logging

### Email Templates

- Customer email includes order details and PDF attachment
- Admin email includes complete order information for processing
- Professional HTML formatting with Bengali restaurant branding

## 🧪 Testing the Application

### Complete Order Flow Test

1. **Register/Login**:

   ```
   Email: customer@example.com
   Password: password
   ```

2. **Browse Menu**: Navigate to `/app/menu`
3. **Add Items to Cart**: Select dishes and quantities
4. **Proceed to Checkout**: Fill in delivery information
5. **Place Order**: Complete the order process
6. **Verify Email Delivery**: Check both customer and admin emails for PDF bills

### Authentication Testing

1. **Login Flow**: Test with VS Code Simple Browser and regular browsers
2. **Profile Updates**: Modify user profile information
3. **Order History**: View past orders in profile dashboard
4. **Admin Access**: Login as admin to manage orders

### PDF Generation Testing

The system automatically generates professional PDF bills with:

- Company branding and logo
- Complete order details
- Customer and delivery information
- Itemized pricing and totals
- Order number and timestamps

## 📊 Admin Features

### Order Management

- View all orders with filtering and pagination
- Update order status (pending → confirmed → preparing → ready → delivered)
- Customer information management
- Revenue tracking and analytics

### User Management

- View customer accounts
- Order history per customer
- Communication tools

## 🚀 Deployment

### Production Environment Variables

```env
# Production MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bongflavours_prod

# Secure JWT Secret
JWT_SECRET=production_secure_secret_32_characters_minimum

# Production Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=production_email@bongflavours.com
SMTP_PASS=production_app_password
ADMIN_EMAIL=admin@bongflavours.com

# Production URL
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Build and Deploy

```bash
npm run build
npm start
```

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Not Working**:

   - Verify JWT_SECRET is set
   - Check MongoDB connection
   - Clear browser localStorage and cookies

2. **PDF Generation Fails**:

   - Ensure Chrome/Chromium is installed
   - Check Puppeteer configuration
   - Verify sufficient system memory

3. **Emails Not Sending**:

   - Verify SMTP credentials
   - Check Gmail app password configuration
   - Ensure network connectivity

4. **Database Connection Issues**:
   - Verify MongoDB URI format
   - Check network access in MongoDB Atlas
   - Ensure database user permissions

### Debug Mode

Enable detailed logging by setting:

```env
NODE_ENV=development
```

## 📱 Browser Compatibility

- **Chrome/Chromium**: Full functionality
- **Firefox**: Full functionality
- **Safari**: Full functionality
- **VS Code Simple Browser**: Full functionality with Bearer token authentication
- **Mobile browsers**: Responsive design optimized

## 🔧 Development Tools

### Recommended VS Code Extensions

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- MongoDB for VS Code
- Thunder Client (API testing)

### Testing APIs

Use the included Postman collection or Thunder Client to test API endpoints:

- Authentication endpoints
- Order creation and management
- Profile updates
- Admin functionality

## 📈 Performance Optimizations

- **Next.js App Router**: Optimized routing and caching
- **MongoDB Indexing**: Efficient database queries
- **Image Optimization**: Next.js automatic image optimization
- **Lazy Loading**: Components loaded on demand
- **PDF Caching**: Generated PDFs cached for performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🍛 About Bong Flavours

Bong Flavours is a tribute to authentic Bengali cuisine, bringing the rich flavors and traditions of Bengal to your table through modern e-commerce technology.

---

**For technical support or questions, please contact the development team or create an issue in the repository.**

## 🌟 Features

### 🔐 Authentication & User Management

- **Dual Authentication System**: Separate login for customers and restaurant admin
- **JWT-based Security**: Secure token-based authentication with HTTP-only cookies
- **Role-based Access Control**: Different interfaces for customers and admin users
- **Profile Management**: Customer dashboard with order history and profile editing

### 🛒 E-commerce Functionality

- **Smart Menu System**: Public browsing menu and authenticated ordering menu
- **Shopping Cart**: Persistent cart with real-time quantity updates
- **Checkout Process**: Complete order flow with customer information validation
- **Order Management**: Full order lifecycle from placement to delivery
- **Invoice Generation**: Automated order confirmations and receipts

### 👨‍💼 Admin Dashboard

- **Order Management**: View, update, and track all customer orders
- **Menu Management**: Add, edit, and manage restaurant menu items
- **Customer Management**: View customer profiles and order history
- **Analytics**: Order statistics and business insights

### 🍽️ Menu Features

- **Categorized Menu**: Organized by food categories (Shorbot, Rice, Curry, etc.)
- **Vegetarian Filtering**: Clear VEG/NON-VEG labeling and filtering
- **Search Functionality**: Text-based menu item search
- **Detailed Item Info**: Prices, descriptions, and availability status

### 📱 Modern UI/UX

- **Responsive Design**: Mobile-first responsive layout
- **Smooth Animations**: Framer Motion powered transitions
- **Loading States**: Skeleton loading and progress indicators
- **Error Handling**: Comprehensive error states and user feedback

## 🛠️ Technology Stack

### Frontend

- **Next.js 15.5.0**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **React Context API**: State management for cart and authentication

### Backend

- **MongoDB Atlas**: Cloud database with Mongoose ODM
- **JWT Authentication**: Secure token-based auth
- **bcryptjs**: Password hashing and security
- **Nodemailer**: Email notifications
- **Zod**: Runtime type validation

### Development Tools

- **ESLint**: Code linting and quality
- **Puppeteer**: PDF processing
- **Sharp**: Image optimization
- **Socket.io**: Real-time communication (future feature)

## 📋 Prerequisites

Before setting up the project, ensure you have:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB Atlas account** (free tier works)
- **Git** for version control
- **Code editor** (VS Code recommended)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/DebdootManna/bong-flavours.git
cd bong-flavours
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment template and configure your settings:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bong-flavours?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000

# Email Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_RESTAURANT_EMAIL=mannadebdoot007@gmail.com
NEXT_PUBLIC_RESTAURANT_PHONE=8238018577

# Admin Credentials
ADMIN_EMAIL=admin@bongflavours.com
ADMIN_PASSWORD=admin123
```

### 4. Database Setup

The project includes automated scripts to seed your MongoDB database with menu items and demo users.

#### Seed Menu Items

```bash
npm run seed:menu
```

#### Seed Demo Users

```bash
npm run seed:users
```

#### Seed Everything at Once

```bash
npm run seed:all
```

### 5. Start Development Server

```bash
npm run dev
```

Your application will be available at [http://localhost:3000](http://localhost:3000)

## 🗄️ MongoDB Database Setup Guide

### Setting Up MongoDB Atlas

1. **Create MongoDB Atlas Account**

   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new project

2. **Create a Cluster**

   - Click "Create Cluster"
   - Choose "M0 Sandbox" (free tier)
   - Select your preferred cloud provider and region
   - Name your cluster (e.g., "bong-flavours-cluster")

3. **Configure Database Access**

   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a user with "Read and write to any database" permissions
   - Note down the username and password

4. **Configure Network Access**

   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development, add "0.0.0.0/0" (allows access from anywhere)
   - For production, add only your server's IP addresses

5. **Get Connection String**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<dbname>` with your values

### Local MongoDB Setup (Alternative)

If you prefer running MongoDB locally:

#### macOS (using Homebrew)

```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community

# Create database directory
sudo mkdir -p /data/db
sudo chown -R `id -un` /data/db
```

#### Ubuntu/Debian

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Windows

1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer with default settings
3. MongoDB will be installed as a Windows service

#### Local Connection String

For local MongoDB, use this connection string in your `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/bong-flavours
```

### Database Collections

The application automatically creates these collections:

1. **users** - Customer and admin accounts
2. **menuitems** - Restaurant menu items
3. **orders** - Customer orders
4. **sessions** - User sessions (if using NextAuth)

### Seeding Instructions for Local Machines

#### 1. Menu Data Seeding

The `scripts/seedMenu.js` script will:

- Read menu data from `data/menu.json`
- Clear existing menu items
- Insert 100+ Bengali food items
- Create database indexes for performance
- Display seeding statistics

**Run the script:**

```bash
npm run seed:menu
```

**Expected output:**

```
📖 Loaded 158 menu items from data/menu.json
🔌 Connecting to MongoDB...
🗑️  Clearing existing menu items...
📝 Inserting menu items...
✅ Successfully seeded 158 menu items
🔍 Creating database indexes...

📊 Seeding Statistics:
   Total items: 158
   Vegetarian: 89
   Non-vegetarian: 69
   Categories: 8
   Categories: Shorbot, Rice, Fish, Chicken, Mutton, Veg, Prawn, Egg

🎉 Menu seeding completed successfully!
```

#### 2. User Account Seeding

The `scripts/seedUsers.js` script will:

- Create admin and customer demo accounts
- Hash all passwords securely
- Create database indexes
- Display account credentials

**Run the script:**

```bash
npm run seed:users
```

**Expected output:**

```
👥 Starting user seeding process...
📝 Preparing to create 6 demo accounts

🔌 Connecting to MongoDB...
🔐 Hashing passwords...
📝 Inserting demo users...
✅ Successfully created 6 demo accounts

📊 Demo Accounts Summary:
==================================================

👨‍💼 ADMIN ACCOUNT:
------------------------------
   Name: Restaurant Admin
   Email: admin@bongflavours.com
   Phone: 9876543210
   Password: admin123
   Role: admin

👥 CUSTOMER ACCOUNTS:
------------------------------
   1. Raj Kumar
      Email: raj.kumar@example.com
      Phone: 9876543211
      Password: customer123
      Address: 123 Salt Lake, Kolkata 700064

   2. Priya Sharma
      Email: priya.sharma@example.com
      Phone: 9876543212
      Password: customer123
      Address: 456 New Town, Kolkata 700156

   [... more customer accounts ...]

🎉 User seeding completed successfully!
```

#### 3. Complete Database Setup

To set up everything at once:

```bash
npm run seed:all
```

This will run both menu and user seeding scripts sequentially.

#### 4. Verify Database Setup

You can verify your database setup by:

1. **Check collections in MongoDB Atlas:**

   - Log into MongoDB Atlas
   - Navigate to your cluster
   - Click "Browse Collections"
   - Verify `users` and `menuitems` collections exist

2. **Test login with demo accounts:**

   - Start your dev server: `npm run dev`
   - Navigate to `http://localhost:3000/login`
   - Use admin credentials: `admin@bongflavours.com` / `admin123`
   - Or customer credentials: `raj.kumar@example.com` / `customer123`

3. **Check menu display:**
   - Navigate to `http://localhost:3000/menu`
   - Verify menu items are displaying correctly
   - Test vegetarian filter functionality

#### 5. Troubleshooting Database Issues

**Connection Issues:**

```bash
# Test database connection
node scripts/test-connection.js
```

**Clear and Reseed:**

```bash
# If you need to start fresh
npm run seed:all
```

**Manual Database Inspection:**

```bash
# Install MongoDB Compass (GUI tool)
# Connect using your MongoDB URI
# Browse collections and documents
```

**Common Issues:**

1. **Authentication Failed:**

   - Verify username/password in connection string
   - Check MongoDB Atlas database user permissions

2. **Network Timeout:**

   - Verify IP address is whitelisted in MongoDB Atlas
   - Check firewall settings

3. **Database Not Found:**

   - MongoDB will automatically create the database on first write
   - Ensure the database name in URI matches your configuration

4. **Duplicate Key Errors:**
   - User emails must be unique
   - Clear existing users before reseeding: `db.users.deleteMany({})`

## 🧪 Demo Accounts

After running the seeding scripts, you'll have these demo accounts:

### Admin Account

- **Email:** admin@bongflavours.com
- **Password:** admin123
- **Access:** Full admin dashboard, order management, menu management

### Customer Accounts

- **Email:** raj.kumar@example.com
- **Password:** customer123

- **Email:** priya.sharma@example.com
- **Password:** customer123

- **Email:** amit.das@example.com
- **Password:** customer123

(And more customer accounts - see seeding output for complete list)

## 📁 Project Structure

```
bong-flavours/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── menu/          # Menu data endpoints
│   │   │   └── orders/        # Order management
│   │   ├── app/               # Authenticated pages
│   │   │   ├── menu/          # Customer menu with cart
│   │   │   ├── checkout/      # Order checkout process
│   │   │   ├── profile/       # Customer dashboard
│   │   │   └── admin/         # Admin dashboard
│   │   ├── login/             # Authentication pages
│   │   ├── menu/              # Public menu (browse-only)
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable React components
│   │   ├── Header.tsx         # Navigation component
│   │   ├── Footer.tsx         # Footer component
│   │   └── [other components]
│   ├── contexts/              # React Context providers
│   │   ├── AuthContext.tsx    # Authentication state
│   │   └── CartContext.tsx    # Shopping cart state
│   ├── models/                # MongoDB/Mongoose models
│   │   ├── User.ts            # User schema
│   │   ├── Order.ts           # Order schema
│   │   └── MenuItem.ts        # Menu item schema
│   └── lib/                   # Utility functions
├── data/
│   └── menu.json             # Restaurant menu data
├── scripts/                   # Database seeding scripts
│   ├── seedMenu.js           # Menu data seeding
│   ├── seedUsers.js          # User account seeding
│   └── test-connection.js    # Database connection test
├── public/                    # Static assets
└── [config files]            # Next.js, TypeScript, Tailwind configs
```

## 🔗 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Menu

- `GET /api/menu` - Get all menu items
- `GET /api/menu/[id]` - Get specific menu item

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders (or all orders for admin)
- `GET /api/orders/[id]` - Get specific order
- `PUT /api/orders/[id]` - Update order status (admin only)

### Admin

- `GET /api/admin/orders` - Get all orders (admin only)
- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/orders/[id]` - Update order (admin only)

## 🎯 Usage Guide

### Customer Workflow

1. **Browse Menu** - Visit `/menu` to browse available items
2. **Register/Login** - Create account or login at `/login`
3. **Order Items** - Navigate to `/app/menu` to add items to cart
4. **Checkout** - Complete order at `/app/checkout`
5. **Track Orders** - View order history at `/app/profile`

### Admin Workflow

1. **Admin Login** - Login with admin credentials
2. **Dashboard** - Access admin dashboard at `/app/admin`
3. **Manage Orders** - View and update order statuses
4. **Menu Management** - Add/edit menu items
5. **Customer Management** - View customer accounts and orders

## 🔧 Development Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Database Management
npm run seed:menu       # Seed menu items
npm run seed:users      # Seed demo users
npm run seed:all        # Seed everything

# Utilities
npm run extract:pdf     # Extract menu from PDF
npm run build:menu      # Generate static menu HTML
```

## 🌐 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**

   - Import your GitHub repository to Vercel
   - Configure build settings (Next.js preset)

2. **Environment Variables**

   - Add all environment variables from `.env.local`
   - Use production MongoDB URI
   - Set up production email service

3. **Deploy**
   - Vercel will automatically deploy on push to main branch
   - Run database seeding scripts after first deployment

### Manual Deployment

1. **Build Application**

   ```bash
   npm run build
   ```

2. **Set Environment Variables**

   - Configure production environment variables
   - Use production database and email services

3. **Start Production Server**
   ```bash
   npm start
   ```

## 🔒 Security Considerations

- **Passwords**: All passwords are hashed with bcryptjs (12 salt rounds)
- **JWT Tokens**: Secure HTTP-only cookies with appropriate expiration
- **Environment Variables**: Never commit sensitive data to version control
- **Database**: Use MongoDB Atlas network restrictions in production
- **CORS**: Configure appropriate CORS policies for production
- **Rate Limiting**: Implement rate limiting for API endpoints in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**

   - Verify MONGODB_URI in `.env.local`
   - Check MongoDB Atlas network access
   - Ensure database user has correct permissions

2. **Menu Items Not Loading**

   - Run menu seeding: `npm run seed:menu`
   - Check API endpoint: `http://localhost:3000/api/menu`
   - Verify MongoDB collection has data

3. **Authentication Issues**

   - Check JWT_SECRET in environment variables
   - Clear browser cookies and local storage
   - Verify user accounts exist in database

4. **Cart Not Persisting**

   - Check browser local storage permissions
   - Verify CartContext is properly configured
   - Test in incognito mode to rule out cache issues

5. **Email Notifications Not Working**
   - Verify SMTP credentials in `.env.local`
   - Check email provider settings (Gmail app passwords)
   - Test with mail testing service like Mailtrap

### Getting Help

- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check inline code comments
- **Logs**: Check browser console and server logs for errors

## 📞 Support

For support and questions:

- **Email**: mannadebdoot007@gmail.com
- **GitHub**: [DebdootManna](https://github.com/DebdootManna)
- **Issues**: [GitHub Issues](https://github.com/DebdootManna/bong-flavours/issues)

---

**Made with ❤️ for Bengali food lovers by Debdoot Manna**
