

import { GalleryVerticalEnd } from "lucide-react"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/lib/auth";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true)
    setError("");

    const data = await login(email, password)

    // if (data.status && data.data.token) {
    //   localStorage.setItem("token", data.data.token);

    //   console.log("Login successful, token stored");
    // } else {
    //   console.error("Login failed:", data.error);
    // }

    console.log(data)

    if (data.status) {
      
      router.push("/dashboard");
      // setLoading(false)
    } else {
      toast.error('حدث خطأ في بيانات تسجيل الدخول')
      setLoading(false)
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props} dir="rtl">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">المنظومة</span>
            </a>
            {/* <h1 className="text-xl font-bold">Welcome to Agoco zero.</h1> */}
            
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">الإيميل</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
             <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">كلمة المرور</Label>
                  
                </div>
                <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="****"
              />
              </div>

              {error && (
              <p className="text-sm text-red-500 font-medium -mt-4">{error}</p>
            )}
            <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
              {loading ? "جاري تسجيل الدخول ..." : "تسجيل الدخول"}
            </Button>
          </div>
          
          
        </div>
      </form>
      
    </div>
  )
}
