import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { SESSION_COOKIE } from "@/lib/auth-shared"
import { createServiceClient } from "@/lib/supabase"
import {
  SUBMISSION_STATUSES,
  tableForType,
  type SubmissionStatus,
  type SubmissionType,
} from "@/lib/types"

const VALID_TYPES = new Set<SubmissionType>(["reimbursement", "budget", "audit"])

export async function PATCH(request: Request) {
  const role = cookies().get(SESSION_COOKIE)?.value
  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const id = String(body.id ?? "").trim()
    const type = body.type as SubmissionType
    const status = body.status as SubmissionStatus

    if (!id || !VALID_TYPES.has(type) || !SUBMISSION_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid id, type, or status" }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from(tableForType(type))
      .update({ status })
      .eq("id", id)
      .select("id, status")
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
