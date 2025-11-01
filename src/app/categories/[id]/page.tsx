"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getCategoryById,
  Category,
  deleteCategory,
  createCategory,
  ValidationErrorResponse,
  editCategory,
} from "@/lib/categories";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type CategoryItemField = "loc_name" | "aname" | "lname" | "qty" | "from" | "to" | "note"

export default function CategoryDetailsPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([])
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false)
  const [errors, setErrors] = useState<{ aname?: string[]; lname?: string[]; fields?: string[] }>({})
  const [selectedFields, setSelectedFields] = useState<CategoryItemField[]>([])

  // Add dialog state
const [addAName, setAddAName] = useState("");
const [addLName, setAddLName] = useState("");
const [addNote, setAddNote] = useState("");
const [addSelectedFields, setAddSelectedFields] = useState<CategoryItemField[]>(["aname", "lname"]);

  // Edit fields
  const [aname, setAName] = useState("");
  const [lname, setLName] = useState("");
  const [note, setNote] = useState("");

  const fieldOptions = [
    { label: "الموقع", value: "loc_name" },
    { label: "الاسم بالعربية", value: "aname" },
    { label: "الاسم بالإنجليزية", value: "lname" },
    { label: "الكمية", value: "qty" },
    { label: "من تاريخ", value: "from" },
    { label: "إلى تاريخ", value: "to" },
    { label: "ملاحظات", value: "note" },
  ]

 useEffect(() => {
  const init = async () => {
    setLoading(true);
    try {
      const res = await getCategoryById(Number(id));

      if (res.status && res.data?.data) {
        const cat = res.data.data;
        console.log(cat)
        setCategory(cat);
        setAName(cat.aname);
        setLName(cat.lname);
        setSelectedFields(cat.fields as CategoryItemField[]);
        setNote(cat.note || "");
        setSubCategories(cat.children || []); // ✅ Directly from parent
      } else {
        toast.error("حدث خطأ أثناء جلب بيانات التصنيف");
      }
    } catch {
      toast.error("حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  if (id) init();
}, [id]);


const toggleField = (value: CategoryItemField) => {
    setSelectedFields((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const toggleAddField = (value: CategoryItemField) => {
    setAddSelectedFields((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }


  const handleDelete = async () => {
    if (!category?.id) return;
    if (!confirm("هل أنت متأكد من حذف هذا التصنيف؟")) return;

    const res = await deleteCategory(category.id);
    if (res.status) {
      toast.success("تم حذف التصنيف بنجاح");
      window.history.back();
    } else toast.error("فشل حذف التصنيف");
  };

  

  



  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );

  if (!category)
    return (
      <div className="text-center py-10 text-muted-foreground">
        لم يتم العثور على التصنيف
      </div>
    );

    const handleCreate = async (e: FormEvent) => {
        e.preventDefault()
        setLoadingCreate(true)
        setErrors({})
    
        const result = await createCategory({
            parent_id: category.id,
          aname: addAName,
          lname: addLName,
          note: addNote,
          fields: addSelectedFields,
        })
    
        if (result.status) {
        // Narrow the type: check if 'data' exists inside result.data
        if ("data" in result.data) {
            const newCategory = result.data.data as Category;
    
            setSubCategories((prev) => [...prev, newCategory]);
            setAddAName("");
            setAddLName("");
            setAddNote("");
            setAddSelectedFields(["aname", "lname"]);
            setIsAddDialogOpen(false);
            toast.success("تمت الإضافة بنجاح");
        }
        } else {
            const errorData = result.data as ValidationErrorResponse;
            setErrors(errorData.errors || {});
            toast.error("حدث خطأ أثناء الإضافة");
        }
    
    
        setLoadingCreate(false)
      }



      const handleEdit = async (e: FormEvent) => {
        e.preventDefault()
        setLoadingCreate(true)
        setErrors({})
        
        console.log({
            parent_id: category.id,
            aname,
            lname,
            note,
            fields: selectedFields,
        })

        const result = await editCategory(category.id as number,{
            parent_id: category.id,
            aname,
            lname,
            note,
            fields: selectedFields,
        })

        console.log(result)
    
        if (result.status) {
        // Narrow the type: check if 'data' exists inside result.data
    
            setCategory((prev) =>
            prev
                ? { ...prev, aname, lname, note, fields: selectedFields }
                : prev
            );
            setIsEditDialogOpen(false);
            toast.success("تمت التعديل بنجاح");
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
            <div className="space-y-6">
      {/* === Top Card with Info + Edit/Delete === */}
      <Card className="shadow-sm border m-4">
        <CardHeader className="flex justify-between items-center flex-row">
          <CardTitle className="text-xl font-bold">
            {category.aname || "-"}
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
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-1" /> حذف
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">الاسم بالإنجليزية</p>
            <p className="font-medium">{category.lname || "-"}</p>
          </div>

          <Separator />

          <div>
            <p className="text-sm text-muted-foreground">الملاحظات</p>
            <p className="font-medium">{category.note || "-"}</p>
          </div>

          <Separator />

          <div>
            <p className="text-sm text-muted-foreground">الحقول</p>
            <p className="font-medium">
            {category.fields && category.fields.length > 0
                ? category.fields
                    .map(
                    (field) =>
                        fieldOptions.find((opt) => opt.value === field)?.label || field
                    )
                    .join("، ") // Arabic comma
                : "-"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* === Subcategories Section === */}
      <div className="flex justify-between items-center mt-6 m-4">
        <h2 className="font-semibold text-lg">التصنيفات الفرعية</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> إضافة تصنيف فرعي
        </Button>
      </div>
        <Card className="m-4 overflow-x-auto">
            <CardContent className="p-0">
                <div className="overflow-x-auto w-full">
                    <Table className="min-w-[800px]">
                        <TableHeader>
                        <TableRow>
                            <TableHead>الاسم بالعربية</TableHead>
                            <TableHead>الاسم بالإنجليزية</TableHead>
                            <TableHead>حقول</TableHead>
                            <TableHead>الملاحظات</TableHead>
                            <TableHead>الإجراءات</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {subCategories.length ? (
                            subCategories.map((sub) => (
                            <TableRow key={sub.id}>
                                <TableCell className="break-words whitespace-normal">{sub.aname || "-"}</TableCell>
                                <TableCell className="break-words whitespace-normal">{sub.lname || "-"}</TableCell>
                                <TableCell className="break-words whitespace-normal">
                                {sub.fields && sub.fields.length > 0
                                    ? sub.fields
                                        .map(
                                        (field) =>
                                            fieldOptions.find((opt) => opt.value === field)?.label || field
                                        )
                                        .join("، ")
                                    : "-"}
                                </TableCell>
                                <TableCell className="break-words">{sub.note || "-"}</TableCell>
                                <TableCell>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="ml-2"
                                    onClick={() => router.push(`/categories/${sub.id}`)}
                                >
                                    عرض
                                </Button>
                                </TableCell>
                            </TableRow>
                            ))
                        ) : (
                            <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                                لا توجد تصنيفات فرعية بعد
                            </TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>


      

      {/* === Edit Dialog === */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                {/* <DialogTrigger asChild>
                  <Button onClick={() => setIsDialogOpen(true)}>إضافة تصنيف</Button>
                </DialogTrigger> */}
                <DialogContent className="sm:max-w-[800px]" dir="rtl">
                  <form onSubmit={handleEdit}>
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

              {/* === Add Sub category Dialog === */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                {/* <DialogTrigger asChild>
                  <Button onClick={() => setIsDialogOpen(true)}>إضافة تصنيف</Button>
                </DialogTrigger> */}
                <DialogContent className="sm:max-w-[800px]" dir="rtl">
                  <form onSubmit={handleCreate}>
                    <DialogHeader>
                      <DialogTitle>إضافة تصنيف جديد</DialogTitle>
                      <DialogDescription>أدخل تفاصيل التصنيف الجديد</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="aname" className="mb-2">الاسم بالعربية</Label>
                        <Input id="aname" value={addAName} onChange={(e) => setAddAName(e.target.value)} />
                        {errors.aname && (
                          <p className="text-sm text-red-600 mt-1">{errors.aname.join(", ")}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="lname" className="mb-2">الاسم بالإنجليزية</Label>
                        <Input id="lname" value={addLName} onChange={(e) => setAddLName(e.target.value)} />
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
                                      : addSelectedFields.includes(field.value as CategoryItemField)
                                  }
                                  disabled={isFixed}
                                  onCheckedChange={() => {
                                    if (!isFixed) toggleAddField(field.value as CategoryItemField)
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
                          value={addNote}
                          onChange={(e) => setAddNote(e.target.value)}
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
     
    </div>
</SidebarInset>
</SidebarProvider>
    
  );
}
