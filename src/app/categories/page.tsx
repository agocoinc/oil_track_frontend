"use client"
import * as React from "react"
import { useState, useEffect, FormEvent } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { isAdmin } from "@/lib/auth"
import { getCompanies } from "@/lib/companies"
import { createCategory, fetchCategories, ValidationErrorResponse } from "@/lib/categories"
import { debounce } from "lodash"
import { useRouter } from "next/navigation"

type Category = {
  id: number
  aname: string
  lname: string
  fields: string[]
  note?: string | null
}

type Company = {
  id: number
  aname: string
  lname: string
}

type CategoryItemField = "loc_name" | "aname" | "lname" | "qty" | "from" | "to" | "note"

export default function EquipmentPage() {
    const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [aname, setAName] = useState("")
  const [lname, setLName] = useState("")
  const [note, setNote] = useState("")
  const [selectedFields, setSelectedFields] = useState<CategoryItemField[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingCreate, setLoadingCreate] = useState(false)
  const [errors, setErrors] = useState<{ aname?: string[]; lname?: string[]; fields?: string[] }>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [checkAdmin, setCheckAdmin] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 20

  const fieldOptions = [
    { label: "الموقع", value: "loc_name" },
    { label: "الاسم بالعربية", value: "aname" },
    { label: "الاسم بالإنجليزية", value: "lname" },
    { label: "الكمية", value: "qty" },
    { label: "من تاريخ", value: "from" },
    { label: "إلى تاريخ", value: "to" },
    { label: "ملاحظات", value: "note" },
  ]

  const toggleField = (value: CategoryItemField) => {
    setSelectedFields((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const handleSearchChange = debounce((value: string) => {
    setCurrentPage(1);
    setSearchQuery(value);
    }, 500);

useEffect(() => {
  const init = async () => {
    setMounted(true);
    setLoading(true);
    const admin = await isAdmin();
    setCheckAdmin(admin);

    try {
      const res = await fetchCategories(itemsPerPage, currentPage, searchQuery); // pass search

      if (res.status && "data" in res.data && res.data.data) {
        const paginatedData = res.data.data as any;
        setCategories(paginatedData.data); // actual items
        setTotalPages(paginatedData.last_page); // total pages
      } else {
        toast.error("حدث خطأ أثناء جلب التصنيفات");
      }

      if (admin) {
        const companyRes = await getCompanies();
        if (companyRes.status) {
          setCompanies(companyRes.data.data);
        }
      }
    } catch {
      toast.error("حدث خطأ أثناء تحميل البيانات");
    }
    setLoading(false);
  };

  init();
}, [currentPage, searchQuery]);



  useEffect(() => {
    setSelectedFields((prev) => Array.from(new Set([...prev, "aname", "lname"])))
  }, [])

  if (!mounted) return null

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    setLoadingCreate(true)
    setErrors({})

    const result = await createCategory({
      aname,
      lname,
      note,
      fields: selectedFields,
    })

    if (result.status) {
    // Narrow the type: check if 'data' exists inside result.data
    if ("data" in result.data) {
        const newCategory = result.data.data as Category;

        setCategories((prev) => [...prev, newCategory]);
        setAName("");
        setLName("");
        setNote("");
        setSelectedFields(["aname", "lname"]);
        setIsDialogOpen(false);
        toast.success("تمت الإضافة بنجاح");
    }
    } else {
        const errorData = result.data as ValidationErrorResponse;
        setErrors(errorData.errors || {});
        toast.error("حدث خطأ أثناء الإضافة");
    }


    setLoadingCreate(false)
  }



  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      dir="rtl"
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />

        <div className="flex flex-1 flex-col p-6 gap-4" dir="rtl">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">التصنيفات</h1>
            {checkAdmin && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setIsDialogOpen(true)}>إضافة تصنيف</Button>
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

                      <div className="my-4">
                        <Label>الحقول</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {fieldOptions.map((field) => {
                            const isFixed =
                              field.value === "aname" || field.value === "lname"
                            return (
                              <div
                                key={field.value}
                                className="flex items-center space-x-2 space-x-reverse"
                              >
                                <Checkbox
                                  id={field.value}
                                  checked={
                                    isFixed
                                      ? true
                                      : selectedFields.includes(field.value as CategoryItemField)
                                  }
                                  disabled={isFixed}
                                  onCheckedChange={() => {
                                    if (!isFixed) toggleField(field.value as CategoryItemField)
                                  }}
                                />
                                <Label htmlFor={field.value}>{field.label}</Label>
                              </div>
                            )
                          })}
                        </div>
                        {errors.fields && (
                          <p className="text-sm text-red-600 mt-1">{errors.fields.join(", ")}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="note">ملاحظات</Label>
                        <textarea
                          id="note"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                        />
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
            )}
          </div>

          <Input
            placeholder="بحث سريع..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className=""
            />


          <Card>
            <CardContent>
              {loading ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><Skeleton className="h-4 w-[150px]" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-[150px]" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-[150px]" /></TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
              ) : (
                <Table className="text-right" dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الاسم بالعربية</TableHead>
                      <TableHead className="text-right">الاسم بالإنجليزية</TableHead>
                      <TableHead className="text-right">الحقول</TableHead>
                      <TableHead className="text-right">ملاحظات</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>

                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((cat) => (
                      <TableRow key={cat.id}>
                        <TableCell>{cat.aname || "-"}</TableCell>
                        <TableCell>{cat.lname || "-"}</TableCell>
                        <TableCell>
                        {cat.fields && cat.fields.length > 0
                            ? cat.fields
                                .map(
                                (field) =>
                                    fieldOptions.find((opt) => opt.value === field)?.label || field
                                )
                                .join("، ") // Arabic comma
                            : "-"}
                        </TableCell>
                        <TableCell>{cat.note || "-"}</TableCell>
                        <TableCell>
                            <Button
                                variant="outline"
                                size="sm"
                                className="ml-2"
                                onClick={() => router.push(`/categories/${cat.id}`)}
                            >
                                عرض
                            </Button>
                            
                            
                        </TableCell>

                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

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


            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
