# UniStayConnect - Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
5. [User Roles](#user-roles)
6. [Frontend Routes](#frontend-routes)
7. [API Endpoints](#api-endpoints)
8. [How to Use the Application](#how-to-use-the-application)
9. [Database Schema](#database-schema)
10. [Environment Variables](#environment-variables)

---

## 🎯 Project Overview

**UniStayConnect** is a full-stack student accommodation platform built with Next.js 14. It connects students, landlords, and administrators in a seamless ecosystem for finding, listing, and managing student housing.

### Key Objectives
- Simplify the accommodation search process for students
- Provide landlords with an easy platform to list and manage properties
- Enable real-time communication between students and landlords
- Admin oversight for property approvals and user management

---

## ✨ Features

### For Students
- Browse and search available accommodations
- View detailed property information with images and amenities
- Book properties with booking requests
- Real-time messaging with landlords
- Save favorite properties
- View booking history

### For Landlords
- List new properties with images and details
- Manage property listings (edit, delete)
- View and respond to booking requests
- Accept or reject booking requests
- Real-time messaging with students
- View property analytics

### For Administrators
- Manage all users (students, landlords)
- Approve or reject property listings
- View platform statistics and analytics
- Monitor bookings and reports
- Manage reviews and content

---

## 🛠 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **NextAuth.js** for authentication

### Backend
- **Next.js API Routes** (REST API)
- **Service Layer Architecture** (separated by role: student, landlord, admin)
- **Prisma ORM** for database management
- **PostgreSQL** database
- **NextAuth.js** with Credentials & Google OAuth

### Additional Tools
- **bcryptjs** for password hashing
- **Zod** for schema validation
- **TypeScript** for type safety

### Architecture
- **Service Layer Pattern** - Business logic separated by role
  - `services/student/` - Student-specific services
  - `services/landlord/` - Landlord-specific services
  - `services/admin/` - Admin-specific services
  - `services/shared/` - Shared services (messages, public properties)

---

## 🚀 Getting Started

See [SETUP.md](./SETUP.md) for detailed setup instructions.

### Quick Start
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and secrets

# Set up database
npx prisma db push
npm run db:seed

# Run development server
npm run dev
```

The application will be available at `http://localhost:3000`

---

## 👥 User Roles

### Student
- Default role for new users
- Can browse properties, make bookings, and message landlords
- Dashboard: `/dashboard/student`

### Landlord
- Can list properties, manage listings, and respond to bookings
- Dashboard: `/dashboard/landlord`

### Admin
- Full access to manage users, properties, and platform settings
- Dashboard: `/admin`

---

## 🗺 Frontend Routes

### Public Routes
- `/` - Home page with hero section and featured properties
- `/about` - About Us page with contact form
- `/properties` - Property listing page with filters
- `/properties/[id]` - Individual property detail page
- `/auth/login` - Login page
- `/auth/signup` - Signup page

### Protected Routes (Require Authentication)

#### Student Routes
- `/dashboard/student` - Student dashboard with recommended properties
- `/dashboard/student/bookings` - View and manage booking history (NEW)
- `/messages` - Enhanced messaging interface with real-time updates

#### Landlord Routes
- `/dashboard/landlord` - Landlord dashboard
- `/dashboard/landlord/properties` - Manage all properties (Full Page)
- `/dashboard/landlord/properties/new` - Add new property (Form Page)
- `/dashboard/landlord/properties/[id]/edit` - Edit property (Form Page)
- `/dashboard/landlord/bookings` - Manage booking requests (Full Page)
- `/dashboard/landlord/messages` - Messaging interface (Full Page)

#### Admin Routes
- `/admin` - Admin dashboard with statistics
- `/admin/users` - Manage users
- `/admin/properties` - Manage all properties
- `/admin/reviews` - Manage reviews

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### `POST /api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student" | "landlord"
}
```

**Response:**
```json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student"
}
```

#### `GET /api/auth/session`
Get current user session.

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "avatar": "avatar_url"
  }
}
```

#### `POST /api/auth/[...nextauth]`
NextAuth authentication endpoint (handles login, logout, OAuth).

---

### Property Endpoints

#### `GET /api/properties`
Get all properties with optional filters.

**Query Parameters:**
- `search` (string, optional) - Search in title, description, or address
- `status` (string, optional) - Filter by status: `available`, `rented`, `pending`, `rejected`
- `limit` (number, optional) - Limit number of results

**Example:**
```
GET /api/properties?search=apartment&status=available&limit=10
```

**Response:**
```json
[
  {
    "id": "property_id",
    "title": "Cozy Studio Apartment",
    "description": "Beautiful studio near campus",
    "price": 1200,
    "images": ["url1", "url2"],
    "address": "123 Main St",
    "amenities": ["WiFi", "Kitchen"],
    "type": "studio",
    "status": "available",
    "landlord": {
      "user": {
        "id": "landlord_id",
        "name": "Landlord Name",
        "email": "landlord@example.com"
      }
    },
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### `GET /api/properties/[id]`
Get a single property by ID.

**Response:**
```json
{
  "id": "property_id",
  "title": "Cozy Studio Apartment",
  "description": "Beautiful studio near campus",
  "price": 1200,
  "images": ["url1", "url2"],
  "address": "123 Main St",
  "amenities": ["WiFi", "Kitchen"],
  "type": "studio",
  "status": "available",
  "landlord": {
    "user": {
      "id": "landlord_id",
      "name": "Landlord Name",
      "email": "landlord@example.com",
      "avatar": "avatar_url"
    }
  }
}
```

#### `POST /api/properties`
Create a new property (Landlord only).

**Request Body:**
```json
{
  "title": "Cozy Studio Apartment",
  "description": "Beautiful studio near campus",
  "price": 1200,
  "images": ["url1", "url2"],
  "address": "123 Main St",
  "amenities": ["WiFi", "Kitchen"],
  "type": "studio"
}
```

**Response:**
```json
{
  "id": "property_id",
  "title": "Cozy Studio Apartment",
  "status": "pending",
  ...
}
```

#### `GET /api/properties/landlord`
Get all properties for the authenticated landlord.

**Authentication:** Required (Landlord role)

**Response:**
```json
[
  {
    "id": "property_id",
    "title": "Cozy Studio Apartment",
    "price": 1200,
    "status": "available",
    "bookings": [...]
  }
]
```

---

### Booking Endpoints

#### `GET /api/bookings`
Get all bookings for the authenticated user.

**Authentication:** Required

**Response:**
```json
[
  {
    "id": "booking_id",
    "studentId": "student_id",
    "propertyId": "property_id",
    "startDate": "2024-02-01T00:00:00Z",
    "endDate": "2024-12-31T00:00:00Z",
    "status": "pending",
    "property": {
      "id": "property_id",
      "title": "Cozy Studio Apartment"
    },
    "student": {
      "id": "student_id",
      "name": "Student Name"
    }
  }
]
```

#### `POST /api/bookings`
Create a new booking request (Student only).

**Request Body:**
```json
{
  "propertyId": "property_id",
  "startDate": "2024-02-01T00:00:00Z",
  "endDate": "2024-12-31T00:00:00Z"
}
```

**Response:**
```json
{
  "id": "booking_id",
  "status": "pending",
  ...
}
```

#### `GET /api/bookings/landlord`
Get all booking requests for landlord's properties.

**Authentication:** Required (Landlord role)

**Response:**
```json
[
  {
    "id": "booking_id",
    "student": {
      "name": "Student Name",
      "email": "student@example.com"
    },
    "property": {
      "title": "Cozy Studio Apartment"
    },
    "startDate": "2024-02-01T00:00:00Z",
    "endDate": "2024-12-31T00:00:00Z",
    "status": "pending"
  }
]
```

#### `PATCH /api/bookings/landlord`
Update booking status (Landlord only).

**Request Body:**
```json
{
  "bookingId": "booking_id",
  "status": "approved" | "rejected"
}
```

**Response:**
```json
{
  "id": "booking_id",
  "status": "approved",
  ...
}
```

#### `GET /api/bookings/[id]`
Get a single booking by ID.

**Authentication:** Required

**Response:**
```json
{
  "id": "booking_id",
  "studentId": "student_id",
  "propertyId": "property_id",
  "startDate": "2024-02-01T00:00:00Z",
  "endDate": "2024-12-31T00:00:00Z",
  "status": "pending",
  "property": {
    "id": "property_id",
    "title": "Cozy Studio Apartment",
    "landlord": {
      "user": {
        "id": "landlord_id",
        "name": "Landlord Name"
      }
    }
  },
  "student": {
    "id": "student_id",
    "name": "Student Name"
  }
}
```

#### `PATCH /api/bookings/[id]`
Update booking status (Student can cancel, Landlord can approve/reject).

**Request Body:**
```json
{
  "status": "cancelled" | "approved" | "rejected"
}
```

**Response:**
```json
{
  "id": "booking_id",
  "status": "cancelled",
  ...
}
```

#### `DELETE /api/properties/[id]`
Delete a property (Landlord only - must own the property).

**Authentication:** Required (Landlord role)

**Response:**
```json
{
  "success": true
}
```

#### `PATCH /api/properties/[id]`
Update a property (Landlord only - must own the property).

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "price": 1300,
  "images": ["url1", "url2"],
  "address": "Updated address",
  "amenities": ["WiFi", "Kitchen"],
  "type": "apartment",
  "status": "available"
}
```

**Response:**
```json
{
  "id": "property_id",
  "title": "Updated Title",
  ...
}
```

---

### Message Endpoints

#### `GET /api/messages`
Get all conversations for the authenticated user.

**Authentication:** Required

**Response:**
```json
[
  {
    "id": "participant_id",
    "participantId": "participant_id",
    "participantName": "John Doe",
    "participantAvatar": "avatar_url",
    "lastMessage": "Hello!",
    "lastMessageTime": "2024-01-01T00:00:00Z"
  }
]
```

#### `GET /api/messages?receiverId=[id]`
Get all messages between authenticated user and receiver.

**Query Parameters:**
- `receiverId` (string, required) - ID of the conversation partner

**Response:**
```json
[
  {
    "id": "message_id",
    "senderId": "sender_id",
    "receiverId": "receiver_id",
    "content": "Hello!",
    "timestamp": "2024-01-01T00:00:00Z",
    "sender": {
      "id": "sender_id",
      "name": "Sender Name",
      "avatar": "avatar_url"
    },
    "receiver": {
      "id": "receiver_id",
      "name": "Receiver Name",
      "avatar": "avatar_url"
    }
  }
]
```

#### `POST /api/messages`
Send a new message.

**Request Body:**
```json
{
  "receiverId": "receiver_id",
  "content": "Hello, I'm interested in your property!"
}
```

**Response:**
```json
{
  "id": "message_id",
  "senderId": "sender_id",
  "receiverId": "receiver_id",
  "content": "Hello, I'm interested in your property!",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

### Bookmark Endpoints

#### `GET /api/bookmarks`
Get all bookmarks for the authenticated student.

**Authentication:** Required (Student role)

**Response:**
```json
[
  {
    "id": "bookmark_id",
    "propertyId": "property_id",
    "createdAt": "2024-01-01T00:00:00Z",
    "property": {
      "id": "property_id",
      "title": "Cozy Studio Apartment",
      "price": 1200,
      "images": ["url1"],
      "address": "123 Main St",
      "landlord": {
        "user": {
          "id": "landlord_id",
          "name": "Landlord Name"
        }
      }
    }
  }
]
```

#### `POST /api/bookmarks`
Add a property to bookmarks (Student only).

**Request Body:**
```json
{
  "propertyId": "property_id"
}
```

**Response:**
```json
{
  "id": "bookmark_id",
  "userId": "user_id",
  "propertyId": "property_id",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### `DELETE /api/bookmarks?propertyId=[id]`
Remove a bookmark (Student only).

**Query Parameters:**
- `propertyId` (string, required) - Property ID to remove from bookmarks

**Response:**
```json
{
  "success": true
}
```

#### `GET /api/bookmarks/check?propertyId=[id]`
Check if a property is bookmarked by the current user.

**Query Parameters:**
- `propertyId` (string, required) - Property ID to check

**Response:**
```json
{
  "isBookmarked": true
}
```

---

### User Management Endpoints

#### `GET /api/users`
Get all users (Admin only).

**Authentication:** Required (Admin role)

**Response:**
```json
[
  {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "avatar": "avatar_url",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

---

### Admin Endpoints

#### `GET /api/admin/stats`
Get platform statistics (Admin only).

**Authentication:** Required (Admin role)

**Response:**
```json
{
  "totalUsers": 150,
  "totalProperties": 45,
  "totalReports": 3
}
```

---

## 📖 How to Use the Application

### For Students

#### 1. Sign Up / Login
- Navigate to `/auth/signup` or `/auth/login`
- Create an account with role "Student"
- Or use Google OAuth for quick signup

#### 2. Browse Properties
- Visit `/properties` to see all available accommodations
- Use search bar to find properties by location, budget, or type
- Click on any property to view details

#### 3. View Property Details
- Click on a property card to see full details
- View images, amenities, pricing, and location
- Click "Message Owner" to contact the landlord
- Click "Book Now" to create a booking request

#### 4. Manage Bookings
- Go to `/dashboard/student` to see your dashboard
- View recommended properties
- Check booking status in your bookings section

#### 5. Messaging
- Navigate to `/messages`
- Select a conversation or start a new one
- Send messages to landlords about properties

### For Landlords

#### 1. Sign Up / Login
- Create an account with role "Landlord"
- Or use Google OAuth

#### 2. List a Property
- Go to `/dashboard/landlord`
- Click "Add New Property"
- Fill in property details:
  - Title, description, price
  - Upload images
  - Add address and amenities
  - Select property type
- Submit for admin approval

#### 3. Manage Properties
- View all your properties in the dashboard
- Edit or delete existing listings
- Check property status (pending/approved/rejected)

#### 4. Manage Bookings
- View booking requests in your dashboard
- Accept or reject booking requests
- See booking details and student information

#### 5. Messaging
- Respond to student inquiries
- Use `/messages` to communicate with students

### For Administrators

#### 1. Login
- Use admin credentials (default: admin@unistayconnect.com / admin123)

#### 2. View Dashboard
- Go to `/admin` to see platform statistics
- View total users, properties, and reports

#### 3. Manage Users
- View all registered users
- See user roles and status
- Monitor user activity

#### 4. Manage Properties
- Approve or reject property listings
- View all properties on the platform
- Monitor property status

#### 5. Platform Management
- Review reports and issues
- Manage platform settings
- Monitor overall platform health

---

## 🗄 Database Schema

### Models

#### User
- `id` - Unique identifier
- `name` - User's full name
- `email` - Unique email address
- `passwordHash` - Hashed password (optional for OAuth users)
- `role` - User role (student, landlord, admin)
- `avatar` - Profile picture URL
- `phone` - Phone number (optional)
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

#### Property
- `id` - Unique identifier
- `title` - Property title
- `description` - Detailed description
- `price` - Monthly rent price
- `images` - Array of image URLs
- `address` - Property address
- `amenities` - Array of amenities
- `type` - Property type (studio, shared, apartment, house)
- `status` - Property status (available, rented, pending, rejected)
- `landlordId` - Reference to PropertyLandlord
- `createdAt` - Listing creation timestamp
- `updatedAt` - Last update timestamp

#### Booking
- `id` - Unique identifier
- `studentId` - Reference to User (student)
- `propertyId` - Reference to Property
- `startDate` - Booking start date
- `endDate` - Booking end date
- `status` - Booking status (pending, approved, rejected, cancelled, completed)
- `createdAt` - Booking creation timestamp
- `updatedAt` - Last update timestamp

#### Message
- `id` - Unique identifier
- `senderId` - Reference to User (sender)
- `receiverId` - Reference to User (receiver)
- `content` - Message content
- `timestamp` - Message timestamp

#### Notification
- `id` - Unique identifier
- `userId` - Reference to User
- `type` - Notification type
- `message` - Notification message
- `read` - Read status
- `createdAt` - Notification timestamp

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/unistayconnect?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Generating NextAuth Secret
```bash
openssl rand -base64 32
```

---

## 🧪 Testing the API

### Using cURL

#### Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "student"
  }'
```

#### Get Properties
```bash
curl http://localhost:3000/api/properties?status=available&limit=5
```

#### Create a Booking (with authentication)
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=your-session-token" \
  -d '{
    "propertyId": "property_id",
    "startDate": "2024-02-01T00:00:00Z",
    "endDate": "2024-12-31T00:00:00Z"
  }'
```

### Using Postman
1. Import the API endpoints
2. Set up authentication using NextAuth session cookies
3. Test all endpoints with proper request bodies

---

## 📝 Default Credentials

After running the seed script:

- **Admin**
  - Email: `admin@unistayconnect.com`
  - Password: `admin123`

- **Student**
  - Email: `student1@unistayconnect.com`
  - Password: `student123`

- **Landlord**
  - Email: `landlord1@unistayconnect.com`
  - Password: `landlord123`

---

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check DATABASE_URL format
   - Ensure database exists

2. **Authentication Issues**
   - Clear browser cookies
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches your app URL

3. **API Errors**
   - Check authentication status
   - Verify user role permissions
   - Review server logs for detailed errors

4. **Prisma Issues**
   - Run `npx prisma generate` after schema changes
   - Use `npx prisma studio` to inspect database
   - Run `npx prisma db push` to sync schema

---

## 🏗️ Service Layer Architecture

The application uses a **service layer architecture** to separate business logic by role. See [SERVICES_ARCHITECTURE.md](./SERVICES_ARCHITECTURE.md) for detailed documentation.

### Service Organization
- **Student Services**: Booking and bookmark management
- **Landlord Services**: Property and booking request management
- **Admin Services**: User, property, and platform management
- **Shared Services**: Messaging and public property viewing

### Benefits
- ✅ Clear separation of concerns
- ✅ Reusable business logic
- ✅ Easy to test and maintain
- ✅ Type-safe operations
- ✅ Consistent error handling

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Service Architecture Guide](./SERVICES_ARCHITECTURE.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is private and proprietary.

---

## 📞 Support

For issues or questions, please contact the development team or create an issue in the repository.

---

**Last Updated:** January 2024
**Version:** 1.0.0

