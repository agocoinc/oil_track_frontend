"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Company } from "@/types"

interface CompanySheetProps {
  initialData?: Company
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (company: Company) => void
}

export default function CompanySheet({ initialData, open, onOpenChange, onSuccess }: CompanySheetProps) {
  const [name, setName] = React.useState(initialData?.name || "")
  const [arabicName, setArabicName] = React.useState(initialData?.arabicName || "")
  const [logoUrl, setLogoUrl] = React.useState<string | undefined>(initialData?.logoUrl)

  React.useEffect(() => {
    setName(initialData?.name || "")
    setArabicName(initialData?.arabicName || "")
    setLogoUrl(initialData?.logoUrl)
  }, [initialData])

  const handleSave = () => {
    const company: Company = {
      id: initialData?.id || Date.now().toString(),
      name,
      arabicName,
      logoUrl: logoUrl || "",
    }
    onSuccess(company)
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setLogoUrl(URL.createObjectURL(e.target.files[0]))
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{initialData ? "تعديل الشركة" : "إضافة شركة"}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          <Label htmlFor="companyNameEn">اسم الشركة بالإنجليزية</Label>
          <Input id="companyNameEn" value={name} onChange={e => setName(e.target.value)} />

          <Label htmlFor="companyNameAr">اسم الشركة بالعربية</Label>
          <Input id="companyNameAr" value={arabicName} onChange={e => setArabicName(e.target.value)} />

          <Label htmlFor="companyLogo">شعار الشركة</Label>
          <Input id="companyLogo" type="file" accept="image/*" onChange={handleLogoChange} />
          {logoUrl && (
            <div className="relative w-32 h-32 mt-2">
              <Image src={logoUrl} alt="Logo Preview" fill className="object-contain rounded-md" />
            </div>
          )}
        </div>

        <SheetFooter className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
          <Button onClick={handleSave}>{initialData ? "حفظ" : "إضافة"}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
