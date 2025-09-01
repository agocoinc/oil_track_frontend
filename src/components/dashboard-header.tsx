// src/components/DashboardHeader.tsx
"use client"

import * as React from "react"

interface DashboardHeaderProps {
  title: string
  description?: string
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
      {description && <p className="text-gray-500 mt-1">{description}</p>}
    </div>
  )
}
