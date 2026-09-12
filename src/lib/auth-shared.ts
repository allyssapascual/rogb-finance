export type Role = "member" | "admin"

export const SESSION_COOKIE = "rogb_role"

export function getMemberPassword() {
  return process.env.MEMBER_PASSWORD ?? "rogb"
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "043023"
}

export function resolveRoleFromPassword(password: string): Role | null {
  if (password === getMemberPassword()) return "member"
  if (password === getAdminPassword()) return "admin"
  return null
}
