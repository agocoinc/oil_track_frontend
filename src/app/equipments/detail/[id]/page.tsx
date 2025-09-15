"use client"

import { useState, useEffect, FormEvent } from "react"
import * as Reach from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { createEquipmentCategory, getEquipmentCategories, getEquipmentCategory } from "@/lib/equipmentCategory"
import Link from "next/link"
import { createEquipmentDetail, deleteEquipmentDetail, getEquipmentDetail, getEquipmentDetailsByCategory } from "@/lib/equipmentDetails"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"


type Detail = {
  id?: number,
  equipment_category_id: number | string,
  loc_name: string,
  details_aname: string,
  details_lname: string,
  details_qty: number,
  date_from: string,
  date_to: string,
  note: string
}



export default function ShowEquipmentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [detail, setDetail] = useState<Detail | null>()


  const [mounted, setMounted] = useState(false)

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {id} = Reach.use(params);



  useEffect(() => {
    setMounted(true)
    async function fetchData() {
      try {
        const res = await getEquipmentDetail(id)
      
      if (res?.status) {
        console.log("these are the data: ", res.data)
        setDetail(res.data.data)
      } else {
        setError("حدث خطأ أثناء جلب التصنيفات")
      }

      setLoading(false)
      } catch {
        setLoading(false)
      }
    }

    

    fetchData()
  }, [])

  if (!mounted) return null


  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoadingDelete(true)

    

    const result = await deleteEquipmentDetail(id);

    if (result.status) {
      toast.success("تم الحذف بنجاح")
      router.push(`/equipments/${detail?.equipment_category_id}`)

      // router.push("/equipments")
    } else {
      setLoadingDelete(false)
      toast.error("حدث خطأ")
    }

  };




  return (
    <>
    <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties} dir="rtl">
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />

        <div className="flex flex-1 flex-col p-6 gap-4" dir="rtl">
        {detail ? (
          <>
            <h1 className="text-2xl font-bold">
              {detail.details_aname} - {detail.details_lname}
            </h1>
            
            <div className="flex items-center justify-between">
            <p>{detail.note}</p>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsDeleteDialogOpen(true)} className="bg-red-500 text-white cursor-pointer">حذف</Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[400px]" dir="rtl">
                <form onSubmit={handleDelete}>
                  <DialogHeader>
                    <DialogTitle>حذف</DialogTitle>
                    <DialogDescription className="text-right">
                      هل أنت متأكد من أنك تريد الحذف؟
                      <br />
                      سوف يتم حذف جميع التفاصيل
                    </DialogDescription>
                  </DialogHeader>

               

                  <DialogFooter className="mt-8">
                    <DialogClose asChild>
                      <Button variant="outline">إلغاء</Button>
                    </DialogClose>
                    <Button type="submit" className="bg-red-500 text-white cursor-pointer" disabled={loadingDelete}>
                      {loadingDelete ? "جاري الحذف ..." : "حذف"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          </>
        ) : (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        )}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">التفاصيل</h1>
          </div>

         

          
              <Card>
 
                <CardContent>
                {loading ? <>
                  <Table className="border-spaceing-4">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right"> <Skeleton className="h-4 w-[250px]" /></TableHead>
                        <TableHead className="text-right"> <Skeleton className="h-4 w-[250px]" /></TableHead>
                        <TableHead className="text-right"> <Skeleton className="h-4 w-[250px]" /></TableHead>
                      </TableRow>
                    </TableHeader>
                  </Table>
                </> : <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الموقع</TableHead>
                        <TableHead className="text-right">الاسم بالحروف الإنجليزية</TableHead>
                        <TableHead className="text-right">الاسم بالحروف العربية</TableHead>
                        <TableHead className="text-right">الكمية</TableHead>
                        <TableHead className="text-right">التاريخ من</TableHead>
                        <TableHead className="text-right">التاريخ إلى</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    
                    {detail && <>
                        <TableRow>
                          <TableCell>{detail.loc_name}</TableCell>
                          <TableCell>{detail.details_aname}</TableCell>
                          <TableCell>{detail.details_lname}</TableCell>
                          <TableCell>{detail.details_qty}</TableCell>
                          <TableCell>{detail.date_from}</TableCell>
                          <TableCell>{detail.date_to}</TableCell>
                          
                        </TableRow>
                    </>}

                      
                    </TableBody>
                  </Table>}
                  
                </CardContent>
              </Card>

            
        </div>
      </SidebarInset>
    </SidebarProvider>
    
    </>
  )
}
