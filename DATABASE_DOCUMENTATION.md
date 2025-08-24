# Bong Flavours Database System Documentation

## Overview

This document describes the complete MongoDB database implementation for the Bong Flavours restaurant website, including authentication, orders, bookings, and bill generation.

## Database Models

### 1. User Model (`/src/models/User.ts`)

```typescript
interface IUser {
  name: string
  email: string (unique)
  phone: string (Indian format: 10 digits starting with 6-9)
  password: string (hashed with bcryptjs)
  role: 'customer' | 'admin'
  address?: string
  createdAt: Date
  updatedAt: Date
}
```

**Indexes:**

- `email` (unique)
- `role`

### 2. MenuItem Model (`/src/models/MenuItem.ts`)

```typescript
interface IMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  type: "Veg" | "Non-Veg";
  isAvailable: boolean;
  ingredients?: string[];
  allergens?: string[];
  spiceLevel?: number;
  preparationTime?: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**

- `category`
- `type`
- `isAvailable`

### 3. Order Model (`/src/models/Order.ts`)

```typescript
interface IOrder {
  orderNumber: string (auto-generated: BF000001)
  userId: ObjectId (ref: User)
  customerInfo: {
    name: string
    email: string
    phone: string
    address: string
  }
  items: Array<{
    menuItemId: ObjectId
    name: string
    price: number
    quantity: number
    variant?: string
    specialInstructions?: string
  }>
  subtotal: number
  tax: number (5% GST)
  total: number
  status: 'placed' | 'confirmed' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled'
  paymentMethod: 'cod' | 'online'
  paymentStatus: 'pending' | 'paid' | 'failed'
  deliveryInfo: {
    address: string
    phone: string
    estimatedTime?: Date
    actualDeliveryTime?: Date
    deliveryNotes?: string
  }
  invoiceUrl?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}
```

**Indexes:**

- `orderNumber` (unique)
- `userId`
- `status`, `createdAt`
- `paymentStatus`

### 4. Booking Model (`/src/models/Booking.ts`)

```typescript
interface IBooking {
  userId?: ObjectId (ref: User, optional for guest bookings)
  name: string
  email: string
  phone: string
  date: Date
  time: string (HH:MM format)
  numPersons: number (1-20)
  status: 'requested' | 'confirmed' | 'cancelled' | 'completed'
  tableNumber?: string
  notes?: string
  reminderSent: boolean
  createdAt: Date
  updatedAt: Date
}
```

**Indexes:**

- `date`, `time`
- `status`, `date`
- `email`

## API Endpoints

### Authentication APIs

#### POST `/api/auth/signup`

Create a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "message": "User created successfully",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

#### POST `/api/auth/login`

Authenticate user and get JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

#### GET `/api/auth/me`

Get current user information (requires authentication).

#### POST `/api/auth/logout`

Logout user and clear authentication cookie.

### Menu APIs

#### GET `/api/menu`

Get all menu items with optional filtering.

**Query Parameters:**

- `category` - Filter by category
- `type` - Filter by Veg/Non-Veg
- `search` - Search in name/description

**Response:**

```json
[
  {
    "id": "1",
    "name": "Kosha Mangsho",
    "description": "Traditional Bengali mutton curry",
    "price": 350,
    "category": "Main Course",
    "type": "Non-Veg",
    "isAvailable": true
  }
]
```

### Order APIs

#### GET `/api/orders`

Get user's orders (admin can see all orders).

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by order status

#### POST `/api/orders`

Create a new order (requires authentication).

**Request Body:**

```json
{
  "items": [
    {
      "menuItemId": "...",
      "name": "Kosha Mangsho",
      "price": 350,
      "quantity": 2,
      "specialInstructions": "Medium spicy"
    }
  ],
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "123 Street, Kolkata"
  },
  "deliveryInfo": {
    "address": "123 Street, Kolkata",
    "phone": "9876543210",
    "deliveryNotes": "Call on arrival"
  },
  "paymentMethod": "cod",
  "notes": "Extra spicy"
}
```

#### GET `/api/orders/[id]`

Get specific order details.

#### PUT `/api/orders/[id]`

Update order status (admin only).

**Request Body:**

```json
{
  "status": "confirmed",
  "estimatedTime": "2025-01-01T20:00:00Z"
}
```

#### DELETE `/api/orders/[id]`

Cancel an order.

### Booking APIs

#### GET `/api/bookings`

Get bookings (authenticated users see their bookings, admin sees all).

#### POST `/api/bookings`

Create a new booking (no authentication required).

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "date": "2025-01-15",
  "time": "19:30",
  "numPersons": 4,
  "notes": "Window seat preferred"
}
```

#### GET `/api/bookings/[id]`

Get specific booking details.

#### PUT `/api/bookings/[id]`

Update booking status (admin only).

#### DELETE `/api/bookings/[id]`

Cancel a booking.

### Payment APIs

#### POST `/api/payments/confirm`

Confirm payment for an order.

**Request Body:**

```json
{
  "orderId": "...",
  "paymentMethod": "cod",
  "paymentStatus": "paid",
  "transactionId": "TXN123456" // for online payments
}
```

