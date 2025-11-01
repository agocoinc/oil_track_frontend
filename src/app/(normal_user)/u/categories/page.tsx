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
import { Category, fetchCategories, fetchCategoriesNormal } from "@/lib/categories";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function CompanyDetailsPage() {
//   const { id } = useParams<{ id: string }>();
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
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [loadingCreate, setLoadingCreate] = useState(false)



useEffect(() => {
  const init = async () => {
    

    try {
      const res = await fetchCategoriesNormal(); // pass search

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
    setLoading(false)
  };

  init();
}, []);

  

  
  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );


    const handleCreate = () => {}

  

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

        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
