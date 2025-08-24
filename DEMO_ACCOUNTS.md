# 🎭 Demo Accounts - Quick Reference

## 👨‍💼 Admin Account

**For accessing admin dashboard, managing orders and bookings**

- **Email:** `admin@bongflavours.com`
- **Password:** `admin123`
- **Role:** Admin
- **Features:** Full access to dashboard, order management, booking management

---

## 👥 Customer Accounts

**For testing customer registration, ordering, and booking features**

### 1. Raj Kumar

- **Email:** `raj.kumar@example.com`
- **Password:** `customer123`
- **Phone:** 9876543211
- **Address:** 123 Salt Lake, Kolkata 700064

### 2. Priya Sharma

- **Email:** `priya.sharma@example.com`
- **Password:** `customer123`
- **Phone:** 9876543212
- **Address:** 456 New Town, Kolkata 700156

### 3. Amit Das

- **Email:** `amit.das@example.com`
- **Password:** `customer123`
- **Phone:** 9876543213
- **Address:** 789 Ballygunge, Kolkata 700019

### 4. Sita Roy

- **Email:** `sita.roy@example.com`
- **Password:** `customer123`
- **Phone:** 9876543214
- **Address:** 321 Gariahat, Kolkata 700029

### 5. Kiran Banerjee

- **Email:** `kiran.banerjee@example.com`
- **Password:** `customer123`
- **Phone:** 9876543215
- **Address:** 654 Jadavpur, Kolkata 700032

---

## 🧪 Testing Scenarios

### Admin Testing:

1. Login with admin account
2. Access `/api/admin/dashboard` to see statistics
3. View all orders with `/api/orders`
4. Manage bookings with `/api/bookings`
5. Update order statuses
6. Generate invoices

### Customer Testing:

1. Login with any customer account
2. Browse menu at `/api/menu`
3. Place orders via `/api/orders`
4. Make bookings via `/api/bookings`
5. Check payment status
6. Download invoices

### Complete Order Flow:

1. **Login** → Use customer account
2. **Browse** → GET `/api/menu`
3. **Order** → POST `/api/orders` with items
4. **Pay** → POST `/api/payments/confirm`
5. **Invoice** → GET `/api/invoices/[orderId]`

### Complete Booking Flow:

1. **Visit** → Booking page
2. **Book** → POST `/api/bookings`
3. **Admin** → Login as admin
4. **Confirm** → PUT `/api/bookings/[id]` with status "confirmed"

---

## 🔐 Security Notes

- All passwords are hashed with bcryptjs (12 salt rounds)
- Demo accounts are for development/testing only
- Change admin password in production
- Use HTTPS in production environment

---

## 📋 Quick Commands

```bash
# Seed all demo accounts
npm run seed:users

# Seed both menu and users
npm run seed:all

# Start development server
npm run dev

# Test accounts (copy to browser console)
# Run the test-accounts.js script
```

---

## 🎯 API Testing URLs

**Base URL:** `http://localhost:3000/api`

### Authentication:

- POST `/auth/login` - Login
- POST `/auth/signup` - Register
- GET `/auth/me` - Current user
- POST `/auth/logout` - Logout

### Menu:

- GET `/menu` - Get all menu items

### Orders:

- GET `/orders` - List orders
- POST `/orders` - Create order
- GET `/orders/[id]` - Get order
- PUT `/orders/[id]` - Update order (admin)

### Bookings:

- GET `/bookings` - List bookings
- POST `/bookings` - Create booking
- GET `/bookings/[id]` - Get booking
- PUT `/bookings/[id]` - Update booking (admin)

### Payments:

- POST `/payments/confirm` - Confirm payment
- GET `/payments/status/[orderId]` - Payment status

### Invoices:

- GET `/invoices/[orderId]` - Generate invoice

### Admin:

- GET `/admin/dashboard` - Dashboard stats

---

**Happy Testing! 🍛✨**
