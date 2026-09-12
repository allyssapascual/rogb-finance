import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SESSION_COOKIE } from "@/lib/auth-shared"

export function middleware(request: NextRequest) {
  const role = request.cookies.get(SESSION_COOKIE)?.value
  const { pathname } = request.nextUrl

  const isFormRoute =
    pathname.startsWith("/reimbursement") ||
    pathname.startsWith("/budget") ||
    pathname.startsWith("/audit")

  const isSubmitApi =
    pathname === "/api/reimbursement" ||
    pathname === "/api/budget" ||
    pathname === "/api/audit"

  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/api/admin")

  if (isFormRoute || isSubmitApi) {
    if (role !== "member" && role !== "admin") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  if (isAdminRoute) {
    if (role !== "admin") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/reimbursement/:path*",
    "/budget/:path*",
    "/audit/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/reimbursement",
    "/api/budget",
    "/api/audit",
  ],
}
