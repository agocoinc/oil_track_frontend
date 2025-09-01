"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Briefcase, Cpu, Database, PlusCircle, AlertTriangle } from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// بيانات الإحصائيات
const statsData = [
  {
    title: "الشركات",
    value: "10",
    description: "شركة مسجلة حاليًا",
    icon: Briefcase,
    link: "/companies-list",
  },
  {
    title: "المعدات",
    value: "25",
    description: "معدة متاحة للعمل",
    icon: Cpu,
    link: "/equipment",
  },
  {
    title: "التراخيص",
    value: "18",
    description: "ترخيصًا نشطًا",
    icon: Database,
    link: "/licenses",
  },
]

// بيانات التراخيص التي توشك على الانتهاء
const expiringLicenses = [
  { id: "LIC-001", equipment: "رافعة شوكية #1023", company: "شركة الأفق", daysLeft: 15, status: "warning" },
  { id: "LIC-008", equipment: "حفارة #2045", company: "بناة المستقبل", daysLeft: 5, status: "danger" },
  { id: "LIC-012", equipment: "مولد كهرباء #5011", company: "الطاقة المستدامة", daysLeft: 45, status: "safe" },
  { id: "LIC-003", equipment: "ضاغط هواء #3321", company: "شركة الأفق", daysLeft: 2, status: "danger" },
]

export default function DashboardPage() {
  const router = useRouter()

  return (
    <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="w-full max-w-7xl mx-auto space-y-8 p-6 md:p-10 bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">

          {/* العنوان والزر */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                لوحة التحكم
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                نظرة سريعة على أهم البيانات في نظامك.
              </p>
            </div>
            <Button>
              <PlusCircle className="ml-2 h-4 w-4" />
              إضافة عنصر جديد
            </Button>
          </div>

          {/* بطاقات الإحصائيات */}
          <div className="grid gap-6 md:grid-cols-3">
            {statsData.map((stat) => {
              const Icon = stat.icon
              return (
                <Card
                  key={stat.title}
                  className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
                  onClick={() => router.push(stat.link)}
                >
                  <CardContent className="flex items-center gap-6 p-6">
                    <div className="rounded-lg bg-primary/10 p-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-4xl font-bold text-gray-900 dark:text-gray-50">
                        {stat.value}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* جدول تنبيهات التراخيص */}
          <Card className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 transition-colors duration-300">
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl font-semibold">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  تنبيهات التراخيص
                </CardTitle>
                <CardDescription>
                  قائمة بالتراخيص التي ستنتهي صلاحيتها قريبًا.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">عرض الكل</Button>
            </CardHeader>
            <CardContent className="p-4 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-gray-100 dark:bg-zinc-700 text-gray-900 dark:text-gray-100">رقم الترخيص</TableHead>
                    <TableHead>المعدة</TableHead>
                    <TableHead className="hidden md:table-cell">الشركة</TableHead>
                    <TableHead className="text-center">الأيام المتبقية</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiringLicenses.map((license) => (
                    <TableRow key={license.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                      <TableCell className="bg-gray-50 dark:bg-zinc-800 font-medium">{license.id}</TableCell>
                      <TableCell>{license.equipment}</TableCell>
                      <TableCell className="hidden md:table-cell">{license.company}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            license.status === 'danger'
                              ? 'destructive'
                              : license.status === 'warning'
                              ? 'secondary'
                              : 'default'
                          }
                          className={
                            license.status === 'safe'
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : ''
                          }
                        >
                          {license.daysLeft} يوم
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
