"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getCompanyById,
  deleteCompany,
  updateCompany,
  Company,
  ValidationErrorResponse,
} from "@/lib/companies";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Category, fetchCategories, fetchCategoriesNormal, getCategoryByIdNormal } from "@/lib/categories";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { CategoryItem, createCategoryItem, deleteCategoryItemNormal, getCategoryItemsNormal } from "@/lib/category_items";
import { debounce } from "lodash";

export default function CompanyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [errors, setErrors] = useState<{ aname?: string[]; lname?: string[] }>({});
  const [category, setCategory] = useState<Category | null>(null);

  // edit fields
  const [aname, setAName] = useState("");
  const [lname, setLName] = useState("");
  const [note, setNote] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryItems, setCategoryItems] = useState<CategoryItem[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [subCategories, setSubCategories] = useState<Category[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [loadingCreate, setLoadingCreate] = useState(false)
    const [newItem, setNewItem] = useState<Record<string, any>>({});
    const {user} = useAuth();
    const [locName, setLocName] = useState("");
    const [qty, setQty] = useState<number>(0);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    console.log("here", user)
    const fieldOptions = [
  { label: "الموقع", value: "loc_name" },
  { label: "الاسم بالعربية", value: "aname" },
  { label: "الاسم بالإنجليزية", value: "lname" },
  { label: "الكمية", value: "qty" },
  { label: "من تاريخ", value: "from" },
  { label: "إلى تاريخ", value: "to" },
  { label: "ملاحظات", value: "note" },
];

const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 20
const activeFields = fieldOptions.filter((f) => category?.fields?.includes(f.value));


const handleSearchChange = React.useCallback(
      debounce((value: string) => {
        setCurrentPage(1);
        setSearchQuery(value);
      }, 1000),
      []
    );

useEffect(() => {
    const init = async () => {

      setLoading(true);
      try {
        const res = await getCategoryByIdNormal(Number(id));
  
        if (res.status && res.data?.data) {
          const cat = res.data.data;
          console.log(cat)
          setCategory(cat);
          console.log(category)
          setSubCategories(cat.children || []); // ✅ Directly from parent
        } else {
          toast.error("حدث خطأ أثناء جلب بيانات التصنيف");
        }
      } catch {
        toast.error("حدث خطأ في الاتصال بالخادم");
      } finally {
        setLoading(false);
      }

      setCategoriesLoading(false)
    };
  
    if (id) init();
  }, [id]);

  useEffect(() => {
  const fetchItems = async () => {
    if (!category || !user?.company_id) return;

    try {
      const res = await getCategoryItemsNormal(user.company_id, category.id!, itemsPerPage, currentPage, searchQuery);
      if (res.status && Array.isArray(res.data.data)) {
        setCategoryItems(res.data.data);
      } else {
        console.error("Failed to fetch items:", res.data);
        toast.error("فشل جلب العناصر");
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء جلب العناصر");
    }
  };

  fetchItems();
}, [category, user?.company_id, currentPage, searchQuery]);

  

  
  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );

 const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!category || !user?.company_id) return;

  setLoadingCreate(true);
  setErrors({});

  // build payload from newItem dynamically
  const payload: Omit<CategoryItem, "id" | "created_at" | "updated_at"> = {
    company_id: user.company_id,
    category_id: category.id!,
  };

  activeFields.forEach((field) => {
    const value = newItem[field.value];
    if (value !== undefined) {
      (payload as any)[field.value] = value;
    }
  });

  try {
    const res = await createCategoryItem(payload);

    if (res.status && res.data && "id" in res.data && "category_id" in res.data && "company_id" in res.data) {
    // TypeScript now knows it’s safe to treat as CategoryItem
    const createdItem = res.data as unknown as CategoryItem;
    setCategoryItems((prev) => [...prev, createdItem]);
    setIsDialogOpen(false);
    setNewItem({}); // reset form
    toast.success("تم إضافة العنصر بنجاح");
    } else {
    const errorData =
        res.data && "errors" in res.data
        ? res.data
        : { errors: {}, message: "حدث خطأ أثناء الإضافة" };
    setErrors(errorData.errors || {});
    console.log("errors", res);
    toast.error(errorData.message || "حدث خطأ أثناء الإضافة");
    }




  } catch (err) {
    console.error(err);
    toast.error("حدث خطأ غير متوقع");
  } finally {
    setLoadingCreate(false);
  }
};



