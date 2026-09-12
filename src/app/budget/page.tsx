"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { toDateInputValue, toInputNumber } from "@/lib/form-utils"
import { SubmissionStatusControl } from "@/components/submission-status-control"
import type { SubmissionStatus } from "@/lib/types"

function BudgetForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const submissionId = searchParams.get("id")
  const readOnly = Boolean(submissionId)

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    ministry: "",
    project: "",
    purpose: "",
    eventDate: "",
    totalAmount: "",
    notes: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankSortCode: "",
    receipts: [] as File[],
  })
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(readOnly)
  const [loadError, setLoadError] = useState("")
  const [status, setStatus] = useState<SubmissionStatus>("submitted")

  useEffect(() => {
    if (!submissionId) return

    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`/api/budget?id=${submissionId}`)
        const json = await res.json()
        if (!res.ok) {
          if (!cancelled) setLoadError(json.error ?? "Failed to load submission")
          return
        }
        const row = json.data
        if (!cancelled) {
          setStatus((row.status as SubmissionStatus) ?? "submitted")
          setFormData({
            name: row.name ?? "",
            date: toDateInputValue(row.form_date),
            ministry: row.ministry ?? "",
            project: row.project ?? "",
            purpose: row.purpose ?? "",
            eventDate: toDateInputValue(row.event_date),
            totalAmount: toInputNumber(row.total_amount),
            notes: row.notes ?? "",
            bankAccountName: row.bank_account_name ?? "",
            bankAccountNumber: row.bank_account_number ?? "",
            bankSortCode: row.bank_sort_code ?? "",
            receipts: [],
          })
        }
      } catch {
        if (!cancelled) setLoadError("Failed to load submission")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [submissionId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (readOnly) return
    setSubmitting(true)

    try {
      const res = await fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          date: formData.date,
          ministry: formData.ministry,
          project: formData.project,
          purpose: formData.purpose,
          eventDate: formData.eventDate,
          totalAmount: formData.totalAmount,
          notes: formData.notes,
          bankAccountName: formData.bankAccountName,
          bankAccountNumber: formData.bankAccountNumber,
          bankSortCode: formData.bankSortCode,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        alert(data.error ?? "Failed to submit budget proposal")
        return
      }

      alert("Budget proposal submitted successfully!")
      setFormData({
        name: "",
        date: "",
        ministry: "",
        project: "",
        purpose: "",
        eventDate: "",
        totalAmount: "",
        notes: "",
        bankAccountName: "",
        bankAccountNumber: "",
        bankSortCode: "",
        receipts: [],
      })
      router.push("/")
    } catch {
      alert("Failed to submit budget proposal")
    } finally {
      setSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly || !e.target.files) return
    const files = Array.from(e.target.files)
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/heic",
      "image/heif",
    ]
    const maxSize = 10 * 1024 * 1024

    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(`File "${file.name}" is not allowed. Please upload PDF, DOCX, or images only.`)
        return false
      }
      if (file.size > maxSize) {
        alert(`File "${file.name}" is too large. Maximum file size is 10MB.`)
        return false
      }
      return true
    })

    setFormData({ ...formData, receipts: validFiles })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation role={readOnly ? "admin" : "member"} />
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Budget Proposal</CardTitle>
              <CardDescription>
                {readOnly
                  ? "Review this submission and update its status."
                  : "Submit a budget proposal for an upcoming church event or program"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading submission…</p>
              ) : loadError ? (
                <p className="text-red-500">{loadError}</p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {readOnly && submissionId ? (
                    <SubmissionStatusControl
                      id={submissionId}
                      type="budget"
                      initialStatus={status}
                    />
                  ) : null}

                  <fieldset disabled={readOnly} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Name {!readOnly && <span className="text-red-500 text-xs">*required</span>}
                      </Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">
                        Date {!readOnly && <span className="text-red-500 text-xs">*required</span>}
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ministry">
                        Ministry {!readOnly && <span className="text-red-500 text-xs">*required</span>}
                      </Label>
                      <Select
                        value={formData.ministry}
                        onValueChange={(value) => setFormData({ ...formData, ministry: value })}
                        required
                        disabled={readOnly}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ministry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="celebratory events">Celebratory Events</SelectItem>
                          <SelectItem value="creative arts">Creative Arts</SelectItem>
                          <SelectItem value="events">Events</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="intercession">Intercession</SelectItem>
                          <SelectItem value="kitchen">Kitchen</SelectItem>
                          <SelectItem value="media">Media</SelectItem>
                          <SelectItem value="misc">Misc</SelectItem>
                          <SelectItem value="pastors">Pastors</SelectItem>
                          <SelectItem value="trustees">Trustees</SelectItem>
                          <SelectItem value="ushering">Ushering</SelectItem>
                          <SelectItem value="worship">Worship</SelectItem>
                          <SelectItem value="young alpha">Young Alpha</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="project">
                        Event Name {!readOnly && <span className="text-red-500 text-xs">*required</span>}
                      </Label>
                      <Input
                        id="project"
                        placeholder="Summer Youth Camp 2024"
                        value={formData.project}
                        onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="purpose">
                        Purpose {!readOnly && <span className="text-red-500 text-xs">*required</span>}
                      </Label>
                      <Textarea
                        id="purpose"
                        placeholder="Describe the purpose of this budget proposal..."
                        value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="eventDate">
                        Event Date {!readOnly && <span className="text-red-500 text-xs">*required</span>}
                      </Label>
                      <Input
                        id="eventDate"
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="totalAmount">
                        Total Amount (£){" "}
                        {!readOnly && <span className="text-red-500 text-xs">*required</span>}
                      </Label>
                      <Input
                        id="totalAmount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={formData.totalAmount}
                        onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Additional notes..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      />
                    </div>

                    <div className="space-y-4 border-t pt-6">
                      <div>
                        <p className="text-sm font-medium">Bank details</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          If this is your first time making a submission, please add your bank
                          details so we can pay you.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bankAccountName">Bank Account Name</Label>
                        <Input
                          id="bankAccountName"
                          placeholder="Account holder name"
                          value={formData.bankAccountName}
                          onChange={(e) =>
                            setFormData({ ...formData, bankAccountName: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
                        <Input
                          id="bankAccountNumber"
                          placeholder="Account number"
                          value={formData.bankAccountNumber}
                          onChange={(e) =>
                            setFormData({ ...formData, bankAccountNumber: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bankSortCode">Bank Sort Code</Label>
                        <Input
                          id="bankSortCode"
                          placeholder="xx-xx-xx"
                          value={formData.bankSortCode}
                          onChange={(e) => setFormData({ ...formData, bankSortCode: e.target.value })}
                        />
                      </div>
                    </div>

                    {!readOnly ? (
                      <div className="space-y-2">
                        <Label htmlFor="receipts">Receipts/Transaction Screenshots</Label>
                        <Input
                          id="receipts"
                          type="file"
                          multiple
                          accept=".pdf,.docx,image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif"
                          onChange={handleFileChange}
                        />
                        <p className="text-sm text-muted-foreground">
                          File upload to Drive comes next — form details are saved to the database now.
                        </p>
                      </div>
                    ) : null}
                  </fieldset>

                  {readOnly ? (
                    <Link href="/admin/proposals">
                      <Button type="button" variant="outline" className="w-full">
                        Back to proposals
                      </Button>
                    </Link>
                  ) : (
                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? "Submitting…" : "Submit Budget Proposal"}
                    </Button>
                  )}
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function BudgetPage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">Loading…</div>}>
      <BudgetForm />
    </Suspense>
  )
}
