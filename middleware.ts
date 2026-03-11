import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin routes
    if (path.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Landlord routes
    if (path.startsWith("/dashboard/landlord") && token?.role !== "landlord") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Student routes
    if (path.startsWith("/dashboard/student") && token?.role !== "student") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Public routes
        if (
          path === "/" ||
          path.startsWith("/properties") ||
          path.startsWith("/about") ||
          path.startsWith("/auth")
        ) {
          return true;
        }

        // Protected routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/messages/:path*",
  ],
};

