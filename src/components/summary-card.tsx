// src/components/SummaryCard.tsx
"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface SummaryCardProps {
  title: string
  value: string | number
}

export function SummaryCard({ title, value }: SummaryCardProps) {
  return (
    <Card className="p-4 w-full sm:w-1/3">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}
