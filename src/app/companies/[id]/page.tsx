"use client";

import { useEffect, useState, FormEvent } from "react";
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
import { Loader2, MapIcon, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Category, fetchCategories } from "@/lib/categories";
import Link from "next/link";

export default function CompanyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [errors, setErrors] = useState<{ aname?: string[]; lname?: string[] }>({});

  // edit fields
  const [aname, setAName] = useState("");
  const [lname, setLName] = useState("");
  const [note, setNote] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const res = await getCompanyById(Number(id));
        console.log(res)
        if (res.status && res.data.data) {
          const companyData = res.data.data as Company;
          setCompany(companyData);
          setAName(companyData.aname || "");
          setLName(companyData.lname || "");
        } else {
          toast.error("حدث خطأ أثناء جلب بيانات الشركة");
        }
      } catch {
        toast.error("حدث خطأ في الاتصال بالخادم");
      } finally {
        setLoading(false);
      }
    };

    if (id) init();
  }, [id]);

useEffect(() => {
  const init = async () => {
    

    try {
      const res = await fetchCategories(); // pass search

      if (res.status && "data" in res.data && res.data.data) {
        const paginatedData = res.data.data as any;
        setCategories(paginatedData.data); // actual items
        console.log("here => ", paginatedData.data)
      } else {
        toast.error("حدث خطأ أثناء جلب التصنيفات");
      }

      
    } catch {
      toast.error("حدث خطأ أثناء تحميل البيانات");
    }

    setCategoriesLoading(false)
  };

  init();
}, []);

  const handleDelete = async () => {
    if (!company?.id) return;
    if (!confirm("هل أنت متأكد من حذف هذه الشركة؟")) return;

    setLoadingAction(true);
    const res = await deleteCompany(company.id);
    if (res.status) {
      toast.success("تم حذف الشركة بنجاح");
      router.back();
    } else toast.error("فشل حذف الشركة");
    setLoadingAction(false);
  };

  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!company) return;

    setLoadingAction(true);
    setErrors({});

    const payload: Record<string, any> = {};
    if (aname && aname !== company.aname) payload.aname = aname;
    if (lname && lname !== company.lname) payload.lname = lname;

    if (Object.keys(payload).length === 0) {
      toast.info("لم يتم تغيير أي بيانات");
      setLoadingAction(false);
      return;
    }

    const result = await updateCompany(company.id!, payload);

    if (result.status) {
      setCompany((prev) => (prev ? { ...prev, ...payload } : prev));
      toast.success("تم تعديل الشركة بنجاح");
      setIsEditDialogOpen(false);
    } else {
      const errorData = result.data as ValidationErrorResponse;
      setErrors(errorData.errors || {});
      toast.error("حدث خطأ أثناء التعديل");
    }

    setLoadingAction(false);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );

  if (!company)
    return (
      <div className="text-center py-10 text-muted-foreground">
        لم يتم العثور على الشركة
      </div>
    );

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
          {/* === Top Card === */}
          <Card className="shadow-sm border m-4">
            <CardHeader className="flex justify-between items-center flex-row">
              <CardTitle className="text-xl font-bold">
                {company.aname} / {company.lname}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Pencil className="w-4 h-4 mr-1" /> تعديل
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push(`/companies/${company.id}/structure`)}
                  disabled={loadingAction}
                >
                  <MapIcon className="w-4 h-4 mr-1" /> عرض المخطط
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loadingAction}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> حذف
                </Button>
                
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">الاسم العربي</p>
                <p className="font-medium">{company.aname || "-"}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">الاسم اللاتيني</p>
                <p className="font-medium">{company.lname || "-"}</p>
              </div>

              
            </CardContent>
          </Card>

          {/* === Edit Dialog === */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[600px]" dir="rtl">
              <form onSubmit={handleEdit}>
                <DialogHeader>
                  <DialogTitle>تعديل بيانات الشركة</DialogTitle>
                  <DialogDescription>
                    قم بتحديث معلومات الشركة
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 mt-4">
                  <div>
                    <Label htmlFor="aname">الاسم العربي</Label>
                    <Input
                      id="aname"
                      value={aname}
                      onChange={(e) => setAName(e.target.value)}
                    />
                    {errors.aname && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.aname.join(", ")}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lname">الاسم اللاتيني</Label>
                    <Input
                      id="lname"
                      value={lname}
                      onChange={(e) => setLName(e.target.value)}
                    />
                    {errors.lname && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.lname.join(", ")}
                      </p>
                    )}
                  </div>

                  
                </div>

                <DialogFooter className="mt-6">
                  <DialogClose asChild>
                    <Button variant="outline">إلغاء</Button>
                  </DialogClose>
                  <Button type="submit" disabled={loadingAction}>
                    {loadingAction ? "جاري الحفظ..." : "حفظ"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

            {/* displaying categories here as grid of cards it will have a circle with two letters (the letters can have different colors from category to category and the card is clickable to the another page "/companies/{id}/categories/{categoryId}") of the category and the arabic name as title */}
          <div className="mt-6 m-4">
  {categoriesLoading ? (
    <div className="flex justify-center py-6">
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    </div>
  ) : categories.length === 0 ? (
    <p className="text-center text-muted-foreground">لا توجد فئات</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
      {categories.map((category) => {
  const letters = category.lname?.substring(0, 2) || "??";
  const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"];
  const color = colors[(category.id ?? 0) % colors.length];

  return (
    <Link
      key={category.id ?? letters} // fallback for key if id is undefined
      href={`/companies/${company.id}/categories/${category.id}`}
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

        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
