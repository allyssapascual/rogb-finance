import Link from "next/link"
import { FileText, ClipboardCheck, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-6 w-6 flex items-center justify-center text-xl font-bold text-primary">£</div>
            <span className="text-xl font-bold">ROGB Finance</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/reimbursement">
              <Button variant="ghost" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Reimbursement
              </Button>
            </Link>
            <Link href="/budget">
              <Button variant="ghost" size="sm">
                <span className="mr-2 h-4 w-4 flex items-center justify-center text-lg font-bold">£</span>
                Budget Proposal
              </Button>
            </Link>
            <Link href="/audit">
              <Button variant="ghost" size="sm">
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Event Audit
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
