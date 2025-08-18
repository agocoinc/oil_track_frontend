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
import React from "react"

export interface Company {
  id: number
  name: string
  arabicName: string
}

interface SheetAddCompanyProps {
  onAdd: (company: Company) => void
}

export function SheetAddCompany({ onAdd }: SheetAddCompanyProps) {
  const [name, setName] = React.useState("")
  const [arabicName, setArabicName] = React.useState("")

  const handleSave = () => {
    if (!name.trim() || !arabicName.trim()) return

    const newCompany: Company = {
      id: Date.now(),
      name,
      arabicName,
    }

    onAdd(newCompany)
    setName("")
    setArabicName("")
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">إضافة شركة</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>إضافة شركة جديدة</SheetTitle>
          <SheetDescription>املأ البيانات أدناه ثم اضغط حفظ.</SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 px-4">
          <div className="grid gap-2">
            <Label htmlFor="company-name">الاسم بالإنجليزية</Label>
            <Input
              id="company-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company-aname">الاسم بالعربية</Label>
            <Input
              id="company-aname"
              value={arabicName}
              onChange={(e) => setArabicName(e.target.value)}
            />
          </div>
        </div>

        <SheetFooter>
          <Button type="button" onClick={handleSave}>
            حفظ
          </Button>
          <SheetClose asChild>
            <Button variant="outline">إغلاق</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
