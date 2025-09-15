"use client"
import * as React from 'react'
import { useState, useEffect, FormEvent } from "react"
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
import { createEquipmentCategory, getEquipmentCategories } from "@/lib/equipmentCategory"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"


type Category = {
  id: number,
  aname: string,
  lname: string,
  note: string
}

export default function EquipmentPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [aname, setAName] = useState<string>("")
  const [lname, setLName] = useState<string>("")
  const [note, setNote] = useState<string>("")
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errors, setErrors] = React.useState<{ aname?: string[], lname?: string[] }>({});
  const [loadingCreate, setLoadingCreate] = useState(false)


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginatedCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



  const [mounted, setMounted] = useState(false)


  useEffect(() => {
    setMounted(true)
    async function fetchData() {
      try {
        const res = await getEquipmentCategories()
      
      if (res?.status) {
        console.log(res.data)
        setCategories(res.data.data)
      } else {
        
        setError("حدث خطأ أثناء جلب التصنيفات")
      }

      setLoading(false)
      } catch {
        toast.error("حدث خطأ ما")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (!mounted) return null

  const handleCreate = async (e: FormEvent) => {
    toast.success("تم الإضافة بنجاح")
    console.log("create")
    e.preventDefault();
    setLoadingCreate(true)
    setErrors({})
    const result = await createEquipmentCategory({
      aname,
      lname,
      note
    });

    if (result.status) {
      // console.log(result.data.data)
      setCategories((prev) => [...prev, result.data.data]);
  
      setAName("");
      setLName("");
      setNote("");
  
      setIsDialogOpen(false);
      setLoadingCreate(false)

    } else {
      // handle error here
      console.log(result.data.errors)
      setErrors(result.data.errors || {})
      setLoadingCreate(false)
      toast.error("حدث خطأ")

    }


  }



  return (
    <>
    <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties} dir="rtl">
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />

        <div className="flex flex-1 flex-col p-6 gap-4" dir="rtl">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">المعدات</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              
                <DialogTrigger asChild>
                  <Button className="cursor-pointer" onClick={() => setIsDialogOpen(true)}>إضافة معدات</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[1000px]" dir="rtl">
                <form onSubmit={handleCreate}>
                  <DialogHeader>
                    <DialogTitle>إضافة معدة</DialogTitle>
                    <DialogDescription>
                      
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="aname">الاسم بالحروف العربية</Label>
                      <Input id="aname" onChange={(e) => setAName(e.target.value)} defaultValue="" />
                      {errors.aname && (
                        <p
                          id="aname-error"
                          className="text-sm text-red-600 mt-1"
                          role="alert"
                        >
                          {errors.aname.join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="lname">الاسم بالحروف الإنجليزية</Label>
                      <Input id="lname"  onChange={(e) => setLName(e.target.value)} defaultValue=""  />
                      {errors.lname && (
                        <p
                          id="aname-error"
                          className="text-sm text-red-600 mt-1"
                          role="alert"
                        >
                          {errors.lname.join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="note">ملاحظات</Label>
                      <textarea
                        id="note"
                        onChange={(e) => setNote(e.target.value)}
                        defaultValue=""
                        placeholder=""
                        className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                  <DialogFooter className="mt-8">
                    <DialogClose asChild>
                      <Button variant="outline">إلغاء</Button>
                    </DialogClose>
                    <Button type="submit" className={`cursor-pointer `} disabled={loadingCreate}>{loadingCreate ? "جاري الحفظ ..." : "حفظ"}</Button>
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
                </> : <Table className="border-spaceing-4">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الاسم بالحروف بالعربي</TableHead>
                        <TableHead className="text-right">الاسم بالحروف الإنجليزية</TableHead>
                        <TableHead className="text-right">ملاحظات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    
                    {!loading && <>
                      {paginatedCategories.map((item: {
                        id: number,
                        aname: string,
                        lname: string,
                        note: string
                      }) => (
                        <TableRow key={item.id} className="py-4">
                          <TableCell>{item.aname}</TableCell>
                          <TableCell>{item.lname}</TableCell>
                          
                          <TableCell>{item.note}</TableCell>
                          <TableCell>
                            <Link href={"/equipments/"+item.id} className=" px-2 text-xs bg-blue-500 text-white rounded cursor-pointer">عرض</Link>
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
