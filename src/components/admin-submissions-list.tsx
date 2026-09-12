"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { STATUS_LABELS, submissionHref, type SubmissionListItem } from "@/lib/types"

function formatAmount(amount: number | null) {
  if (amount == null) return "—"
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(Number(amount))
}

function formatCreatedAt(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const titleLabels: Record<SubmissionListItem["type"], string> = {
  reimbursement: "Description",
  budget: "Event name",
  audit: "Event name",
}

export function AdminSubmissionsList({ type }: { type: SubmissionListItem["type"] }) {
  const [items, setItems] = useState<SubmissionListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch(`/api/admin/submissions?type=${type}`)
        const data = await res.json()
        if (!res.ok) {
          if (!cancelled) setError(data.error ?? "Failed to load submissions")
          return
        }
        if (!cancelled) setItems(data.items ?? [])
      } catch {
        if (!cancelled) setError("Failed to load submissions")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [type])

  if (loading) {
    return <p className="text-muted-foreground">Loading submissions…</p>
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          No submissions yet.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      <div className="hidden sm:grid sm:grid-cols-12 gap-3 px-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <div className="sm:col-span-3">Created at</div>
        <div className="sm:col-span-2">Name</div>
        <div className="sm:col-span-3">{titleLabels[type]}</div>
        <div className="sm:col-span-2">Status</div>
        <div className="sm:col-span-2 text-right">Total amount</div>
      </div>

      {items.map((item) => (
        <Link key={item.id} href={submissionHref(item)} className="block">
          <Card className="hover:bg-muted/40 transition-colors">
            <CardContent className="py-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 sm:items-center text-sm">
                <div className="sm:col-span-3 text-muted-foreground">
                  <span className="sm:hidden font-medium text-foreground">Created at: </span>
                  {formatCreatedAt(item.created_at)}
                </div>
                <div className="sm:col-span-2 font-medium">
                  <span className="sm:hidden font-medium text-muted-foreground">Name: </span>
                  {item.name}
                </div>
                <div className="sm:col-span-3">
                  <span className="sm:hidden font-medium text-muted-foreground">
                    {titleLabels[type]}:{" "}
                  </span>
                  {item.title || "—"}
                </div>
                <div className="sm:col-span-2 capitalize">
                  <span className="sm:hidden font-medium text-muted-foreground">Status: </span>
                  {STATUS_LABELS[item.status] ?? item.status}
                </div>
                <div className="sm:col-span-2 sm:text-right font-semibold">
                  <span className="sm:hidden font-medium text-muted-foreground">Total: </span>
                  {formatAmount(item.amount)}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
