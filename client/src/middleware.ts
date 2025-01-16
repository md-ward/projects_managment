import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  try {
    const token = request.cookies.get("authToken")?.value;
    if (request.nextUrl.pathname === "/registration") {
      return;
    }
    // Redirect to login if not authenticated
    else {
      if (!token && request.nextUrl.pathname !== "/registration") {
        return NextResponse.redirect(new URL("/registration", request.url));
      }

      // Allow access to all other routes
      return NextResponse.next();
    }
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/registration", request.url));
  }
}

export const config = {
  matcher: ["/"],
};
