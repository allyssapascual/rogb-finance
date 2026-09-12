import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { SESSION_COOKIE } from "@/lib/auth-shared"
import { createServiceClient } from "@/lib/supabase"

function requireMemberOrAdmin() {
  const role = cookies().get(SESSION_COOKIE)?.value
  return role === "member" || role === "admin"
}

function parseAmount(value: unknown) {
  const n = typeof value === "number" ? value : Number(String(value ?? "").replace(/,/g, ""))
  if (!Number.isFinite(n)) return null
  return n
}

function parseInteger(value: unknown) {
  const n = typeof value === "number" ? value : Number(String(value ?? "").replace(/,/g, ""))
  if (!Number.isFinite(n)) return null
  return Math.trunc(n)
}

export async function GET(request: Request) {
  if (!requireMemberOrAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = new URL(request.url).searchParams.get("id")
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data: audit, error } = await supabase.from("event_audits").select("*").eq("id", id).single()

  if (error || !audit) {
    return NextResponse.json({ error: error?.message ?? "Not found" }, { status: 404 })
  }

  const { data: expenses, error: expensesError } = await supabase
    .from("event_audit_expenses")
    .select("id, description, amount, sort_order")
    .eq("event_audit_id", id)
    .order("sort_order", { ascending: true })

  if (expensesError) {
    return NextResponse.json({ error: expensesError.message }, { status: 500 })
  }

  return NextResponse.json({ data: { ...audit, expense_breakdown: expenses ?? [] } })
}

export async function POST(request: Request) {
  if (!requireMemberOrAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const name = String(body.name ?? "").trim()
    const form_date = String(body.date ?? "").trim()
    const ministry = String(body.ministry ?? "").trim()
    const event_name = String(body.eventName ?? "").trim()
    const event_date = String(body.eventDate ?? "").trim()
    const bank_name = String(body.bankName ?? "").trim() || null
    const bank_account_name = String(body.bankAccountName ?? "").trim() || null
    const bank_sort_code = String(body.bankSortCode ?? "").trim() || null
    const collected_per_person = parseAmount(body.collectedPerPerson)
    const people_paid = parseInteger(body.peoplePaid)
    const total_amount_coming = parseAmount(body.totalAmountComing)
    const total_expenses = parseAmount(body.totalExpenses)

    const expensesRaw = Array.isArray(body.expenseBreakdown) ? body.expenseBreakdown : []
    const expenses = expensesRaw
      .map((item: { description?: string; amount?: string | number }, index: number) => {
        const description = String(item?.description ?? "").trim()
        const amount = parseAmount(item?.amount)
        if (!description || amount == null) return null
        return { description, amount, sort_order: index }
      })
      .filter(Boolean) as { description: string; amount: number; sort_order: number }[]

    if (
      !name ||
      !form_date ||
      !ministry ||
      !event_name ||
      !event_date ||
      collected_per_person == null ||
      people_paid == null ||
      total_amount_coming == null ||
      total_expenses == null ||
      expenses.length === 0
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { data: audit, error: auditError } = await supabase
      .from("event_audits")
      .insert({
        name,
        form_date,
        ministry,
        event_name,
        event_date,
        bank_name,
        bank_account_name,
        bank_sort_code,
        collected_per_person,
        people_paid,
        total_amount_coming,
        total_expenses,
      })
      .select("id")
      .single()

    if (auditError || !audit) {
      return NextResponse.json(
        { error: auditError?.message ?? "Failed to create audit" },
        { status: 500 }
      )
    }

    const { error: expensesError } = await supabase.from("event_audit_expenses").insert(
      expenses.map((item) => ({
        event_audit_id: audit.id,
        sort_order: item.sort_order,
        description: item.description,
        amount: item.amount,
      }))
    )

    if (expensesError) {
      await supabase.from("event_audits").delete().eq("id", audit.id)
      return NextResponse.json({ error: expensesError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, id: audit.id })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
