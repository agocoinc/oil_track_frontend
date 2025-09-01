"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

import { License } from "@/types/license"

export default function LicensesPage() {
  const [licenses, setLicenses] = React.useState<License[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [selectedLicense, setSelectedLicense] = React.useState<License | null>(null)

  // formData مطابق تمامًا لنوع License
  const [formData, setFormData] = React.useState<License>({
    id: "",
    name: "",
    code: "",
    type: "سوفتوير",
    status: "active",
    issueDate: "",
    expiryDate: "",
    issuer: "",
    notes: ""
  })

  const handleAdd = () => {
    setSelectedLicense(null)
    setFormData({
      id: "",
      name: "",
      code: "",
      type: "سوفتوير",
      status: "active",
      issueDate: "",
      expiryDate: "",
      issuer: "",
      notes: ""
    })
    setDialogOpen(true)
  }

  const handleEdit = (license: License) => {
    setSelectedLicense(license)
    setFormData({ ...license })
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setLicenses(prev => prev.filter(l => l.id !== id))
  }

  const handleSave = () => {
    if (!formData.name || !formData.code) return

    const newLicense: License = selectedLicense
      ? { ...selectedLicense, ...formData }
      : { ...formData, id: `lic-${Date.now()}` }

    setLicenses(prev => {
      const exists = prev.find(l => l.id === newLicense.id)
      if (exists) return prev.map(l => l.id === newLicense.id ? newLicense : l)
      return [...prev, newLicense]
    })
    setDialogOpen(false)
    setSelectedLicense(null)
  }

  const filteredLicenses = licenses.filter(
    l => l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         l.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-6 gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">قائمة التراخيص</h1>
            <Button onClick={handleAdd}>إضافة ترخيص</Button>
          </div>

          <Input
            placeholder="بحث سريع..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filteredLicenses.length > 0 ? filteredLicenses.map(license => (
              <Card key={license.id} className="rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle>{license.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Code: {license.code}</p>
                  <p>Type: {license.type}</p>
                  <p>Status: {license.status === "active" ? "نشط" : license.status === "expired" ? "منتهي" : "قيد التجديد"}</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(license)}>تعديل</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(license.id)}>حذف</Button>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <p className="text-center col-span-full py-10">لا توجد تراخيص</p>
            )}
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-lg w-full">
              <DialogHeader>
                <DialogTitle>{selectedLicense ? "تعديل الترخيص" : "إضافة ترخيص جديد"}</DialogTitle>
                <DialogDescription>املأ البيانات الأساسية للترخيص.</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="basic" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">أساسية</TabsTrigger>
                  <TabsTrigger value="dates">تواريخ</TabsTrigger>
                  <TabsTrigger value="notes">ملاحظات</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="mt-4 flex flex-col gap-4">
                  <div>
                    <Label htmlFor="name">اسم الترخيص</Label>
                    <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <Label htmlFor="code">كود الترخيص</Label>
                    <Input id="code" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
                  </div>
                  <div>
                    <Label htmlFor="type">نوع الترخيص</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="هاردوير">هاردوير</SelectItem>
                        <SelectItem value="سوفتوير">سوفتوير</SelectItem>
                        <SelectItem value="خدمات">خدمات</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">الحالة</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">نشط</SelectItem>
                        <SelectItem value="expired">منتهي</SelectItem>
                        <SelectItem value="inactive">قيد التجديد</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="dates" className="mt-4 flex flex-col gap-4">
                  <div>
                    <Label htmlFor="issueDate">تاريخ الإصدار</Label>
                    <Input id="issueDate" type="date" value={formData.issueDate} onChange={e => setFormData({...formData, issueDate: e.target.value})} />
                  </div>
                  <div>
                    <Label htmlFor="expiryDate">تاريخ الانتهاء</Label>
                    <Input id="expiryDate" type="date" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
                  </div>
                  <div>
                    <Label htmlFor="issuer">الجهة المصدرة</Label>
                    <Input id="issuer" value={formData.issuer} onChange={e => setFormData({...formData, issuer: e.target.value})} />
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="mt-4 flex flex-col gap-4">
                  <div>
                    <Label htmlFor="notes">ملاحظات</Label>
                    <Input id="notes" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>إلغاء</Button>
                <Button onClick={handleSave}>{selectedLicense ? "حفظ التعديل" : "إضافة"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
