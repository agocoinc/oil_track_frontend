"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, use } from "react";
import { checkAuth } from "@/lib/auth";
import { getCompanyStructureNormal, storeCompanyStructure } from "@/lib/companies"; // store API
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
import { useAuth } from "@/hooks/useAuth";

const OrgChart = dynamic(() => import("@/components/organization"), {
  ssr: false,
});

export default function Structure() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const companyId = searchParams.get("id");

  const [organization, setOrganization] = useState<OrganizationType | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState(""); // JSON string to edit in textarea
  const [saving, setSaving] = useState(false);
  const {user} = useAuth();

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
        const result = await getCompanyStructureNormal(id);
        console.log("Fetched structure:", result.data.data);
        if (result.status) {
          setOrganization(result.data.data);
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

    if (user?.company_id) {
      
      loadStructure(user.company_id.toString());
    } else {
      setLoading(false);
      setOrganization(null);
      setJsonInput("{}");
    }
  }, [user?.company_id, router]);

  

  if (loading) {
    return <div className="text-center h-screen w-[100%] flex items-center justify-center">
      <p>... جاري التحميل</p>
    </div>;
  }

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
        <Button onClick={() => router.push("/u/management-structure")} className="cursor-pointer">
          العودة إلى صفحة الشركات
        </Button>

        
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
