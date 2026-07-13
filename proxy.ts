import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin API endpoints
  if (pathname.startsWith("/api/admin")) {
    // Bypass auth routes (login / logout)
    if (pathname.startsWith("/api/admin/auth")) {
      return NextResponse.next();
    }

    const token = request.cookies.get("skillistan_session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    return NextResponse.next();
  }

  // Protect secret admin UI pages
  if (pathname.startsWith("/skillistanadminventures")) {
    
    // Bypass auth check for the login page
    if (pathname === "/skillistanadminventures/login") {
      const token = request.cookies.get("skillistan_session")?.value;
      if (token) {
        const payload = await verifyJWT(token);
        if (payload) {
          // Admin is already logged in, send them to the dashboard
          return NextResponse.redirect(new URL("/skillistanadminventures", request.url));
        }
      }
      return NextResponse.next();
    }

    // For all other admin pages, verify the session
    const token = request.cookies.get("skillistan_session")?.value;

    if (!token) {
      return NextResponse.redirect(
        new URL("/skillistanadminventures/login", request.url)
      );
    }

    const payload = await verifyJWT(token);

    if (!payload) {
      // Invalid/expired session cookie, redirect to login page and clear cookie
      const response = NextResponse.redirect(
        new URL("/skillistanadminventures/login", request.url)
      );
      response.cookies.delete("skillistan_session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/skillistanadminventures/:path*",
    "/api/admin/:path*",
  ],
};
