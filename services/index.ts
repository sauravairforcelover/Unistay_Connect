/**
 * Service layer exports
 * Organized by role and shared services
 */

// Student services
export { StudentBookingService } from "./student/bookingService";
export { StudentBookmarkService } from "./student/bookmarkService";

// Landlord services
export { LandlordPropertyService } from "./landlord/propertyService";
export { LandlordBookingService } from "./landlord/bookingService";

// Admin services
export { AdminUserService } from "./admin/userService";
export { AdminPropertyService } from "./admin/propertyService";
export { AdminStatsService } from "./admin/statsService";

// Shared services
export { MessageService } from "./shared/messageService";
export { SharedPropertyService } from "./shared/propertyService";

