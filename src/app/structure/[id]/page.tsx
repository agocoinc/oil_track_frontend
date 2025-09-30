"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, use } from "react";
import { checkAuth } from "@/lib/auth";
import { getCompanyStructure, storeCompanyStructure } from "@/lib/companies"; // store API
import type { OrganizationType } from "@/components/organization";

// Assuming you have these dialog and UI components
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const OrgChart = dynamic(() => import("@/components/organization"), {
  ssr: false,
});

export default function Structure({ params }: { params: Promise<{ id: string }> }) {
  const {id: companyId} = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  // const companyId = searchParams.get("id");

  const [organization, setOrganization] = useState<OrganizationType | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState(""); // JSON string to edit in textarea
  const [saving, setSaving] = useState(false);

  // Example admin check, replace with your actual logic
  const checkAdmin = true; // or false to hide modal trigger

  useEffect(() => {
    async function redirectIfAuthenticated() {
      try {
        const user = await checkAuth();
        if (!user) {
          router.push("/login");
          return;
        }
      } catch (err) {
        console.error("the error is => " + err);
      }
    }

    async function loadStructure(id: string) {
      setLoading(true);
      try {
        const result = await getCompanyStructure(id);
        if (result.status) {
          setOrganization(result.data);
          setJsonInput(JSON.stringify(result.data, null, 2)); // pretty print JSON
        } else {
          setOrganization(null);
          setJsonInput("{}");
        }
      } catch (error) {
        console.error("Failed to fetch structure:", error);
        setOrganization(null);
        setJsonInput("{}");
      } finally {
        setLoading(false);
      }
    }

    redirectIfAuthenticated();

    if (companyId) {
      loadStructure(companyId);
    } else {
      setLoading(false);
      setOrganization(null);
      setJsonInput("{}");
    }
  }, [companyId, router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    // Validate JSON before saving
    let parsed;
    try {
      parsed = JSON.parse(jsonInput);
    } catch {
      toast.error("تنسيق JSON غير صالح. يرجى التحقق من الإدخال."); // Invalid JSON format message in Arabic
      return;
    }

    setSaving(true);
    try {
      console.log("saving>>>", companyId)
      const result = await storeCompanyStructure(companyId!, parsed); // Assuming API accepts parsed JSON object
      if (result.status) {
        toast.error("تم حفظ البنية التنظيمية بنجاح");
        setOrganization(parsed);
        setIsModalOpen(false);
      } else {
        toast.error("فشل في حفظ البنية التنظيمية");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الحفظ");
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-center h-screen w-[100%] flex items-center justify-center">
      <p>... جاري التحميل</p>
    </div>;
  }

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
        <Button onClick={() => router.push("/companies")} className="cursor-pointer">
          العودة إلى صفحة الشركات
        </Button>

        {checkAdmin && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white cursor-pointer">
                تعديل / حفظ البنية التنظيمية
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px]" dir="rtl">
              <form onSubmit={handleSave}>
                <DialogHeader>
                  <DialogTitle>تعديل البنية التنظيمية</DialogTitle>
                  <DialogDescription className="text-right">
                    قم بتحرير البيانات بصيغة JSON أدناه ثم اضغط حفظ.
                  </DialogDescription>
                </DialogHeader>

                <textarea
                  rows={15}
                  className="w-full border rounded-md p-2 font-mono text-sm"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  dir="ltr"
                />

                <DialogFooter className="mt-4 flex justify-between">
                  <DialogClose asChild>
                    <Button variant="outline">إلغاء</Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-green-600 text-white cursor-pointer"
                  >
                    {saving ? "جاري الحفظ..." : "حفظ"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {organization ? (
        <OrgChart data={organization} />
      ) : (
        <div className="flex items-center justify-center h-[calc(100vh-64px)] p-6 text-center text-gray-500">
          لا توجد بنية تنظيمية متاحة لهذه الشركة
        </div>

      )}
    </div>
  );
}
