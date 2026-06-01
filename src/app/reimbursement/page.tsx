"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export default function ReimbursementPage() {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    ministry: "",
    expenseDescription: "",
    totalAmount: "",
    notes: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankSortCode: "",
    receipts: [] as File[],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Reimbursement form submitted:", formData)
    alert("Reimbursement form submitted successfully!")
    setFormData({
      name: "",
      date: "",
      ministry: "",
      expenseDescription: "",
      totalAmount: "",
      notes: "",
      bankAccountName: "",
      bankAccountNumber: "",
      bankSortCode: "",
      receipts: [],
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif']
      const maxSize = 10 * 1024 * 1024 // 10MB

      const validFiles = files.filter(file => {
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
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Reimbursement Form</CardTitle>
              <CardDescription>
                Submit your expense reimbursement request for church-related activities
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
                  <Label htmlFor="expenseDescription">Expense Description <span className="text-red-500 text-xs">*required</span></Label>
                  <Textarea
                    id="expenseDescription"
                    placeholder="Describe the expense..."
                    value={formData.expenseDescription}
                    onChange={(e) => setFormData({ ...formData, expenseDescription: e.target.value })}
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
                  <Label htmlFor="bankSortCode">Bank Sort Code <span className="text-red-500 text-xs">*required</span></Label>
                  <Input
                    id="bankSortCode"
                    placeholder="xx-xx-xx"
                    value={formData.bankSortCode}
                    onChange={(e) => setFormData({ ...formData, bankSortCode: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receipts">Receipts/Transaction Screenshots <span className="text-red-500 text-xs">*required</span></Label>
                  <Input
                    id="receipts"
                    type="file"
                    multiple
                    accept=".pdf,.docx,image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif"
                    onChange={handleFileChange}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload PDF, DOCX, or images (JPEG, PNG, GIF, WebP, HEIC). Max file size: 10MB
                  </p>
                </div>

                <Button type="submit" className="w-full">
                  Submit Reimbursement Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
