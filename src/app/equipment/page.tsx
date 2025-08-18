"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

interface Company {
  id: number
  name: string
  arabicName: string
}

const initialCompanies: Company[] = [
  { id: 1, name: "ABC Corp", arabicName: "شركة أ ب ج" },
  { id: 2, name: "XYZ Ltd", arabicName: "شركة إكس واي زد" },
  { id: 3, name: "Tech Solutions", arabicName: "حلول التقنية" },
]

interface Equipment {
  id: number
  name: string
  description: string
  companyId: number
}

const initialEquipment: Equipment[] = [
  { id: 1, name: "Laptop", description: "حاسوب محمول", companyId: 1 },
  { id: 2, name: "Printer", description: "طابعة", companyId: 2 },
]

const columns: ColumnDef<Equipment>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "اسم المعدات" },
  { accessorKey: "description", header: "الوصف" },
  { 
    accessorFn: (row) => initialCompanies.find(c => c.id === row.companyId)?.arabicName || "-", 
    id: "company",
    header: "الشركة"
  },
]

interface EquipmentDataTableProps {
  equipment: Equipment[]
  onEdit: (item: Equipment) => void
  onDelete: (id: number) => void
  searchQuery: string
}

function EquipmentDataTable({ equipment, onEdit, onDelete, searchQuery }: EquipmentDataTableProps) {
  const filtered = equipment.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.description.includes(searchQuery)
  )

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
                <TableCell className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit(row.original)}>تعديل</Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete(row.original.id)}>حذف</Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                لا توجد معدات
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default function EquipmentPage() {
  const [equipment, setEquipment] = React.useState<Equipment[]>(initialEquipment)
  const [newItem, setNewItem] = React.useState({ name: "", description: "", companyId: 0 })
  const [searchQuery, setSearchQuery] = React.useState("")
  const [editItem, setEditItem] = React.useState<Equipment | null>(null)

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItem.name.trim() || !newItem.description.trim() || !newItem.companyId) return
    const id = equipment.length ? equipment[equipment.length - 1].id + 1 : 1
    setEquipment([...equipment, { id, ...newItem }])
    setNewItem({ name: "", description: "", companyId: 0 })
  }

  const handleEdit = (item: Equipment) => setEditItem(item)

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editItem) return
    setEquipment(equipment.map(i => i.id === editItem.id ? editItem : i))
    setEditItem(null)
  }

  const handleDelete = (id: number) => setEquipment(equipment.filter(i => i.id !== id))

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-6 gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">قائمة المعدات</h1>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default">إضافة معدات</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleAdd}>
                  <DialogHeader>
                    <DialogTitle>إضافة معدات جديدة</DialogTitle>
                    <DialogDescription>أدخل بيانات المعدات ثم اضغط حفظ.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">اسم المعدات</Label>
                      <Input id="name" value={newItem.name} onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))}/>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">الوصف</Label>
                      <Input id="description" value={newItem.description} onChange={e => setNewItem(prev => ({ ...prev, description: e.target.value }))}/>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="company">اختر الشركة</Label>
                      <select
                        id="company"
                        value={newItem.companyId || ""}
                        onChange={e => setNewItem(prev => ({ ...prev, companyId: Number(e.target.value) }))}
                        className="input"
                        required
                      >
                        <option value="">اختر الشركة</option>
                        {initialCompanies.map(c => (
                          <option key={c.id} value={c.id}>{c.arabicName}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">إلغاء</Button>
                    </DialogClose>
                    <Button type="submit">حفظ</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Input placeholder="بحث سريع..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />

          <EquipmentDataTable
            equipment={equipment}
            searchQuery={searchQuery}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {editItem && (
            <Dialog open={true} onOpenChange={open => !open && setEditItem(null)}>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSaveEdit}>
                  <DialogHeader>
                    <DialogTitle>تعديل المعدات</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="editName">اسم المعدات</Label>
                      <Input id="editName" value={editItem.name} onChange={e => setEditItem(prev => prev ? { ...prev, name: e.target.value } : null)}/>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="editDescription">الوصف</Label>
                      <Input id="editDescription" value={editItem.description} onChange={e => setEditItem(prev => prev ? { ...prev, description: e.target.value } : null)}/>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="editCompany">اختر الشركة</Label>
                      <select
                        id="editCompany"
                        value={editItem.companyId || ""}
                        onChange={e => setEditItem(prev => prev ? { ...prev, companyId: Number(e.target.value) } : null)}
                        className="input"
                        required
                      >
                        <option value="">اختر الشركة</option>
                        {initialCompanies.map(c => (
                          <option key={c.id} value={c.id}>{c.arabicName}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">إلغاء</Button>
                    </DialogClose>
                    <Button type="submit">حفظ التعديلات</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}

        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
