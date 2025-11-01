"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUserById, deleteUser, updateUser, User, ValidationErrorResponse } from "@/lib/users";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Company, getCompanies } from "@/lib/companies";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [errors, setErrors] = useState<{ name?: string[]; email?: string[]; password?: string[] }>({});
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);

  // edit fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const res = await getUserById(Number(id));
        if (res.status && res.data) {
          const userData = res.data as User;
          setUser(userData);
          setName(userData.name || "");
          setEmail(userData.email || "");
          setPassword("");
          setSelectedCompany(userData.company_id || null);
        } else {
          toast.error("حدث خطأ أثناء جلب بيانات المستخدم");
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
      async function fetchCompanies() {
            try {
              const res = await getCompanies()
            
            if (res?.status) {
              console.log("all companies ", res.data.data)
              setCompanies(res.data.data)
            } else {
              
              toast.error("حدث خطأ أثناء جلب الشركات")
            }
      
            setLoading(false)
            } catch {
              toast.error("حدث خطأ ما")
              setLoading(false)
            }
          }
    
      fetchCompanies();
    }, []);

  const handleDelete = async () => {
    if (!user?.id) return;
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;

    setLoadingAction(true);
    const res = await deleteUser(user.id);
    if (res.status) {
      toast.success("تم حذف المستخدم بنجاح");
      router.back();
    } else toast.error("فشل حذف المستخدم");
    setLoadingAction(false);
  };

 const handleEdit = async (e: FormEvent) => {
  e.preventDefault();
  if (!user) return;

  setLoadingAction(true);
  setErrors({});

  const payload: Record<string, any> = {};

  // Only include fields if they have changed and are not empty
  if (name && name !== user.name) payload.name = name;
  if (email && email !== user.email) payload.email = email;
  if (password) payload.password = password; // only include if filled
  if (selectedCompany !== user.company_id) payload.company_id = selectedCompany;

  // If nothing changed, no need to send request
  if (Object.keys(payload).length === 0) {
    toast.info("لم يتم تغيير أي بيانات");
    setLoadingAction(false);
    return;
  }

  const result = await updateUser(user.id!, payload);

  if (result.status) {
    setUser((prev) => (prev ? { ...prev, ...payload } : prev));
    toast.success("تم تعديل المستخدم بنجاح");
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

  if (!user)
    return (
      <div className="text-center py-10 text-muted-foreground">
        لم يتم العثور على المستخدم
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
              <CardTitle className="text-xl font-bold">{user.name}</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setIsEditDialogOpen(true)}>
                  <Pencil className="w-4 h-4 mr-1" /> تعديل
                </Button>
                <Button size="sm" variant="destructive" onClick={handleDelete} disabled={loadingAction}>
                  <Trash2 className="w-4 h-4 mr-1" /> حذف
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                <p className="font-medium">{user.email || "-"}</p>
              </div>

              <Separator />

              {user.company_id && (
                <div>
                  <p className="text-sm text-muted-foreground">الشركة</p>
                  <p className="font-medium">
                    {(() => {
                        const company = companies.find((c) => c.id === user.company_id);
                        return company ? `${company.aname} / ${company.lname}` : "—";
                    })()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* === Edit Dialog === */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[600px]" dir="rtl">
              <form onSubmit={handleEdit}>
                <DialogHeader>
                  <DialogTitle>تعديل بيانات المستخدم</DialogTitle>
                  <DialogDescription>قم بتحديث معلومات المستخدم</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 mt-4">
                    <div>
                            <Label htmlFor="company" className="mb-2">الشركة</Label>

                            <Select
                            value={selectedCompany ? selectedCompany.toString() : ""}
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
                    <Label htmlFor="name">الاسم</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.join(", ")}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.join(", ")}</p>}
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
                  <Button type="submit" disabled={loadingAction}>
                    {loadingAction ? "جاري الحفظ..." : "حفظ"}
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
