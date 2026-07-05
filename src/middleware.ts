import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyRelayToken } from "@/lib/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/relay-dashboard")) {
    const token = request.cookies.get("relay_auth_token")?.value;

    if (!token) {
      const loginUrl = new URL("/relay-auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const payload = await verifyRelayToken(token);
      if (payload.role !== "relay_owner") {
        return NextResponse.redirect(new URL("/relay-auth/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/relay-auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/relay-dashboard/:path*"],
};
