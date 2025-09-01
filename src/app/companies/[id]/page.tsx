"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion"
import { Building2 } from "lucide-react"

type Company = {
  id: string
  name: string
  arabicName: string
  logoUrl?: string
  structure: { id: string; name: string; details: string }[]
}

export default function CompanyPage() {
  const router = useRouter()

  const company: Company = {
    id: "comp-001",
    name: "Agoco Zero",
    arabicName: "أغوكو زيرو",
    logoUrl: "/company-logo.png",
    structure: [
      { id: "dep-001", name: "قسم التقنية", details: "مسؤول عن تطوير الأنظمة والهاردوير." },
      { id: "dep-002", name: "قسم الموارد البشرية", details: "إدارة الموظفين والتوظيف." },
      { id: "dep-003", name: "قسم المالية", details: "الإدارة المالية للشركة." },
    ]
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />

        <main className="flex flex-col space-y-6 p-6 bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">
           <Card className="flex items-center gap-4 p-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-zinc-800 flex items-center justify-center">
              {company.logoUrl ? (
                <Image
                  src={company.logoUrl}
                  alt={company.name}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              ) : (
                <Building2 className="w-12 h-12 text-gray-500 dark:text-gray-400" />
              )}
            </div>
            <div className="flex flex-col">
              <CardTitle className="text-xl">{company.name}</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                {company.arabicName}
              </CardDescription>
            </div>
          </Card>

           <div className="flex gap-4">
            <Button onClick={() => router.push(`/companies/${company.id}/equipment`)}>المعدات</Button>
            <Button onClick={() => router.push(`/companies/${company.id}/licenses`)}>التراخيص</Button>
            <Button onClick={() => router.push(`/companies/${company.id}/software`)}>البرامج</Button>
          </div>

          <div className="flex gap-6 mt-4">
            
            <div className="flex-1 space-y-4">
              <Card className="p-4">
                <CardTitle>تفاصيل عامة</CardTitle>
                <CardContent>
                  <p><strong>العنوان:</strong> بنغازي، ليبيا</p>
                  <p><strong>المجال:</strong> الطاقة والتقنية</p>
                  <p><strong>عدد الموظفين:</strong> 350</p>
                </CardContent>
              </Card>
            </div>

            
            <div className="w-80">
              <Accordion type="single" collapsible className="space-y-2">
                {company.structure.map(section => (
                  <AccordionItem key={section.id} value={section.id}>
                    <AccordionTrigger className="flex justify-between">
                      {section.name}
                      <div className="flex gap-1">
                        <Button size="xs" variant="outline">تعديل</Button>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>{section.details}</p>
                      <Button size="xs" className="mt-2">إضافة قسم فرعي</Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
