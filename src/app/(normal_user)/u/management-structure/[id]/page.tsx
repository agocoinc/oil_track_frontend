"use client";

import * as React from "react";
import { useState, useEffect, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { isAdmin } from "@/lib/auth";
import { getCompanies } from "@/lib/companies";
import { fetchCompanyStructure, createStructureNode, deleteStructureNode, ValidationErrorResponse, fetchPublicManagement, fetchNodeWithChildren, ManagementStructureNode, ManagementStructureNodeChild } from "@/lib/structure";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type StructureNode = {
  id: number;
  parent_id: number | null;
  name: string;
  manager_name?: string | null;
  manager_photo?: string | null;
  category: string;
  children?: StructureNode[];
};

type Company = {
  id: number;
  aname: string;
  lname: string;
};

const CATEGORY_NAMES: Record<string, string> = {
  public_management: "الإدارة العامة",
  management_sector: "قطاع الإدارة",
  coordination: "منسقة",
  supervision: "الإشراف",
  department: "قسم",
  unit: "الوحدة",
};

const allowedChildCategories: Record<string, string[]> = {
  public_management: ["management_sector"],
  management_sector: ["coordination", "supervision"],
  coordination: ["department"],
  supervision: ["department"],
  department: ["unit"],
  unit: [], // no children
};




export default function CompanyStructurePage() {
    const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [mounted, setMounted] = useState(false);
  const [checkAdmin, setCheckAdmin] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [structure, setStructure] = useState<StructureNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errors, setErrors] = useState<{ name?: string[]; category?: string[] }>({});
  
  const [name, setName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [category, setCategory] = useState("public_management");
  const [parent, setParent] = useState<ManagementStructureNode | null>(null);
  const [managerPhoto, setManagerPhoto] = useState<File | null>(null);
  const parentCategory = parent?.category || "public_management";
    const childCategories = allowedChildCategories[parentCategory] || [];

  

  const {user} = useAuth();

useEffect(() => {
  const init = async () => {
    if (!user || !user.company_id) return;
    setMounted(true);
    const admin = await isAdmin();
    setCheckAdmin(admin);
    setLoading(true);

    try {
      const res = await fetchNodeWithChildren(Number(id));
      console.log("here =>>>", res);

      if (res.status && res.data) {
        // Get the children of the root node
        const rootChildren = res.data.children || [];
        setParent(res.data);
        
        // Determine allowed child categories
        const parentCategory = res.data.category; // e.g., "public_management"
        const childCategories = allowedChildCategories[parentCategory] || [];

        // Auto-select the category
        let initialCategory = "";
        if (childCategories.length > 0) {
            if (parentCategory === "public_management") {
            initialCategory = "management_sector"; // first allowed child
            } else if (parentCategory === "management_sector") {
            initialCategory = childCategories[0]; // "coordination" or "supervision"
            } else {
            initialCategory = childCategories[0];
            }
        }

        setCategory(initialCategory);
        // Recursively normalize parent_id in children
        const normalizeNode = (node: ManagementStructureNodeChild): StructureNode => ({
          ...node,
          parent_id: node.parent_id ?? null,
          children: node.children?.map(normalizeNode),
        });

        const normalized = rootChildren.map(normalizeNode);

        setStructure(normalized);
      } else {
        toast.error("فشل جلب الهيكل الإداري العام");
      }
    } catch (e) {
      console.error(e);
      toast.error("حدث خطأ أثناء تحميل البيانات");
    }

    setLoading(false);
  };

  init();
}, [user?.company_id, id]);




  if (!mounted) return null;

  const handleCreate = async (e: FormEvent) => {
    
    e.preventDefault();
    setLoadingCreate(true);
    setErrors({});

    const formData = new FormData();
    formData.append('parent_id', parent?.id ? parent.id.toString() : '');
    formData.append("name", name);
    formData.append("manager_name", managerName);
    formData.append("category", category);
    if (managerPhoto) {
    formData.append("manager_photo", managerPhoto);
    }

    const res = await createStructureNode(Number(user?.company_id), formData);

    if (res.status && "data" in res.data) {
      const newNode = res.data.data as StructureNode;
      setStructure((prev) => [...prev, newNode]);
      toast.success("تمت الإضافة بنجاح");
      setName("");
      setManagerName("");
      setCategory("");
      setIsDialogOpen(false);
    } else {
      const errorData = res.data as ValidationErrorResponse;
      setErrors(errorData.errors || {});
      toast.error("حدث خطأ أثناء الإضافة");
    }

    setLoadingCreate(false);
  };

  const handleDelete = async (nodeId: number) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;

    const res = await deleteStructureNode(Number(user?.company_id), nodeId);
    if (res.status) {
      setStructure((prev) => prev.filter((n) => n.id !== nodeId));
      toast.success("تم الحذف بنجاح");
    } else {
      toast.error("فشل حذف العنصر");
    }
  };

  return (
    <SidebarProvider dir="rtl">
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-6 gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">الهيكل الإداري للشركة</h1>
            <div>
              <Button onClick={() => router.back()} className="cursor-pointer ml-2">
              رجوع
            </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>إضافة عنصر</Button>
                </DialogTrigger>
                <DialogContent dir="rtl">
                  <form onSubmit={handleCreate}>
                    <DialogHeader>
                      <DialogTitle>إضافة عنصر جديد</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 mt-2">
                      <div>
                        <Label>اسم الإدارة</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                        {errors.name && <p className="text-sm text-red-600">{errors.name.join(", ")}</p>}
                      </div>

                      {childCategories.length > 1 && (
                        <div>
                            <Label htmlFor="category" className="mb-2">التصنيف</Label>

                            <Select
                            value={category}
                            onValueChange={(value) => setCategory(value)}
                            >
                            <SelectTrigger id="category" className="w-full">
                                <SelectValue placeholder="اختر التصنيف" />
                            </SelectTrigger>

                            <SelectContent>
                                {childCategories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {CATEGORY_NAMES[cat] || cat}
                                </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>

                            {errors.category && (
                            <p className="text-sm text-red-600 mt-1">{errors.category.join(", ")}</p>
                            )}
                        </div>
                        )}


                      <div>
                        <Label>اسم المدير</Label>
                        <Input value={managerName} onChange={(e) => setManagerName(e.target.value)} />
                      </div>

                      <div>
                        <Label>الصورة</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setManagerPhoto(e.target.files?.[0] || null)}
                        />
                        </div>

                    </div>

                    <DialogFooter className="mt-4">
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
              
          </div>
          <Card className="shadow-sm border m-4">
        <CardHeader className="flex justify-between items-center flex-row">
          <CardTitle className="text-xl font-bold">
            {parent?.name || "-"}
          </CardTitle>
         
        </CardHeader>

        
      </Card>

          <Card>
            <CardContent>
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mx-auto" />
              ) : (
                <Table dir="rtl">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الاسم</TableHead>
                      <TableHead className="text-right">المدير</TableHead>
                      <TableHead className="text-right">التصنيف</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {structure.length > 0 ? (
                      structure.map((node) => (
                        <TableRow key={node.id}>
                          <TableCell>{node.name}</TableCell>
                          <TableCell>{node.manager_name || "-"}</TableCell>
                          <TableCell>{CATEGORY_NAMES[node.category] || node.category}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(node.id)}
                            >
                              حذف
                            </Button>
                            {node.category !== "unit" && (
                                <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/u/management-structure/${node.id}`)}
                                className="mr-2"
                                >
                                عرض
                                </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500">
                          لا توجد عناصر في الهيكل الإداري
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
