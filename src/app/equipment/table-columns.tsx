"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Equipment = {
  id: string
  name: string
  category: string
  status: string
}

export const equipmentColumns: ColumnDef<Equipment>[] = [
  { accessorKey: "name", header: "اسم المعدة" },
  { accessorKey: "category", header: "الفئة" },
  { accessorKey: "status", header: "الحالة" },
  {
    id: "actions",
    header: "الإجراءات",
    cell: ({ row }) => {
      const equipment = row.original
      return (
        <div className="flex gap-2">
          <button
            onClick={() => alert(`تعديل: ${equipment.name}`)}
            className="text-blue-500"
          >
            تعديل
          </button>
          <button
            onClick={() => alert(`حذف: ${equipment.name}`)}
            className="text-red-500"
          >
            حذف
          </button>
        </div>
      )
    },
  },
]
