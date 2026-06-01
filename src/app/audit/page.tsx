"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

interface ExpenseItem {
  id: string
  description: string
  amount: string
  receipt: File | null
}

export default function AuditPage() {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    ministry: "",
    eventName: "",
    eventDate: "",
    bankName: "",
    bankAccountName: "",
    collectedPerPerson: "",
    peoplePaid: "",
    totalAmountComing: "",
    totalExpenses: "",
    receipts: [] as File[],
  })

  const [expenseBreakdown, setExpenseBreakdown] = useState<ExpenseItem[]>([
    { id: "1", description: "", amount: "", receipt: null }
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Event audit submitted:", { ...formData, expenseBreakdown })
    alert("Event audit submitted successfully!")
    setFormData({
      name: "",
      date: "",
      ministry: "",
      eventName: "",
      eventDate: "",
      bankName: "",
      bankAccountName: "",
      collectedPerPerson: "",
      peoplePaid: "",
      totalAmountComing: "",
      totalExpenses: "",
      receipts: [],
    })
    setExpenseBreakdown([{ id: "1", description: "", amount: "", receipt: null }])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, receipts: Array.from(e.target.files) })
    }
  }

  const addExpenseItem = () => {
    const newItem: ExpenseItem = {
      id: Date.now().toString(),
      description: "",
      amount: "",
      receipt: null,
    }
    setExpenseBreakdown([...expenseBreakdown, newItem])
  }

  const removeExpenseItem = (id: string) => {
    if (expenseBreakdown.length > 1) {
      setExpenseBreakdown(expenseBreakdown.filter(item => item.id !== id))
    }
  }

  const updateExpenseItem = (id: string, field: keyof ExpenseItem, value: string | File | null) => {
    setExpenseBreakdown(expenseBreakdown.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Event Audit</CardTitle>
              <CardDescription>
                Submit an audit report for a completed church event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name <span className="text-red-500 text-xs">*required</span></Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date <span className="text-red-500 text-xs">*required</span></Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ministry">Ministry <span className="text-red-500 text-xs">*required</span></Label>
                  <Select
                    value={formData.ministry}
                    onValueChange={(value) => setFormData({ ...formData, ministry: value })}
                    required
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
                  <Label htmlFor="eventName">Event Name <span className="text-red-500 text-xs">*required</span></Label>
                  <Input
                    id="eventName"
                    placeholder="Summer Youth Camp 2024"
                    value={formData.eventName}
                    onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventDate">Event Date <span className="text-red-500 text-xs">*required</span></Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name <span className="text-red-500 text-xs">*required</span></Label>
                    <Input
                      id="bankName"
                      placeholder="Bank name"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankAccountName">Bank Account Name <span className="text-red-500 text-xs">*required</span></Label>
                    <Input
                      id="bankAccountName"
                      placeholder="Account holder name"
                      value={formData.bankAccountName}
                      onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="collectedPerPerson">Collected Per Person (£) <span className="text-red-500 text-xs">*required</span></Label>
                      <Input
                        id="collectedPerPerson"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={formData.collectedPerPerson}
                        onChange={(e) => setFormData({ ...formData, collectedPerPerson: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="peoplePaid">People Paid <span className="text-red-500 text-xs">*required</span></Label>
                      <Input
                        id="peoplePaid"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={formData.peoplePaid}
                        onChange={(e) => setFormData({ ...formData, peoplePaid: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalAmountComing">Total Amount Coming (£) <span className="text-red-500 text-xs">*required</span></Label>
                      <Input
                        id="totalAmountComing"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={formData.totalAmountComing}
                        onChange={(e) => setFormData({ ...formData, totalAmountComing: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalExpenses">Total Expenses (£) <span className="text-red-500 text-xs">*required</span></Label>
                    <Input
                      id="totalExpenses"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.totalExpenses}
                      onChange={(e) => setFormData({ ...formData, totalExpenses: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Breakdown of Expenses <span className="text-red-500 text-xs">*required</span></Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addExpenseItem}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Expense
                    </Button>
                  </div>

                  {expenseBreakdown.map((item, index) => (
                    <div key={item.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Expense {index + 1}</span>
                        {expenseBreakdown.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExpenseItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`description-${item.id}`}>Description <span className="text-red-500 text-xs">*required</span></Label>
                        <Input
                          id={`description-${item.id}`}
                          placeholder="Expense description"
                          value={item.description}
                          onChange={(e) => updateExpenseItem(item.id, 'description', e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`amount-${item.id}`}>Amount (£) <span className="text-red-500 text-xs">*required</span></Label>
                        <Input
                          id={`amount-${item.id}`}
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={item.amount}
                          onChange={(e) => updateExpenseItem(item.id, 'amount', e.target.value )}
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receipts">Receipts/Transaction Screenshots</Label>
                  <Input
                    id="receipts"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload images of receipts or transaction screenshots
                  </p>
                </div>

                <Button type="submit" className="w-full">
                  Submit Event Audit
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
