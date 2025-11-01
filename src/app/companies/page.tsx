"use client"
import * as React from 'react'
import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { isAdmin } from '@/lib/auth'
import { createCompany, getCompanies, ValidationErrorResponse } from '@/lib/companies'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { DialogClose } from '@radix-ui/react-dialog'
import { useRouter } from 'next/navigation'
import { debounce } from 'lodash'
// import { Company } from '@/components/ui/sheet-add-company'



type Company = {
  id: number,
  aname: string,
  lname: string,

}

export default function CompaniesPage() {
  const router = useRouter();

  const [companies, setCompanies] = useState<Company[]>([])
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [aname, setAName] = useState("");
  const [lname, setLName] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [totalPages, setTotalPages] = useState(1);
      const [currentPage, setCurrentPage] = useState(1);
      const [searchQuery, setSearchQuery] = useState("");
      const itemsPerPage = 20


  const [checkAdmin, setCheckAdmin] = useState(false);




  



  const [mounted, setMounted] = useState(false)

  const handleSearchChange = React.useCallback(
      debounce((value: string) => {
        setCurrentPage(1);
        setSearchQuery(value);
      }, 1000),
      []
    );

  const handleCreate = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoadingCreate(true);
  setErrors({});

  const result = await createCompany({
    aname,
    lname,
  });

  if (result.status) {
    if ("data" in result.data) {
      const newCompany = result.data.data as Company;

      // Update local state with the new company
      setCompanies((prev) => [...prev, newCompany]);

      // Reset form
      setAName("");
      setLName("");
      setIsDialogOpen(false);

      toast.success("تمت إضافة الشركة بنجاح");
    }
  } else {
    const errorData = result.data as ValidationErrorResponse;
    setErrors(errorData.errors || {});
    toast.error("حدث خطأ أثناء إنشاء الشركة");
  }

  setLoadingCreate(false);
};


  useEffect(() => {
    
    const check = async () => {
      const result = await isAdmin()
      setCheckAdmin(result);
    }
    check()
    setMounted(true)


    async function fetchCompanies() {
      try {
        const res = await getCompanies(itemsPerPage, currentPage, searchQuery)
      
      if (res?.status) {
        console.log("all companies ", res.data.data)
        setCompanies(res.data.data.data)
      } else {
        
        setError("حدث خطأ أثناء جلب الشركات")
      }

      setLoading(false)
      } catch {
        toast.error("حدث خطأ ما")
        setLoading(false)
      }
    }

    async function main() {
      if(await isAdmin()) {
        fetchCompanies()
      }
    }

    main();
  }, [currentPage, searchQuery]);



  if (!mounted) return null



  return (
    <>
    <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties} dir="rtl">
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />

        <div className="flex flex-1 flex-col p-6 gap-4" dir="rtl">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">الشركات</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setIsDialogOpen(true)}>إضافة شركة</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]" dir="rtl">
                  <form onSubmit={handleCreate}>
                    <DialogHeader>
                      <DialogTitle>إضافة تصنيف جديد</DialogTitle>
                      <DialogDescription>أدخل تفاصيل التصنيف الجديد</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="aname" className="mb-2">الاسم بالعربية</Label>
                        <Input id="aname" value={aname} onChange={(e) => setAName(e.target.value)} />
                        {errors.aname && (
                          <p className="text-sm text-red-600 mt-1">{errors.aname.join(", ")}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="lname" className="mb-2">الاسم بالإنجليزية</Label>
                        <Input id="lname" value={lname} onChange={(e) => setLName(e.target.value)} />
                        {errors.lname && (
                          <p className="text-sm text-red-600 mt-1">{errors.lname.join(", ")}</p>
                        )}
                      </div>

                      
                    </div>

                    <DialogFooter className="mt-6">
                      <DialogClose asChild>
                        <Button variant="outline">إلغاء</Button>
                      </DialogClose>
                      <Button type="submit" disabled={loadingCreate}>
                        {loadingCreate ? "جاري الحفظ..." : "حفظ"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <Input
                        placeholder="بحث سريع..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className=""
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
                        {checkAdmin && <TableHead className="text-right"> <Skeleton className="h-4 w-[250px]" /></TableHead>}
                        <TableHead className="text-right"> <Skeleton className="h-4 w-[250px]" /></TableHead>
                      </TableRow>
                    </TableHeader>
                  </Table>
                </> : <Table className="border-spaceing-4">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الاسم بالحروف بالعربي</TableHead>
                        <TableHead className="text-right">الاسم بالحروف الإنجليزية</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    
                    {!loading && <>
                      {companies.map((item: {
                        id: number,
                        aname: string,
                        lname: string,
                      }) => (
                        <TableRow key={item.id} className="py-4">
                          <TableCell>{item.aname}</TableCell>
                          <TableCell>{item.lname}</TableCell>
                          <TableCell>
                             <Button
                                variant="outline"
                                size="sm"
                                className="ml-2"
                                onClick={() => router.push(`/companies/${item.id}`)}
                            >
                                عرض
                            </Button>

                            

                          </TableCell>
                          
                        </TableRow>
                      ))}
                    </>}

                      
                    </TableBody>
                  </Table>}

                  

                  
                </CardContent>
              </Card>
              
              <div className="flex justify-center mt-4 gap-2">
                                          <Button
                                              variant="outline"
                                              disabled={currentPage === 1}
                                              onClick={() => setCurrentPage((p) => p - 1)}
                                          >
                                              السابق
                                          </Button>
                          
                                          {[...Array(totalPages)].map((_, index) => (
                                              <Button
                                              key={index}
                                              variant={currentPage === index + 1 ? "default" : "outline"}
                                              onClick={() => setCurrentPage(index + 1)}
                                              >
                                              {index + 1}
                                              </Button>
                                          ))}
                          
                                          <Button
                                              variant="outline"
                                              disabled={currentPage === totalPages}
                                              onClick={() => setCurrentPage((p) => p + 1)}
                                          >
                                              التالي
                                          </Button>
                                          </div>
            
        </div>
      </SidebarInset>
    </SidebarProvider>
    
    </>
  )
}
