import { Navigation } from "@/components/navigation"
import { getSessionRole } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const role = await getSessionRole()
  if (role !== "admin") {
    redirect("/")
  }
  redirect("/admin/reimbursements")
}
