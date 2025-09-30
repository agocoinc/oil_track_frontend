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
import { getCompanies } from '@/lib/companies'
// import { Company } from '@/components/ui/sheet-add-company'



type Company = {
  id: number,
  aname: string,
  lname: string,

}

export default function EquipmentPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const [companies, setCompanies] = useState<Company[]>([])
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)


  const [checkAdmin, setCheckAdmin] = useState(false);


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(companies.length / itemsPerPage);
  const filteredCompanies = companies.filter(company => {
   

    const matchesSearch = searchQuery
        ? company.aname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            company.lname.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

        return matchesSearch;
    });

    const paginatedCompanies = filteredCompanies.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );



  const [mounted, setMounted] = useState(false)


  useEffect(() => {
    
    const check = async () => {
      const result = await isAdmin()
      setCheckAdmin(result);
    }
    check()
    setMounted(true)


    async function fetchCompanies() {
      try {
        const res = await getCompanies()
      
      if (res?.status) {
        console.log("all companies ", res.data.data)
        setCompanies(res.data.data)
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
  }, [])

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    
                    {!loading && <>
                      {paginatedCompanies.map((item: {
                        id: number,
                        aname: string,
                        lname: string,
                      }) => (
                        <TableRow key={item.id} className="py-4">
                          <TableCell>{item.aname}</TableCell>
                          <TableCell>{item.lname}</TableCell>
                          <TableCell>
                            <Link href={"/structure/"+item.id} className=" px-2 ml-2 text-xs bg-blue-500 text-white rounded cursor-pointer">
                                عرض المخطط
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
