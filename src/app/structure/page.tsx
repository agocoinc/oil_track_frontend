"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function CompanyStructurePage() {
  // بيانات وهمية للأقسام
  const departments = [
    { name: "الإدارة المالية", units: 3, employees: 12 },
    { name: "إدارة الموارد البشرية", units: 2, employees: 8 },
    { name: "الإنتاج", units: 5, employees: 40 },
  ]

  return (
    <div className="px-6 py-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">الهيكلية الإدارية</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {departments.map((dep, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle>{dep.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>عدد الوحدات: {dep.units}</p>
              <p>عدد الموظفين: {dep.employees}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
