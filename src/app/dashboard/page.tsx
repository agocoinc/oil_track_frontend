"use client"

import {useEffect, useState} from "react"
import { AlertTriangle, CpuIcon, DatabaseIcon } from "lucide-react"

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { getEquipmentDetailStats, getEquipmentDetailStatsForAdmin } from "@/lib/equipmentDetails"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { isAdmin } from "@/lib/auth"



type Detail = {
  category_id?: number | string;


  category_name?: string;
  details_aname?: string;
  remaining_days?: number;
  status?: string;
}



export default function DashboardPage() {
  const { loading } = useAuth();
  const [_, setMounted] = useState(false)
  const [details, setDetails] = useState<Detail[]>();
  const [loadingC, setLoadingC] = useState(false);
  const [quickStats, setQuickStats] = useState<{
    category: number,
    details: number,
    companies?: number
  }>()

  const [checkAdmin, setCheckAdmin] = useState(false)


  useEffect(() => {
    const check = async () => {
      const result = await isAdmin()
      setCheckAdmin(result);
    }
    check()
    setMounted(true)
    async function fetchData() {
      console.log('fetching stats normal')
      try {
        const res = await getEquipmentDetailStats()
      
      if (res?.status) {
        console.log(res.data.data.expiring_items)
        setDetails(res.data.data.expiring_items)
        setQuickStats({
          category: res.data.data.categories_count,
          details: res.data.data.details_count,
        })
      } else {
        
        toast.error("حدث خطأ أثناء جلب التصنيفات")

        console.log("fetching the data: ", res)
      }

      setLoadingC(false)
      } catch {
        toast.error("حدث خطأ ما")
        setLoadingC(false)
      }
    }


    async function fetchDataAdmin() {
      console.log('fetching stats ...')
      try {
        const res = await getEquipmentDetailStatsForAdmin()
      
      if (res?.status) {
        console.log(res.data.data.expiring_items)
        setDetails(res.data.data.expiring_items)
        setQuickStats({
          category: res.data.data.categories_count,
          details: res.data.data.details_count,
          companies: res.data.data.companies_count
        })
      } else {
        
        toast.error("حدث خطأ أثناء جلب التصنيفات")

        console.log("fetching the data: ", res)
      }

      setLoadingC(false)
      } catch {
        toast.error("حدث خطأ ما")
        setLoadingC(false)
      }
    }


    async function main() {
      if(await isAdmin()) {
        fetchDataAdmin()
      }else{
        fetchData()
      }
    }

    main();

  }, [])

  return (
    <>
    {loading ? <div className="text-center h-screen w-[100%] flex items-center justify-center">
      <p>... جاري التحميل</p>
    </div> : <SidebarProvider dir="rtl" style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="w-full max-w-7xl mx-auto space-y-8 p-6 md:p-10 bg-gray-50 dark:bg-zinc-900 transition-colors duration-300">

          {/* العنوان والزر */}
          <div className="flex items-center justify-between">
            <div>
              {/* <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                لوحة التحكم
              </h1> */}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                نظرة سريعة على أهم البيانات في نظامك.
              </p>
            </div>
            {/* <Button>
              <PlusCircle className="ml-2 h-4 w-4" />
              إضافة عنصر جديد
            </Button> */}
          </div>

          {/* بطاقات الإحصائيات */}
          <div className={`grid gap-6 md:grid-cols-${checkAdmin ? '3' : '2'}`}>

                

                <Card
                  className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
                >
                  <CardContent className="flex items-center gap-6 p-6">
                    <div className="rounded-lg bg-primary/10 p-4">
                      <DatabaseIcon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        العناصر
                      </p>
                      <p className="text-4xl font-bold text-gray-900 dark:text-gray-50">
                      {quickStats?.details}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                

                {checkAdmin && <>
                <Card
                  className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
                >
                  <CardContent className="flex items-center gap-6 p-6">
                    <div className="rounded-lg bg-primary/10 p-4">
                      <CpuIcon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        التصنيفات
                      </p>
                      <p className="text-4xl font-bold text-gray-900 dark:text-gray-50">
                        {quickStats?.category}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card
                  className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
                >
                  <CardContent className="flex items-center gap-6 p-6">
                    <div className="rounded-lg bg-primary/10 p-4">
                      <DatabaseIcon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        الشركات 
                      </p>
                      <p className="text-4xl font-bold text-gray-900 dark:text-gray-50">
                      {quickStats?.companies}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                </>}


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
              {/* <Button variant="outline" size="sm">عرض الكل</Button> */}
            </CardHeader>
            <CardContent className="p-4 overflow-x-auto ">
            {loadingC ? <>
                  <Table className="border-spaceing-4">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right"> <Skeleton className="h-4 w-[250px]" /></TableHead>
                        <TableHead className="text-right"> <Skeleton className="h-4 w-[250px]" /></TableHead>
                        <TableHead className="text-right"> <Skeleton className="h-4 w-[250px]" /></TableHead>
                      </TableRow>
                    </TableHeader>
                  </Table>
                </> : <>
            
              <Table>
                <TableHeader >
                  <TableRow >
                    <TableHead className="text-right">التصنيف</TableHead>
                    <TableHead className="text-right">المعدة</TableHead>
                    <TableHead className="text-center ">الأيام المتبقية</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {!loadingC && <>
                  {details?.map((item: Detail) => (
                    <TableRow key={item.category_id as number + Math.random()} className="hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                      <TableCell>{item.category_name}</TableCell>
                      <TableCell>{item.details_aname}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            item.status === 'expired'
                              ? 'destructive'
                              : item.status === 'expiring_soon'
                              ? 'secondary'
                              : 'default'
                          }
                          className={
                            item.status === 'safe'
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : ''
                          }
                        >
                          {item.remaining_days} يوم
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))} 
                  </>
                }
                
                </TableBody>
              </Table>
              </>
            }
            </CardContent>
          </Card>

        </main>
      </SidebarInset>
    </SidebarProvider>}</>
  )
}