#### GET `/api/payments/status/[orderId]`

Get payment status for an order.

### Invoice APIs

#### GET `/api/invoices/[orderId]`

Generate and download invoice for an order.

Returns PDF file or HTML fallback if PDF generation fails.

### Admin APIs

#### GET `/api/admin/dashboard`

Get admin dashboard statistics (admin only).

**Response:**

```json
{
  "orders": {
    "total": 150,
    "today": 5,
    "week": 25,
    "month": 100,
    "byStatus": [...],
    "byPayment": [...]
  },
  "revenue": {
    "total": 50000,
    "today": 1500,
    "week": 8000,
    "month": 30000
  },
  "bookings": {
    "total": 75,
    "today": 3,
    "week": 15,
    "month": 50
  },
  "users": {
    "total": 200,
    "newToday": 2,
    "newWeek": 10,
    "newMonth": 40
  },
  "popularItems": [...],
  "recentOrders": [...],
  "recentBookings": [...]
}
```

## Database Configuration

### Environment Variables (.env.local)

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/bong-flavours

# Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Site Configuration
NEXT_PUBLIC_RESTAURANT_EMAIL=mannadebdoot007@gmail.com
NEXT_PUBLIC_RESTAURANT_PHONE=8238018577
```

### Database Connection (`/src/lib/mongodb.ts`)

The database connection is handled through a singleton pattern with connection caching for optimal performance in Next.js serverless environment.

### Authentication (`/src/lib/auth.ts`)

- Password hashing using bcryptjs with salt rounds: 12
- JWT tokens with 7-day expiration
- HTTP-only cookies for secure token storage
- Role-based access control (customer/admin)

## Data Seeding

### Menu Data Seeding

```bash
npm run seed:menu
```

This command:

1. Connects to MongoDB
2. Clears existing menu items
3. Imports all 147 menu items from `/data/menu.json`
4. Creates database indexes
5. Provides seeding statistics

### Sample Data

The system includes 147 authentic Bengali menu items across 9 categories:

- **Starters** (21 items)
- **Main Course** (23 items)
- **Rice** (18 items)
- **Kolkata Biryani** (13 items)
- **Roti/Paratha/Loochi** (22 items)
- **Kolkata Chinese** (16 items)
- **Kolkata Kathi Roll & Mughlai Paratha** (13 items)
- **Shorbot** (11 items)
- **Accompaniments & Desserts** (10 items)

## Security Features

### Authentication Security

- Passwords hashed with bcryptjs (12 salt rounds)
- JWT tokens with secure secret
- HTTP-only cookies prevent XSS attacks
- Role-based access control

### API Security

- Input validation using Zod schemas
- SQL injection prevention through Mongoose
- Rate limiting considerations
- CORS configuration

### Data Validation

- Mongoose schema validation
- Custom validators for Indian phone numbers
- Email format validation
- Date/time format validation

## Error Handling

### Standardized Error Responses

```json
{
  "message": "Error description",
  "errors": [...] // For validation errors
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Performance Considerations

### Database Indexes

- Strategic indexes on frequently queried fields
- Compound indexes for complex queries
- Unique indexes for data integrity

### Connection Management

- Connection pooling through Mongoose
- Connection reuse in serverless environment
- Proper connection cleanup

### Query Optimization

- Pagination for large result sets
- Field selection to reduce data transfer
- Aggregation pipelines for complex reporting

## Deployment Checklist

### Environment Setup

- [ ] MongoDB database provisioned
- [ ] Environment variables configured
- [ ] JWT secret generated
- [ ] Email service configured

### Data Migration

- [ ] Menu data seeded
- [ ] Admin user created
- [ ] Database indexes created

### Security

- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Input validation verified

### Monitoring

- [ ] Database monitoring setup
- [ ] Error logging configured
- [ ] Performance metrics tracked

## API Testing

Use the provided test script (`test-database.js`) to verify all functionality:

```bash
node test-database.js
```

This tests:

- User registration and login
- Menu API functionality
- Order creation and management
- Booking system
- Payment processing
- Invoice generation

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**

   - Check MONGODB_URI in .env.local
   - Ensure MongoDB service is running
   - Verify network connectivity

2. **Authentication Issues**

   - Check JWT_SECRET configuration
   - Verify cookie settings
   - Ensure proper token format

3. **Validation Errors**

   - Check Zod schema definitions
   - Verify input data format
   - Review error messages

4. **Performance Issues**
   - Check database indexes
   - Monitor query performance
   - Review connection pooling

## Future Enhancements

### Planned Features

- Real-time order tracking with WebSocket
- Advanced analytics dashboard
- Multi-language support
- Payment gateway integration
- Inventory management
- Loyalty program

### Scalability Considerations

- Database sharding for high volume
- Redis caching layer
- CDN for static content
- Load balancing
- Microservices architecture

---

**Last Updated:** August 24, 2025  
**Database Version:** 1.0  
**Compatible with:** Next.js 15.5.0, MongoDB 5.0+
