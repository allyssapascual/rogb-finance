"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export default function BudgetPage() {
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
    receipts: [] as File[],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Budget proposal submitted:", formData)
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
      receipts: [],
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, receipts: Array.from(e.target.files) })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Budget Proposal</CardTitle>
              <CardDescription>
                Submit a budget proposal for an upcoming church event or program
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
                  <Label htmlFor="project">Project (Event Name) <span className="text-red-500 text-xs">*required</span></Label>
                  <Input
                    id="project"
                    placeholder="Summer Youth Camp 2024"
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose <span className="text-red-500 text-xs">*required</span></Label>
                  <Textarea
                    id="purpose"
                    placeholder="Describe the purpose of this budget proposal..."
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
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

                <div className="space-y-2">
                  <Label htmlFor="totalAmount">Total Amount (£) <span className="text-red-500 text-xs">*required</span></Label>
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

                <div className="space-y-2">
                  <Label htmlFor="bankAccountNumber">Bank Account Number <span className="text-red-500 text-xs">*required</span></Label>
                  <Input
                    id="bankAccountNumber"
                    placeholder="Account number"
                    value={formData.bankAccountNumber}
                    onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receipts">Receipts/Transaction Screenshots <span className="text-red-500 text-xs">*required</span></Label>
                  <Input
                    id="receipts"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload images of receipts or transaction screenshots
                  </p>
                </div>

                <Button type="submit" className="w-full">
                  Submit Budget Proposal
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