const handleDelete = async (itemId: number | undefined) => {
  if (!itemId) return;
  if (!confirm("هل أنت متأكد من حذف هذا العنصر؟")) return;

  try {
    const res = await deleteCategoryItemNormal(itemId);
    if (res.status) {
      // Remove the deleted item from state so the table updates immediately
      setCategoryItems((prev) => prev.filter((item) => item.id !== itemId));
      toast.success("تم حذف العنصر بنجاح");
    } else {
      toast.error("فشل حذف العنصر");
    }
  } catch (err) {
    console.error(err);
    toast.error("حدث خطأ أثناء حذف العنصر");
  }
};







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
        <div className="space-y-6">
         <Card className="shadow-sm border m-4">
        <CardHeader className="flex justify-between items-center flex-row">
          <CardTitle className="text-xl font-bold">
            {category?.aname || "-"}
          </CardTitle>
         
        </CardHeader>

        
      </Card>

          

            {/* displaying categories here as grid of cards it will have a circle with two letters (the letters can have different colors from category to category and the card is clickable to the another page "/companies/{id}/categories/{categoryId}") of the category and the arabic name as title */}
          <div className="mt-6 m-4">
  {categoriesLoading ? (
    <div className="flex justify-center py-6">
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    </div>
  ) : subCategories.length === 0 ? (
    
    <>
    <div className="flex flex-1 flex-col p-6 gap-4" dir="rtl">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">العناصر</h1>
            {(
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setIsDialogOpen(true)}>إضافة عنصر</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]" dir="rtl">
                  <form onSubmit={handleCreate}>
  <DialogHeader>
    <DialogTitle>إضافة عنصر جديد</DialogTitle>
    <DialogDescription>أدخل تفاصيل العنصر الجديد</DialogDescription>
  </DialogHeader>

  <div className="grid gap-4">
    {activeFields.map((field) => (
      <div key={field.value}>
        <Label htmlFor={field.value} className="mb-2">{field.label}</Label>
        {field.value === "note" ? (<textarea value={newItem[field.value] || ""} // use a dynamic state
          onChange={(e) => setNewItem({ ...newItem, [field.value]: e.target.value })}
          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
          ></textarea>) : (<Input
          id={field.value}
          value={newItem[field.value] || ""} // use a dynamic state
          onChange={(e) => setNewItem({ ...newItem, [field.value]: e.target.value })}
          type={
            field.value === "qty"
                ? "number"
                : field.value === "from" || field.value === "to"
                ? "date"
                : "text"
          }

        />)}
      </div>
    ))}
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
    {loading ? (
      <Table>
        <TableHeader>
          <TableRow>
            {activeFields.map((field) => (
              <TableHead key={field.value}><Skeleton className="h-4 w-[150px]" /></TableHead>
            ))}
            <TableHead><Skeleton className="h-4 w-[150px]" /></TableHead> {/* for actions */}
          </TableRow>
        </TableHeader>
      </Table>
    ) : (
      <div className="overflow-x-auto w-full">
      <Table className="text-right min-w-[600px]" dir="rtl">
        <TableHeader>
          <TableRow>
            {activeFields.map((field) => (
              <TableHead key={field.value} className="text-right">{field.label}</TableHead>
            ))}
            <TableHead className="text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
  {categoryItems.length === 0 ? (
    <TableRow>
      <TableCell colSpan={activeFields.length + 1} className="text-center">
        لا يوجد عناصر
      </TableCell>
    </TableRow>
  ) : (
    categoryItems.map((item) => (
      <TableRow key={item.id}>
        {activeFields.map((field) => (
          <TableCell className="wrap-break-word" key={field.value}>{item[field.value as keyof CategoryItem] || "-"}</TableCell>
        ))}
        <TableCell>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(item.id)}
          >
            حذف
          </Button>
        </TableCell>
      </TableRow>
    ))
  )}
</TableBody>

      </Table>
      </div>
    )}
  </CardContent>
</Card>

        </div>
    </>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
      {subCategories.map((category) => {
  const letters = category.lname?.substring(0, 2) || "??";
  const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"];
  const color = colors[(category.id ?? 0) % colors.length];

  return (
    <Link
      key={category.id ?? letters} // fallback for key if id is undefined
      href={`/u/categories/${category.id}`}
      className="flex flex-col items-center justify-center p-4 border rounded-lg shadow hover:shadow-lg transition cursor-pointer"
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${color}`}>
        {letters}
      </div>
      <p className="mt-2 text-center font-medium">{category.aname}</p>
    </Link>
  );
})}

    </div>
  )}
</div>

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
  );
}
