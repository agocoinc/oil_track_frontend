"use client"

import * as React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Card, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Image from "next/image"
import { Building, HardDrive, ScrollText, Code, Plus, ArrowUpToLine } from "lucide-react"

const companySchema = z.object({
  nameAr: z.string().min(2, "مطلوب"),
  nameEn: z.string().min(2, "مطلوب"),
  logo: z.instanceof(File).optional(),
})

const itemSchema = z.object({
  companyId: z.string().min(1, "اختر الشركة"),
  name: z.string().min(2, "مطلوب"),
})

type Company = { id: string; nameAr: string; nameEn: string; logo?: string }

function ItemForm({ endpoint, title, companies }: { endpoint: string; title: string; companies: Company[] }) {
  const form = useForm<z.infer<typeof itemSchema>>({ resolver: zodResolver(itemSchema) })

  const onSubmit = async (data: z.infer<typeof itemSchema>) => {
    const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
    if (res.ok) toast.success(`${title} تمت إضافتها بنجاح`)
    else toast.error("حدث خطأ أثناء الإضافة")
    form.reset()
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
      <div className="grid gap-3">
        <Label htmlFor={`${title}-company`} className="text-gray-700 dark:text-gray-300">اختر الشركة</Label>
        <Select onValueChange={(val) => form.setValue("companyId", val)}>
          <SelectTrigger className="w-full h-12 rounded-lg">
            <SelectValue placeholder="اختر الشركة" />
          </SelectTrigger>
          <SelectContent>
            {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.nameAr} ({c.nameEn})</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-3">
        <Label htmlFor={`${title}-name`} className="text-gray-700 dark:text-gray-300">اسم {title}</Label>
        <Input id={`${title}-name`} placeholder={`اسم ${title}`} className="h-12 rounded-lg" {...form.register("name")} />
      </div>
      <div className="flex justify-end">
        <Button type="submit" size="lg" className="h-12 rounded-lg px-8 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
          <Plus className="w-5 h-5 ml-2" />
          إضافة
        </Button>
      </div>
    </form>
  )
}

export default function DashboardPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [previewLogo, setPreviewLogo] = useState<string | null>(null)
  const companyForm = useForm<z.infer<typeof companySchema>>({ resolver: zodResolver(companySchema) })

  React.useEffect(() => { fetch("/api/companies").then(r => r.json()).then(setCompanies) }, [])

  const onAddCompany = async (data: z.infer<typeof companySchema>) => {
    const formData = new FormData()
    formData.append("nameAr", data.nameAr)
    formData.append("nameEn", data.nameEn)
    if (data.logo) formData.append("logo", data.logo)

    const res = await fetch("/api/companies", { method: "POST", body: formData })
    if (res.ok) {
      toast.success("تمت إضافة الشركة بنجاح")
      companyForm.reset()
      setPreviewLogo(null)
      const updated = await fetch("/api/companies").then(r => r.json())
      setCompanies(updated)
    } else toast.error("حدث خطأ أثناء الإضافة")
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col px-6 py-8 space-y-8 bg-gray-100 dark:bg-gray-950">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 dark:text-gray-100">إدارة الشركات والمعدات</h2>

          <Card className="max-w-5xl mx-auto shadow-2xl rounded-2xl p-8 space-y-8 bg-white dark:bg-gray-800 transition-all duration-300">
            <Tabs defaultValue="companies" className="w-full">
              <TabsList className="mb-6 h-12 bg-gray-200 dark:bg-gray-700">
                <TabsTrigger value="companies" className="h-full px-6 text-base font-medium rounded-lg flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
                  <Building className="w-5 h-5" /> الشركات
                </TabsTrigger>
                <TabsTrigger value="equipment" className="h-full px-6 text-base font-medium rounded-lg flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
                  <HardDrive className="w-5 h-5" /> المعدات
                </TabsTrigger>
                <TabsTrigger value="licenses" className="h-full px-6 text-base font-medium rounded-lg flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
                  <ScrollText className="w-5 h-5" /> التراخيص
                </TabsTrigger>
                <TabsTrigger value="software" className="h-full px-6 text-base font-medium rounded-lg flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
                  <Code className="w-5 h-5" /> البرامج
                </TabsTrigger>
              </TabsList>

              <TabsContent value="companies">
                <form onSubmit={companyForm.handleSubmit(onAddCompany)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="nameAr" className="text-gray-700 dark:text-gray-300">اسم الشركة بالعربية</Label>
                      <Input id="nameAr" placeholder="اسم الشركة بالعربية" className="h-12 rounded-lg" {...companyForm.register("nameAr")} />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="nameEn" className="text-gray-700 dark:text-gray-300">اسم الشركة بالإنجليزية</Label>
                      <Input id="nameEn" placeholder="Enter company name in English" className="h-12 rounded-lg" {...companyForm.register("nameEn")} />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <label htmlFor="logo" className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-base text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors">
                      <ArrowUpToLine className="w-5 h-5" /> رفع الشعار
                    </label>
                    <input id="logo" type="file" accept="image/*" className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) { companyForm.setValue("logo", file); setPreviewLogo(URL.createObjectURL(file)) }
                      }}
                    />
                    <Button type="submit" size="lg" className="h-12 rounded-lg text-lg px-8 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                      <Plus className="w-5 h-5 ml-2" /> إضافة الشركة
                    </Button>
                  </div>
                </form>

                {previewLogo && (
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-center mb-4 text-gray-800 dark:text-gray-200">معاينة الشعار</h4>
                    <div className="w-32 h-32 relative border-4 border-gray-300 dark:border-gray-600 rounded-full overflow-hidden mx-auto shadow-md">
                      <Image src={previewLogo} alt="Preview Logo" fill className="object-contain" />
                    </div>
                  </div>
                )}

                <div className="mt-10">
                  <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">الشركات المضافة</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {companies.map(c => (
                      <Card key={c.id} className="flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 dark:bg-gray-700">
                        {c.logo && (
                          <div className="relative w-28 h-28 mb-4 rounded-full border-4 border-gray-200 dark:border-gray-600 overflow-hidden">
                            <Image src={`/images/${c.logo}`} alt={`${c.nameAr} logo`} fill className="object-contain" />
                          </div>
                        )}
                        <CardTitle className="text-center text-xl font-bold text-gray-800 dark:text-gray-200">{c.nameAr}</CardTitle>
                        <CardContent className="text-center text-gray-600 dark:text-gray-400 mt-1">{c.nameEn}</CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="equipment"><ItemForm endpoint="/api/equipment" title="معدة" companies={companies} /></TabsContent>
              <TabsContent value="licenses"><ItemForm endpoint="/api/licenses" title="ترخيص" companies={companies} /></TabsContent>
              <TabsContent value="software"><ItemForm endpoint="/api/software" title="برنامج" companies={companies} /></TabsContent>
            </Tabs>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
