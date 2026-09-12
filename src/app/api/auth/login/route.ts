import { NextResponse } from "next/server"
import { resolveRoleFromPassword, SESSION_COOKIE } from "@/lib/auth-shared"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const password = typeof body?.password === "string" ? body.password : ""

  const role = resolveRoleFromPassword(password)
  if (!role) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 })
  }

  const response = NextResponse.json({
    role,
    redirectTo: role === "admin" ? "/admin/reimbursements" : "/",
  })
  response.cookies.set(SESSION_COOKIE, role, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
  return response
}
