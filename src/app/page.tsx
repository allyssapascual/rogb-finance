import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ClipboardCheck, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">ROGB Finance</h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Church Finance Management System
          </p>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Submit reimbursement forms, budget proposals, and event audits
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Reimbursement</CardTitle>
              <CardDescription>
                Submit expense reimbursement requests for church-related activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/reimbursement">
                <Button className="w-full">
                  Submit Form
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 text-primary mb-2 flex items-center justify-center text-3xl font-bold">£</div>
              <CardTitle>Budget Proposal</CardTitle>
              <CardDescription>
                Submit budget proposals for upcoming church events and programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/budget">
                <Button className="w-full">
                  Submit Proposal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <ClipboardCheck className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Event Audit</CardTitle>
              <CardDescription>
                Submit audit reports for completed church events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/audit">
                <Button className="w-full">
                  Submit Audit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
