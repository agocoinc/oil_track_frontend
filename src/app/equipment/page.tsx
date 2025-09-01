"use client"

import * as React from "react"
import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

// تعريف نوع المعدات
type Equipment = {
  id: string
  name: string
  company: string
  type: "هاردوير" | "سوفتوير"
  status: "نشط" | "صيانة" | "معطل"
  addedDate: string
}

// بيانات وهمية للمعدات
const initialEquipments: Equipment[] = [
  { id: "e1", name: "حاسوب محمول", company: "Horizon Corp", type: "هاردوير", status: "نشط", addedDate: "2025-08-27" },
  { id: "e2", name: "خادم بيانات", company: "Future Builders", type: "هاردوير", status: "صيانة", addedDate: "2025-08-20" },
  { id: "e3", name: "برنامج محاسبة", company: "Horizon Corp", type: "سوفتوير", status: "نشط", addedDate: "2025-08-21" },
  { id: "e4", name: "برنامج إدارة مشاريع", company: "Future Builders", type: "سوفتوير", status: "معطل", addedDate: "2025-08-15" },
]

export default function EquipmentPage() {
  const [equipments, ] = useState<Equipment[]>(initialEquipments)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)

  // قائمة الشركات ديناميكياً
  const companies = Array.from(new Set(equipments.map(e => e.company)))

  // دالة فلترة المعدات
  const filterEquipments = (type: "هاردوير" | "سوفتوير") =>
    equipments.filter(
      e =>
        e.type === type &&
        (!selectedCompany || e.company === selectedCompany) &&
        (e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.company.toLowerCase().includes(searchQuery.toLowerCase()))
    )

  return (
    <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />

        <div className="flex flex-1 flex-col p-6 gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">المعدات</h1>
            <Button>إضافة معدات</Button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Input
              placeholder="بحث سريع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />

            <Select onValueChange={(value) => setSelectedCompany(value)} value={selectedCompany || undefined}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="اختر الشركة" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="هاردوير" className="mt-4">
            <TabsList>
              <TabsTrigger value="هاردوير">هاردوير</TabsTrigger>
              <TabsTrigger value="سوفتوير">سوفتوير</TabsTrigger>
            </TabsList>

            <TabsContent value="هاردوير">
              <Card>
                <CardHeader>
                  <CardTitle>معدات هاردوير</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>المعدة</TableHead>
                        <TableHead>الشركة</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>تاريخ الإضافة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filterEquipments("هاردوير").map(e => (
                        <TableRow key={e.id}>
                          <TableCell>{e.name}</TableCell>
                          <TableCell>{e.company}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              e.status === "نشط" ? "bg-green-100 text-green-800" :
                              e.status === "صيانة" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>{e.status}</span>
                          </TableCell>
                          <TableCell>{e.addedDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="سوفتوير">
              <Card>
                <CardHeader>
                  <CardTitle>معدات سوفتوير</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>المعدة</TableHead>
                        <TableHead>الشركة</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>تاريخ الإضافة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filterEquipments("سوفتوير").map(e => (
                        <TableRow key={e.id}>
                          <TableCell>{e.name}</TableCell>
                          <TableCell>{e.company}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              e.status === "نشط" ? "bg-green-100 text-green-800" :
                              e.status === "صيانة" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>{e.status}</span>
                          </TableCell>
                          <TableCell>{e.addedDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
