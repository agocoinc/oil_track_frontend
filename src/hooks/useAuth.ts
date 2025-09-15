"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/lib/auth";

export function useAuth({ redirectIfNotAuthenticated = true } = {}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function authorize() {
      const userData = await checkAuth();
      if (userData) {
        setUser(userData);
      } else if (redirectIfNotAuthenticated) {
        router.push("/login");
      }
      setLoading(false);
    }

    authorize();
  }, []);

  return { user, loading };
}
