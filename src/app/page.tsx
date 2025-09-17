"use client"

import { checkAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    async function redirectIfAuthenticated() {
      try {
        const user = await checkAuth();
        if (user) {
          router.push("/dashboard");
        }else{
          router.push("/login");
        }
      } catch(err) {
        console.log("the error is => " + err)
      }
    }

    redirectIfAuthenticated();
  }, []);
  return (
    <>
     <div className="text-center h-screen w-[100%] flex items-center justify-center">
      <p>... جاري التحميل</p>
    </div>
    </>
  );
}
