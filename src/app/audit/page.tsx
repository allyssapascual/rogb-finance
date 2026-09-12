"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Plus, Trash2 } from "lucide-react"
import { toDateInputValue, toInputNumber } from "@/lib/form-utils"
import { SubmissionStatusControl } from "@/components/submission-status-control"
import type { SubmissionStatus } from "@/lib/types"

interface ExpenseItem {
  id: string
  description: string
  amount: string
  receipt: File | null
}

function AuditForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const submissionId = searchParams.get("id")
  const readOnly = Boolean(submissionId)

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    ministry: "",
    eventName: "",
    eventDate: "",
    bankName: "",
    bankAccountName: "",
    bankSortCode: "",
    collectedPerPerson: "",
    peoplePaid: "",
    totalAmountComing: "",
    totalExpenses: "",
    receipts: [] as File[],
  })

  const [expenseBreakdown, setExpenseBreakdown] = useState<ExpenseItem[]>([
    { id: "1", description: "", amount: "", receipt: null },
  ])
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(readOnly)
  const [loadError, setLoadError] = useState("")
  const [status, setStatus] = useState<SubmissionStatus>("submitted")

  useEffect(() => {
    if (!submissionId) return

    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`/api/audit?id=${submissionId}`)
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
            eventName: row.event_name ?? "",
            eventDate: toDateInputValue(row.event_date),
            bankName: row.bank_name ?? "",
            bankAccountName: row.bank_account_name ?? "",
            bankSortCode: row.bank_sort_code ?? "",
            collectedPerPerson: toInputNumber(row.collected_per_person),
            peoplePaid: toInputNumber(row.people_paid),
            totalAmountComing: toInputNumber(row.total_amount_coming),
            totalExpenses: toInputNumber(row.total_expenses),
            receipts: [],
          })
          const expenses = Array.isArray(row.expense_breakdown) ? row.expense_breakdown : []
          setExpenseBreakdown(
            expenses.length > 0
              ? expenses.map(
                  (
                    item: { id?: string; description?: string; amount?: string | number },
                    index: number
                  ) => ({
                    id: item.id ?? String(index + 1),
                    description: item.description ?? "",
                    amount: toInputNumber(item.amount),
                    receipt: null,
                  })
                )
              : [{ id: "1", description: "", amount: "", receipt: null }]
          )
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
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          date: formData.date,
          ministry: formData.ministry,
          eventName: formData.eventName,
          eventDate: formData.eventDate,
          bankName: formData.bankName,
          bankAccountName: formData.bankAccountName,
          bankSortCode: formData.bankSortCode,
          collectedPerPerson: formData.collectedPerPerson,
          peoplePaid: formData.peoplePaid,
          totalAmountComing: formData.totalAmountComing,
          totalExpenses: formData.totalExpenses,
          expenseBreakdown: expenseBreakdown.map((item) => ({
            description: item.description,
            amount: item.amount,
          })),
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        alert(data.error ?? "Failed to submit event audit")
        return
      }

      alert("Event audit submitted successfully!")
      setFormData({
        name: "",
        date: "",
        ministry: "",
        eventName: "",
        eventDate: "",
        bankName: "",
        bankAccountName: "",
        bankSortCode: "",
        collectedPerPerson: "",
        peoplePaid: "",
        totalAmountComing: "",
        totalExpenses: "",
        receipts: [],
      })
      setExpenseBreakdown([{ id: "1", description: "", amount: "", receipt: null }])
      router.push("/")
    } catch {
      alert("Failed to submit event audit")
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

  const addExpenseItem = () => {
    if (readOnly) return
    setExpenseBreakdown([
      ...expenseBreakdown,
      { id: Date.now().toString(), description: "", amount: "", receipt: null },
    ])
  }

  const removeExpenseItem = (id: string) => {
    if (readOnly || expenseBreakdown.length <= 1) return
    setExpenseBreakdown(expenseBreakdown.filter((item) => item.id !== id))
  }

  const updateExpenseItem = (id: string, field: keyof ExpenseItem, value: string | File | null) => {
    if (readOnly) return
    setExpenseBreakdown(
      expenseBreakdown.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation role={readOnly ? "admin" : "member"} />
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Event Audit</CardTitle>
              <CardDescription>
                {readOnly
                  ? "Review this submission and update its status."
                  : "Submit an audit report for a completed church event"}
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
                      type="audit"
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
                      <Label htmlFor="eventName">
                        Event Name {!readOnly && <span className="text-red-500 text-xs">*required</span>}
                      </Label>
                      <Input
                        id="eventName"
                        placeholder="Summer Youth Camp 2024"
                        value={formData.eventName}
                        onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
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

                    <div className="space-y-4 border-t pt-6">
                      <div>
                        <p className="text-sm font-medium">Bank details</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          If this is your first time making a submission, please add your bank
                          details so we can pay you.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input
                            id="bankName"
                            placeholder="Bank name"
                            value={formData.bankName}
                            onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                          />
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

                    <div className="border-t pt-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="collectedPerPerson">
                            Collected Per Person (£){" "}
                            {!readOnly && <span className="text-red-500 text-xs">*required</span>}
                          </Label>
                          <Input
                            id="collectedPerPerson"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={formData.collectedPerPerson}
                            onChange={(e) =>
                              setFormData({ ...formData, collectedPerPerson: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="peoplePaid">
                            People Paid{" "}
                            {!readOnly && <span className="text-red-500 text-xs">*required</span>}
                          </Label>
                          <Input
                            id="peoplePaid"
                            type="number"
                            min="0"
                            placeholder="0"
                            value={formData.peoplePaid}
                            onChange={(e) =>
                              setFormData({ ...formData, peoplePaid: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="totalAmountComing">
                            Total Amount Coming (£){" "}
                            {!readOnly && <span className="text-red-500 text-xs">*required</span>}
                          </Label>
                          <Input
                            id="totalAmountComing"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={formData.totalAmountComing}
                            onChange={(e) =>
                              setFormData({ ...formData, totalAmountComing: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <div className="space-y-2">
                        <Label htmlFor="totalExpenses">
                          Total Expenses (£){" "}
                          {!readOnly && <span className="text-red-500 text-xs">*required</span>}
                        </Label>
                        <Input
                          id="totalExpenses"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={formData.totalExpenses}
                          onChange={(e) =>
                            setFormData({ ...formData, totalExpenses: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>
                          Breakdown of Expenses{" "}
                          {!readOnly && <span className="text-red-500 text-xs">*required</span>}
                        </Label>
                        {!readOnly ? (
                          <Button type="button" variant="outline" size="sm" onClick={addExpenseItem}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Expense
                          </Button>
                        ) : null}
                      </div>

                      {expenseBreakdown.map((item, index) => (
                        <div key={item.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Expense {index + 1}</span>
                            {!readOnly && expenseBreakdown.length > 1 ? (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeExpenseItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            ) : null}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`description-${item.id}`}>
                              Description{" "}
                              {!readOnly && <span className="text-red-500 text-xs">*required</span>}
                            </Label>
                            <Input
                              id={`description-${item.id}`}
                              placeholder="Expense description"
                              value={item.description}
                              onChange={(e) =>
                                updateExpenseItem(item.id, "description", e.target.value)
                              }
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`amount-${item.id}`}>
                              Amount (£){" "}
                              {!readOnly && <span className="text-red-500 text-xs">*required</span>}
                            </Label>
                            <Input
                              id={`amount-${item.id}`}
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={item.amount}
                              onChange={(e) =>
                                updateExpenseItem(item.id, "amount", e.target.value)
                              }
                              required
                            />
                          </div>
                        </div>
                      ))}
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
                    <Link href="/admin/audits">
                      <Button type="button" variant="outline" className="w-full">
                        Back to audits
                      </Button>
                    </Link>
                  ) : (
                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? "Submitting…" : "Submit Event Audit"}
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

export default function AuditPage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">Loading…</div>}>
      <AuditForm />
    </Suspense>
  )
}
