"use client"

import { useState, useEffect } from "react"
import * as React from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

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
import { deleteEquipmentCategory, getEquipmentCategory } from "@/lib/equipmentCategory"
import Link from "next/link"
import { createEquipmentDetail, getEquipmentDetailsByCategory } from "@/lib/equipmentDetails"
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

type Category = {
  id: number,
  aname: string,
  lname: string,
  note: string
}

export default function ShowEquipmentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("")
  const [locName, setLocName] = useState("");
  const [detailsAName, setDetailsAName] = useState("");
  const [detailsLName, setDetailsLName] = useState("");
  const [detailsQty, setDetailsQty] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState<Category | null>()
  const [error, setError] = useState<string>("")
  const [formError, setFormError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [details, setDetails] = useState<Detail[]>([])

  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [errors, setErrors] = React.useState<{ [key: string]: string[] }>({});


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(details.length / itemsPerPage);
  const paginatedDetails = details.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const [mounted, setMounted] = useState(false)

  const {id} = React.use(params);



  useEffect(() => {
    setMounted(true)
    async function fetchData() {
      try {
        const res = await getEquipmentCategory(id)
      
      if (res?.status) {
        console.log(res.data)
        setCategory(res.data.data)
      } else {
        setError("حدث خطأ أثناء جلب التصنيفات")
      }

      setLoading(false)
      } catch {
        setLoading(false)
      }
    }

    async function fetchDetails() {
      try {
        const res = await getEquipmentDetailsByCategory(id)
      
      if (res?.status) {
        console.log("these are the details: ", res.data)
        setDetails(res.data.data)
      } else {
        setError("حدث خطأ أثناء جلب التصنيفات")
      }

      setLoading(false)
      } catch {
        setLoading(false)
      }
    }

    fetchData()
    fetchDetails()
  }, [])

  if (!mounted) return null

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});

    setLoadingCreate(true)

    const newDetail: Omit<Detail, "id"> = {
      equipment_category_id: id,
      loc_name: locName,
      details_aname: detailsAName,
      details_lname: detailsLName,
      details_qty: detailsQty,
      date_from: dateFrom,
      date_to: dateTo,
      note,
    };

    const result = await createEquipmentDetail(newDetail);

    if (result.status) {
      toast.success("تم الإضافة بنجاح")
      setDetails((prev) => [...prev, result.data.data])
      setLoadingCreate(false)
      setIsDialogOpen(false);

      setLocName("");
      setDetailsAName("");
      setDetailsLName("");
      setDetailsQty(1);
      setDateFrom("");
      setDateTo("");
      setNote("");
      setFormError("");
    } else {
      setErrors(result.data.errors || {});
      console.log(result)
      setLoadingCreate(false)
      toast.error("فشل في إضافة المعدة. حاول مرة أخرى.");
    }

    setLoadingCreate(false)
  };
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoadingDelete(true)

    

    const result = await deleteEquipmentCategory(id);

    if (result.status) {
      toast.success("تم الحذف بنجاح")
      router.push("/equipments")

    } else {
      setLoadingDelete(false)
      toast.error("فشل في إضافة المعدة. حاول مرة أخرى.");
    }

    // setLoadingDelete(false)
  };


  return (
    <>
    <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties} dir="rtl">
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />

        <div className="flex flex-1 flex-col p-6 gap-4" dir="rtl">
        {category ? (
          <>
            <h1 className="text-2xl font-bold">
              {category.aname} - {category.lname}
            </h1>
            
            <div className="flex items-center justify-between">
            <p>{category.note}</p>
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
                    <Button type="submit" className="bg-red-500 text-white cursor-pointer" disabled={loadingDelete}>{
                        loadingDelete ? "جاري الحذف ..." : "حذف"
                      }</Button>
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
            <h1 className="text-2xl font-bold">المعدات</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)} className="cursor-pointer">إضافة معدات</Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[1000px]" dir="rtl">
                <form onSubmit={handleCreate}>
                  <DialogHeader>
                    <DialogTitle>إضافة معدة</DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>

                  {formError && <div className="text-red-600 mb-2">{formError}</div>}

                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="locName">الموقع</Label>
                      <Input
                        id="locName"
                        value={locName}
                        onChange={(e) => setLocName(e.target.value)}
                        
                      />
                      {errors.loc_name && (
                        <p id="locName-error" className="text-sm text-red-600 mt-1" role="alert">
                          {errors.loc_name}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="detailsAName">الاسم بالحروف العربية</Label>
                      <Input
                        id="detailsAName"
                        value={detailsAName}
                        onChange={(e) => setDetailsAName(e.target.value)}
                        
                      />
                      {errors.details_aname && (
                        <p id="locName-error" className="text-sm text-red-600 mt-1" role="alert">
                          {errors.details_aname}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="detailsLName">الاسم بالحروف الإنجليزية</Label>
                      <Input
                        id="detailsLName"
                        value={detailsLName}
                        onChange={(e) => setDetailsLName(e.target.value)}
                        
                      />
                      {errors.details_lname && (
                        <p id="locName-error" className="text-sm text-red-600 mt-1" role="alert">
                          {errors.details_lname}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="detailsQty">الكمية</Label>
                      <Input
                        id="detailsQty"
                        type="number"
                        min={1}
                        value={detailsQty}
                        onChange={(e) => setDetailsQty(Number(e.target.value))}
                      />
                      {errors.details_qty && (
                        <p id="locName-error" className="text-sm text-red-600 mt-1" role="alert">
                          {errors.details_qty}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="dateFrom">تاريخ البداية</Label>
                      <Input
                        id="dateFrom"
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                      />
                      {errors.date_from && (
                        <p id="locName-error" className="text-sm text-red-600 mt-1" role="alert">
                          {errors.date_from}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="dateTo">تاريخ النهاية</Label>
                      <Input
                        id="dateTo"
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                      />
                      {errors.date_to && (
                        <p id="locName-error" className="text-sm text-red-600 mt-1" role="alert">
                          {errors.date_to}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="note">ملاحظات</Label>
                      <textarea
                        id="note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder=""
                        className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>

                  <DialogFooter className="mt-8">
                    <DialogClose asChild>
                      <Button variant="outline">إلغاء</Button>
                    </DialogClose>
                    <Button type="submit" disabled={loadingCreate} className="cursor-pointer">{loadingCreate ? "جاري الحفظ ..." : 'حفظ'}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Input
              placeholder="بحث سريع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
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
                        <TableHead className="text-right">الاسم بالحروف بالعربي</TableHead>
                        <TableHead className="text-right">الاسم بالحروف الإنجليزية</TableHead>
                        <TableHead className="text-right">ملاحظات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="mt-2">
                    
                    {!loading && <>
                      {paginatedDetails.map((detail: Detail) => (
                        <TableRow key={detail.id} >
                          <TableCell>{detail.details_aname}</TableCell>
                          <TableCell>{detail.details_lname}</TableCell>
                          <TableCell>{detail.note}</TableCell>
                          <TableCell className="py-2">
                            <Link href={`/equipments/detail/${detail.id}`} className="rounded px-2 text-xs bg-blue-500 text-white">
                              عرض التفاصيل
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>}

                      
                    </TableBody>
                  </Table>}

                  <div className="flex justify-center mt-4 gap-2">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                      className="cursor-pointer"
                    >
                      السابق
                    </Button>

                    {[...Array(totalPages)].map((_, index) => (
                      <Button
                        key={index}
                        variant={currentPage === index + 1 ? "default" : "outline"}
                        onClick={() => setCurrentPage(index + 1)}
                        className="cursor-pointer"
                      >
                        {index + 1}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      className="cursor-pointer"
                    >
                      التالي
                    </Button>
                  </div>
                  
                </CardContent>
              </Card>

            
        </div>
      </SidebarInset>
    </SidebarProvider>
    
    </>
  )
}
