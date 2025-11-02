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
import { Company, createCompany, getCompanies, ValidationErrorResponse } from '@/lib/companies'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { DialogClose } from '@radix-ui/react-dialog'
import { createUser, getUsers, User } from '@/lib/users'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { debounce } from 'lodash'
// import { Company } from '@/components/ui/sheet-add-company'





export default function EquipmentPage() {
    const router = useRouter();

  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 20

  const [companies, setCompanies] = useState<Company[]>([]);
const [selectedCompany, setSelectedCompany] = useState<number | null>(null);


  const [checkAdmin, setCheckAdmin] = useState(false);




  



  const [mounted, setMounted] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoadingCreate(true);
  setErrors({});

  // Call the createUser API
  const result = await createUser({
    name,
    email,
    password,
    company_id: selectedCompany,
    role: "user", // or get from a form select if needed
  });

  if (result.status) {
      const newUser = result.data as User;

      // Update local state with the new user
      setUsers((prev) => [...prev, newUser]);

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setIsDialogOpen(false);

      toast.success("تمت إضافة المستخدم بنجاح");
  } else {
    const errorData = result.data as ValidationErrorResponse;
    setErrors(errorData.errors || {});
    toast.error("حدث خطأ أثناء إنشاء المستخدم");
  }

  setLoadingCreate(false);
};

  const handleSearchChange = React.useCallback(
    debounce((value: string) => {
      setCurrentPage(1);
      setSearchQuery(value);
    }, 1000),
    []
  );



  useEffect(() => {
    
    const check = async () => {
      const result = await isAdmin()
      setCheckAdmin(result);
    }
    check()
    setMounted(true)

    setLoading(true)
    async function fetchUsers() {
      try {
        const res = await getUsers(itemsPerPage, currentPage, searchQuery)
      
      if (res?.status) {
        setUsers(res.data.data)
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
        fetchUsers()
      }
    }

    main();
  }, [currentPage, searchQuery]);

  useEffect(() => {
  async function fetchCompanies() {
        try {
          const res = await getCompanies()
        
        if (res?.status) {
          console.log("all companies ", res.data.data.data)
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

  fetchCompanies();
}, []);


  if (!mounted) return null



  return (
    <>
    <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties} dir="rtl">
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />

        <div className="flex flex-1 flex-col p-6 gap-4" dir="rtl">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">المستخدمين</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setIsDialogOpen(true)}>إضافة مستخدم</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]" dir="rtl">
                  <form onSubmit={handleCreate}>
                    <DialogHeader>
                      <DialogTitle>إضافة مستخدم جديد</DialogTitle>
                      <DialogDescription>أدخل تفاصيل المستخدم الجديد</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">

                        <div>
                            <Label htmlFor="company" className="mb-2">الشركة</Label>

                            <Select
                                value={selectedCompany?.toString() ?? ""}
                                onValueChange={(value) => setSelectedCompany(Number(value))}
                            >
                                <SelectTrigger id="company" className="w-full">
                                <SelectValue placeholder="اختر الشركة" />
                                </SelectTrigger>

                                <SelectContent>
                                    {companies
                                        .filter((company): company is { id: number; aname: string; lname: string } => !!company.id)
                                        .map((company) => (
                                        <SelectItem key={company.id} value={company.id.toString()}>
                                            {company.aname} / {company.lname}
                                        </SelectItem>
                                        ))}
                                    </SelectContent>

                            </Select>

                            {!selectedCompany && (
                                <p className="text-sm text-red-600 mt-1">يرجى اختيار الشركة</p>
                            )}
                        </div>

                      <div>
                        <Label htmlFor="name" className="mb-2">الاسم</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        {errors.name && (
                          <p className="text-sm text-red-600 mt-1">{errors.name.join(", ")}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email" className="mb-2">الايميل</Label>
                        <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        {errors.email && (
                          <p className="text-sm text-red-600 mt-1">{errors.email.join(", ")}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="password" className="mb-2">كلمة السر</Label>
                        <Input id="password" type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        {errors.password && (
                          <p className="text-sm text-red-600 mt-1">{errors.password.join(", ")}</p>
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
                        <TableHead className="text-right"> <Skeleton className="h-4 w-[250px]" /></TableHead>
                        <TableHead className="text-right"> <Skeleton className="h-4 w-[250px]" /></TableHead>
                      </TableRow>
                    </TableHeader>
                  </Table>
                </> : <Table className="border-spaceing-4">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الاسم</TableHead>
                        <TableHead className="text-right">الإيميل</TableHead>
                        <TableHead className="text-right">الشركة</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    
                    {!loading && <>
                      {users.map((item: User) => (
                        <TableRow key={item.id} className="py-4">
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>
                            {(() => {
                                const company = companies.find((c) => c.id === item.company_id);
                                return company ? `${company.aname} / ${company.lname}` : "—";
                            })()}
                        </TableCell>

                          <TableCell>
                            <Button
                                variant="outline"
                                size="sm"
                                className="ml-2"
                                onClick={() => router.push(`/users/${item.id}`)}
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
