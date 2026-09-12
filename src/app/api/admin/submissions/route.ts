import { createServiceClient } from "@/lib/supabase"
import type { SubmissionListItem, SubmissionStatus } from "@/lib/types"
import { NextResponse } from "next/server"

const VALID_TYPES = new Set(["reimbursement", "budget", "audit"])

export async function GET(request: Request) {
  try {
    const type = new URL(request.url).searchParams.get("type")
    if (!type || !VALID_TYPES.has(type)) {
      return NextResponse.json(
        { error: "Query type must be reimbursement, budget, or audit" },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    if (type === "reimbursement") {
      const { data, error } = await supabase
        .from("reimbursements")
        .select("id, name, expense_description, total_amount, status, created_at")
        .order("created_at", { ascending: false })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      const items: SubmissionListItem[] = (data ?? []).map((row) => ({
        id: row.id,
        type: "reimbursement",
        name: row.name,
        title: row.expense_description,
        amount: row.total_amount,
        status: row.status as SubmissionStatus,
        created_at: row.created_at,
      }))

      return NextResponse.json({ items })
    }

    if (type === "budget") {
      const { data, error } = await supabase
        .from("budget_proposals")
        .select("id, name, project, total_amount, status, created_at")
        .order("created_at", { ascending: false })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      const items: SubmissionListItem[] = (data ?? []).map((row) => ({
        id: row.id,
        type: "budget",
        name: row.name,
        title: row.project,
        amount: row.total_amount,
        status: row.status as SubmissionStatus,
        created_at: row.created_at,
      }))

      return NextResponse.json({ items })
    }

    const { data, error } = await supabase
      .from("event_audits")
      .select("id, name, event_name, total_expenses, status, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const items: SubmissionListItem[] = (data ?? []).map((row) => ({
      id: row.id,
      type: "audit",
      name: row.name,
      title: row.event_name,
      amount: row.total_expenses,
      status: row.status as SubmissionStatus,
      created_at: row.created_at,
    }))

    return NextResponse.json({ items })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
