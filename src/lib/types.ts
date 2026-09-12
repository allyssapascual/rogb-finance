export type SubmissionType = "reimbursement" | "budget" | "audit"

export type SubmissionStatus = "submitted" | "reviewed" | "paid" | "filed"

export const SUBMISSION_STATUSES: SubmissionStatus[] = [
  "submitted",
  "reviewed",
  "paid",
  "filed",
]

export const STATUS_LABELS: Record<SubmissionStatus, string> = {
  submitted: "Submitted",
  reviewed: "Reviewed",
  paid: "Paid",
  filed: "Filed",
}

export type SubmissionListItem = {
  id: string
  type: SubmissionType
  name: string
  title: string | null
  amount: number | null
  status: SubmissionStatus
  created_at: string
}

export function submissionHref(item: Pick<SubmissionListItem, "type" | "id">) {
  if (item.type === "reimbursement") return `/reimbursement?id=${item.id}`
  if (item.type === "budget") return `/budget?id=${item.id}`
  return `/audit?id=${item.id}`
}

export function tableForType(type: SubmissionType) {
  if (type === "reimbursement") return "reimbursements"
  if (type === "budget") return "budget_proposals"
  return "event_audits"
}
