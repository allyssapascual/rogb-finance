import { createServiceClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServiceClient()
    const { error, count } = await supabase
      .from("reimbursements")
      .select("*", { count: "exact", head: true })

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, reimbursements: count ?? 0 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
