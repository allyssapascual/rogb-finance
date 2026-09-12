"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  STATUS_LABELS,
  SUBMISSION_STATUSES,
  type SubmissionStatus,
  type SubmissionType,
} from "@/lib/types"

export function SubmissionStatusControl({
  id,
  type,
  initialStatus,
}: {
  id: string
  type: SubmissionType
  initialStatus: SubmissionStatus
}) {
  const [status, setStatus] = useState<SubmissionStatus>(initialStatus)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  async function handleChange(next: string) {
    const nextStatus = next as SubmissionStatus
    if (!SUBMISSION_STATUSES.includes(nextStatus) || nextStatus === status) return

    setSaving(true)
    setMessage("")

    try {
      const res = await fetch("/api/admin/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type, status: nextStatus }),
      })
      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error ?? "Failed to update status")
        return
      }

      setStatus(nextStatus)
      setMessage("Status updated")
    } catch {
      setMessage("Failed to update status")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-2 rounded-md border p-4">
      <Label htmlFor="submission-status">Status</Label>
      <Select value={status} onValueChange={handleChange} disabled={saving}>
        <SelectTrigger id="submission-status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SUBMISSION_STATUSES.map((value) => (
            <SelectItem key={value} value={value}>
              {STATUS_LABELS[value]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {message ? (
        <p className={`text-sm ${message === "Status updated" ? "text-muted-foreground" : "text-red-500"}`}>
          {saving ? "Saving…" : message}
        </p>
      ) : saving ? (
        <p className="text-sm text-muted-foreground">Saving…</p>
      ) : null}
    </div>
  )
}
