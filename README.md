# 🍛 Bong Flavours - Bengali Restaurant E-commerce Platform

A modern, full-stack Bengali restaurant website with complete ordering system, built with Next.js 15, MongoDB, and TypeScript. Features customer authentication, admin dashboard, real-time order management, and comprehensive cart functionality.

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
