import { Navigation } from "@/components/navigation"
import { getSessionRole } from "@/lib/auth"
import { AdminSubmissionsList } from "@/components/admin-submissions-list"
import { redirect } from "next/navigation"

export default async function AdminAuditsPage() {
  const role = await getSessionRole()
  if (role !== "admin") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation role={role} />
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Audits</h1>
          <p className="text-muted-foreground mt-2">Event audit submissions</p>
        </div>
        <AdminSubmissionsList type="audit" />
      </main>
    </div>
  )
}
