"use client"

import * as React from "react"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Building2 } from "lucide-react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Company = {
  id: string
  name: string
  arabicName: string
  logoFile?: File
  equipmentCount?: number
  licenseCount?: number
  softwareCount?: number
}

export default function CompaniesPage() {
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newCompany, setNewCompany] = useState<Company>({ id: "", name: "", arabicName: "" })
  const [logoFile, setLogoFile] = useState<File | undefined>()

  const handleAddCompany = () => {
    const id = `comp-${Date.now()}`
    setCompanies(prev => [...prev, { ...newCompany, id, logoFile, equipmentCount: 0, licenseCount: 0, softwareCount: 0 }])
    setNewCompany({ id: "", name: "", arabicName: "" })
    setLogoFile(undefined)
    setDialogOpen(false)
  }

  const filteredCompanies = companies.filter(
    c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.arabicName.includes(searchQuery)
  )

  return (
    <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />

        <main className="w-full max-w-7xl mx-auto p-6 md:p-10 space-y-8 bg-white-00 dark:bg-zinc-900 transition-colors duration-300">

          {/* العنوان + زر إضافة شركة */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">قائمة الشركات</h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm" className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  إضافة شركة
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>إضافة شركة جديدة</DialogTitle>
                  <DialogDescription>املأ المعلومات الأساسية للشركة.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="name">اسم الشركة (إنجليزي)</Label>
                    <Input
                      id="name"
                      value={newCompany.name}
                      onChange={e => setNewCompany({ ...newCompany, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="arabicName">اسم الشركة (عربي)</Label>
                    <Input
                      id="arabicName"
                      value={newCompany.arabicName}
                      onChange={e => setNewCompany({ ...newCompany, arabicName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="logo">شعار الشركة</Label>
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={e => setLogoFile(e.target.files?.[0])}
                    />
                  </div>
                </div>
                <DialogFooter className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>إلغاء</Button>
                  <Button onClick={handleAddCompany}>إضافة</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* حقل البحث */}
          <Input
            placeholder="بحث سريع..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />

          {/* كروت الشركات */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {filteredCompanies.length > 0 ? filteredCompanies.map(company => (
              <Card
                key={company.id}
                className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
              >
                <CardHeader className="flex flex-col items-center text-center gap-2">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-zinc-700 flex items-center justify-center">
                    {company.logoFile ? (
                      <Image
                        src={URL.createObjectURL(company.logoFile)}
                        alt={company.name}
                        width={96}
                        height={96}
                        className="object-contain"
                      />
                    ) : (
                      <Building2 className="w-12 h-12 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                  <CardTitle className="text-lg font-semibold">{company.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-500 dark:text-gray-400">{company.arabicName}</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col items-center gap-3 mt-2">
                  <div className="flex gap-2">
                    <Badge variant="secondary">المعدات: {company.equipmentCount}</Badge>
                    <Badge variant="secondary">التراخيص: {company.licenseCount}</Badge>
                    <Badge variant="secondary">البرامج: {company.softwareCount}</Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => router.push(`/companies/${company.id}`)}
                  >
                    تفاصيل
                  </Button>
                </CardContent>
              </Card>
            )) : (
              <p className="col-span-full text-center text-gray-500 dark:text-gray-400 h-24 flex items-center justify-center">
                لا توجد شركات
              </p>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
