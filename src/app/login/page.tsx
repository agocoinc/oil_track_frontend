"use client"

import { LoginForm } from "@/components/login-form"
import { Skeleton } from "@/components/ui/skeleton";
import { checkAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  
  const router = useRouter();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function redirectIfAuthenticated() {
      try {
        const user = await checkAuth();
        if (user) {
          router.push("/dashboard");
        }
      } catch(err) {
        setLoading(false)
        console.log("the error is => " + err)
      }


      setLoading(false)
    }

    redirectIfAuthenticated();
  }, []);
  return (
    <>
    {loading ? <>
      <div className="text-center h-screen w-[100%] flex items-center justify-center">
      <p>... جاري التحميل</p>
    </div>
    </> : <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>}
    </>
    
  )
}
