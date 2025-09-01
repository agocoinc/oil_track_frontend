"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { Equipment } from "@/types/equipment"

interface EquipmentSheetProps {
  initialData?: Equipment
  companyId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (equipment: Equipment) => void
}

export default function EquipmentSheet({
  initialData,
  companyId,
  open,
  onOpenChange,
  onSuccess,
}: EquipmentSheetProps) {
  const [name, setName] = React.useState(initialData?.name || "")
  const [serialNumber, setSerialNumber] = React.useState(initialData?.serialNumber || "")
  const [type, setType] = React.useState<"hardware" | "software">(initialData?.type || "hardware")
  const [imagePreview, setImagePreview] = React.useState<string | undefined>(initialData?.imageUrl)

  React.useEffect(() => {
    setName(initialData?.name || "")
    setSerialNumber(initialData?.serialNumber || "")
    setType(initialData?.type || "hardware")
    setImagePreview(initialData?.imageUrl)
  }, [initialData])

  const handleSave = () => {
    const equipment: Equipment = {
      id: initialData?.id || Date.now().toString(),
      name,
      serialNumber,
      type,
      companyId,
      imageUrl: imagePreview || "",
    }
    onSuccess(equipment)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImagePreview(URL.createObjectURL(e.target.files[0]))
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] space-y-6">
        <SheetHeader>
          <SheetTitle>{initialData ? "تعديل المعدة" : "إضافة معدة"}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="equipmentName">اسم المعدة</Label>
            <Input
              id="equipmentName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: جهاز قياس"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="serialNumber">الرقم التسلسلي</Label>
            <Input
              id="serialNumber"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder="مثال: SN123456"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="equipmentType">نوع المعدة</Label>
            <Select value={type} onValueChange={val => setType(val as "hardware" | "software")}>
              <SelectTrigger id="equipmentType">
                <SelectValue placeholder="اختر النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hardware">هاردوير</SelectItem>
                <SelectItem value="software">سوفتوير</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipmentImage">صورة المعدة</Label>
            <Input
              id="equipmentImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="relative w-32 h-32 mt-2">
                <Image
                  src={imagePreview}
                  alt="معاينة الصورة"
                  fill
                  className="object-contain rounded-md"
                />
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
          <Button onClick={handleSave}>{initialData ? "حفظ التعديلات" : "إضافة المعدة"}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
