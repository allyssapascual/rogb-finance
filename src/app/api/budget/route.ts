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

export async function GET(request: Request) {
  if (!requireMemberOrAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = new URL(request.url).searchParams.get("id")
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase.from("budget_proposals").select("*").eq("id", id).single()

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Not found" }, { status: 404 })
  }

  return NextResponse.json({ data })
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
    const project = String(body.project ?? "").trim()
    const purpose = String(body.purpose ?? "").trim()
    const event_date = String(body.eventDate ?? "").trim()
    const total_amount = parseAmount(body.totalAmount)
    const notes = String(body.notes ?? "").trim() || null
    const bank_account_name = String(body.bankAccountName ?? "").trim() || null
    const bank_account_number = String(body.bankAccountNumber ?? "").trim() || null
    const bank_sort_code = String(body.bankSortCode ?? "").trim() || null

    if (
      !name ||
      !form_date ||
      !ministry ||
      !project ||
      !purpose ||
      !event_date ||
      total_amount == null
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from("budget_proposals")
      .insert({
        name,
        form_date,
        ministry,
        project,
        purpose,
        event_date,
        total_amount,
        notes,
        bank_account_name,
        bank_account_number,
        bank_sort_code,
      })
      .select("id")
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, id: data.id })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
