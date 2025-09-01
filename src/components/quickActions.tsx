// src/components/QuickActions.tsx
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"

export function QuickActions() {
  return (
    <div className="flex gap-4 flex-wrap">
      <Button variant="default">إضافة شركة</Button>
      <Button variant="default">إضافة معدات</Button>
      <Button variant="default">إضافة تراخيص</Button>
      <Button variant="default">تقارير</Button>
    </div>
  )
}
