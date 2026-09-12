import { cookies } from "next/headers"
import { SESSION_COOKIE, type Role } from "@/lib/auth-shared"

export type { Role }
export { SESSION_COOKIE, resolveRoleFromPassword, getMemberPassword, getAdminPassword } from "@/lib/auth-shared"

export async function getSessionRole(): Promise<Role | null> {
  const value = cookies().get(SESSION_COOKIE)?.value
  if (value === "member" || value === "admin") return value
  return null
}
