"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FileText, ClipboardCheck, Home, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Role } from "@/lib/auth-shared"

export function Navigation({ role }: { role: Role | null }) {
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
    router.refresh()
  }

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            href={role === "admin" ? "/admin/reimbursements" : "/"}
            className="flex items-center space-x-2"
          >
            <div className="h-6 w-6 flex items-center justify-center text-xl font-bold text-primary">
              £
            </div>
            <span className="text-lg sm:text-xl font-bold">ROGB Finance</span>
          </Link>
          <div className="flex items-center space-x-1 sm:space-x-4">
            {role === "member" ? (
              <>
                <Link href="/">
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Button>
                  <Button variant="ghost" size="sm" className="sm:hidden">
                    <Home className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/reimbursement">
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    <FileText className="mr-2 h-4 w-4" />
                    Reimbursement
                  </Button>
                  <Button variant="ghost" size="sm" className="sm:hidden">
                    <FileText className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/budget">
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    <span className="mr-2 h-4 w-4 flex items-center justify-center text-lg font-bold">
                      £
                    </span>
                    Budget Proposal
                  </Button>
                  <Button variant="ghost" size="sm" className="sm:hidden">
                    <span className="h-4 w-4 flex items-center justify-center text-lg font-bold">
                      £
                    </span>
                  </Button>
                </Link>
                <Link href="/audit">
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Event Audit
                  </Button>
                  <Button variant="ghost" size="sm" className="sm:hidden">
                    <ClipboardCheck className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            ) : null}

            {role === "admin" ? (
              <>
                <Link href="/admin/reimbursements">
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    <FileText className="mr-2 h-4 w-4" />
                    Reimbursements
                  </Button>
                  <Button variant="ghost" size="sm" className="sm:hidden">
                    <FileText className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/admin/proposals">
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    <span className="mr-2 h-4 w-4 flex items-center justify-center text-lg font-bold">
                      £
                    </span>
                    Proposals
                  </Button>
                  <Button variant="ghost" size="sm" className="sm:hidden">
                    <span className="h-4 w-4 flex items-center justify-center text-lg font-bold">
                      £
                    </span>
                  </Button>
                </Link>
                <Link href="/admin/audits">
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Audits
                  </Button>
                  <Button variant="ghost" size="sm" className="sm:hidden">
                    <ClipboardCheck className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            ) : null}

            {role ? (
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Log out</span>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  )
}
