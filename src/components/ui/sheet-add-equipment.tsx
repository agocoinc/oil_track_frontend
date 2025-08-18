"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function SheetAddEquipment() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">إضافة معدة</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>إضافة معدة جديدة</SheetTitle>
          <SheetDescription>
            أدخل بيانات المعدة الجديدة. اضغط حفظ عند الانتهاء.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="equipment-name-ar">الاسم بالعربية</Label>
            <Input id="equipment-name-ar" placeholder="مثال: مضخة كهربائية" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="equipment-name-en">الاسم بالإنجليزية</Label>
            <Input id="equipment-name-en" placeholder="Example: Electric Pump" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="equipment-qty">الكمية</Label>
            <Input id="equipment-qty" type="number" placeholder="مثال: 10" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="equipment-location">الموقع</Label>
            <Input id="equipment-location" placeholder="مثال: المخزن الرئيسي" />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">حفظ</Button>
          <SheetClose asChild>
            <Button variant="outline">إغلاق</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
