"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/lib/auth";

type User = {
  name: string;
  email: string;
  role: string;
  company_id?: number;
}

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
}

export function useAuth({ redirectIfNotAuthenticated = true } = {}): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);  // <-- typed here
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
