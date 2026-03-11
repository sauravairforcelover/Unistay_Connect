# Services Architecture

## Overview

The application uses a **service layer architecture** to separate business logic from API routes. This improves code organization, maintainability, and testability.

## Directory Structure

```
services/
├── student/
│   ├── bookingService.ts    # Student booking operations
│   └── bookmarkService.ts    # Student bookmark operations
├── landlord/
│   ├── propertyService.ts   # Landlord property management
│   └── bookingService.ts     # Landlord booking management
├── admin/
│   ├── userService.ts        # Admin user management
│   ├── propertyService.ts    # Admin property management
│   └── statsService.ts       # Admin statistics
├── shared/
│   ├── messageService.ts     # Messaging (all roles)
│   └── propertyService.ts    # Public property viewing
└── index.ts                  # Service exports
```

## Service Organization

### Student Services (`services/student/`)

#### `StudentBookingService`
- `getStudentBookings(studentId)` - Get all bookings for a student
- `createBooking(studentId, propertyId, startDate, endDate)` - Create booking request
- `cancelBooking(bookingId, studentId)` - Cancel a booking
- `getBookingById(bookingId, studentId)` - Get single booking

#### `StudentBookmarkService`
- `getStudentBookmarks(studentId)` - Get all bookmarks
- `addBookmark(studentId, propertyId)` - Add property to bookmarks
- `removeBookmark(studentId, propertyId)` - Remove bookmark
- `isBookmarked(studentId, propertyId)` - Check if bookmarked

### Landlord Services (`services/landlord/`)

#### `LandlordPropertyService`
- `getLandlordProperties(landlordUserId)` - Get all landlord properties
- `createProperty(landlordUserId, data)` - Create new property
- `updateProperty(propertyId, landlordUserId, data)` - Update property
- `deleteProperty(propertyId, landlordUserId)` - Delete property
- `getPropertyById(propertyId, landlordUserId)` - Get single property

#### `LandlordBookingService`
- `getLandlordBookings(landlordUserId)` - Get all booking requests
- `updateBookingStatus(bookingId, landlordUserId, status)` - Approve/reject booking
- `getBookingStats(landlordUserId)` - Get booking statistics

### Admin Services (`services/admin/`)

#### `AdminUserService`
- `getAllUsers()` - Get all users
- `getUserById(userId)` - Get user details
- `updateUserRole(userId, newRole)` - Update user role
- `deleteUser(userId)` - Delete user
- `getUserStats()` - Get user statistics

#### `AdminPropertyService`
- `getAllProperties()` - Get all properties
- `updatePropertyStatus(propertyId, status)` - Approve/reject property
- `deleteProperty(propertyId)` - Delete property
- `getPropertyStats()` - Get property statistics

#### `AdminStatsService`
- `getPlatformStats()` - Get comprehensive platform statistics

### Shared Services (`services/shared/`)

#### `MessageService`
- `getConversations(userId)` - Get all conversations
- `getMessages(userId, receiverId)` - Get messages between users
- `sendMessage(senderId, receiverId, content)` - Send a message

#### `SharedPropertyService`
- `getProperties(filters)` - Get properties with filters (public)
- `getPropertyById(propertyId)` - Get single property (public)

## Usage in API Routes

### Example: Student Booking API

**Before (without services):**
```typescript
// app/api/bookings/route.ts
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const bookings = await prisma.booking.findMany({
    where: { studentId: session.user.id },
    // ... complex query logic
  });
  return NextResponse.json(bookings);
}
```

**After (with services):**
```typescript
// app/api/bookings/route.ts
import { StudentBookingService } from "@/services";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const bookings = await StudentBookingService.getStudentBookings(session.user.id);
  return NextResponse.json(bookings);
}
```

## Benefits

### 1. **Separation of Concerns**
- API routes handle HTTP requests/responses
- Services contain business logic
- Database queries are centralized

### 2. **Reusability**
- Services can be used in API routes, server actions, or other services
- Business logic is not tied to HTTP layer

### 3. **Testability**
- Services can be unit tested independently
- Mock services for testing API routes

### 4. **Maintainability**
- Clear organization by role
- Easy to find and update business logic
- Consistent error handling

### 5. **Type Safety**
- TypeScript interfaces for all service methods
- Compile-time type checking

## Service Patterns

### Error Handling
Services throw errors with descriptive messages:
```typescript
if (!property) {
  throw new Error("Property not found");
}
```

API routes catch and format errors:
```typescript
try {
  const result = await Service.method();
  return NextResponse.json(result);
} catch (error: any) {
  return NextResponse.json(
    { error: error.message || "Failed" },
    { status: 500 }
  );
}
```

### Authorization
Services validate ownership/authorization:
```typescript
if (property.landlordId !== landlord.id) {
  throw new Error("Unauthorized: Property does not belong to this landlord");
}
```

### Data Validation
Services validate input data:
```typescript
if (!title || !description || !price) {
  throw new Error("Missing required fields");
}
```

## Adding New Services

1. Create service file in appropriate directory:
   - `services/student/` for student operations
   - `services/landlord/` for landlord operations
   - `services/admin/` for admin operations
   - `services/shared/` for shared operations

2. Export service class:
```typescript
export class MyService {
  static async myMethod(param: string) {
    // Business logic here
  }
}
```

3. Export from `services/index.ts`:
```typescript
export { MyService } from "./myService";
```

4. Use in API routes:
```typescript
import { MyService } from "@/services";

const result = await MyService.myMethod(param);
```

## Service Responsibilities

### ✅ Services Should:
- Contain business logic
- Handle database operations
- Validate data
- Check authorization
- Throw descriptive errors

### ❌ Services Should NOT:
- Handle HTTP requests/responses
- Parse query parameters
- Return NextResponse objects
- Handle authentication (that's done in API routes)

## Migration Guide

All existing API routes have been migrated to use services. The migration pattern:

1. **Extract business logic** from API route to service
2. **Update API route** to call service method
3. **Handle errors** in API route
4. **Test** both service and API route

## File Reference

- **Student Services**: `services/student/*`
- **Landlord Services**: `services/landlord/*`
- **Admin Services**: `services/admin/*`
- **Shared Services**: `services/shared/*`
- **Service Exports**: `services/index.ts`

---

**Last Updated:** January 2024

