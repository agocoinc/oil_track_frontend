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

const columns: ColumnDef<Company>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "الاسم بالإنجليزية" },
  { accessorKey: "arabicName", header: "الاسم بالعربية" },
]

interface CompanyDataTableProps {
  companies: Company[]
  onEdit: (company: Company) => void
  onDelete: (id: number) => void
  searchQuery: string
}

function CompanyDataTable({ companies, onEdit, onDelete, searchQuery }: CompanyDataTableProps) {
  const filteredCompanies = React.useMemo(() => 
    companies.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.arabicName.includes(searchQuery)
    )
  , [companies, searchQuery])

  const table = useReactTable({
    data: filteredCompanies,
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
                لا توجد شركات
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default function CompaniesPage() {
  const [companies, setCompanies] = React.useState<Company[]>(initialCompanies)
  const [newCompany, setNewCompany] = React.useState({ name: "", arabicName: "" })
  const [searchQuery, setSearchQuery] = React.useState("")
  const [editCompany, setEditCompany] = React.useState<Company | null>(null)

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCompany.name.trim() || !newCompany.arabicName.trim()) return
    const id = companies.length ? companies[companies.length - 1].id + 1 : 1
    setCompanies([...companies, { id, ...newCompany }])
    setNewCompany({ name: "", arabicName: "" })
  }

  const handleEditCompany = (company: Company) => setEditCompany(company)

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editCompany) return
    setCompanies(companies.map(c => c.id === editCompany.id ? editCompany : c))
    setEditCompany(null)
  }

  const handleDeleteCompany = (id: number) => {
    setCompanies(companies.filter(c => c.id !== id))
  }

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
            <h1 className="text-2xl font-bold">قائمة الشركات</h1>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default">إضافة شركة</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleAddCompany}>
                  <DialogHeader>
                    <DialogTitle>إضافة شركة جديدة</DialogTitle>
                    <DialogDescription>أدخل بيانات الشركة الجديدة ثم اضغط حفظ.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">الاسم بالإنجليزية</Label>
                      <Input
                        id="name"
                        value={newCompany.name}
                        onChange={e => setNewCompany(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="arabicName">الاسم بالعربية</Label>
                      <Input
                        id="arabicName"
                        value={newCompany.arabicName}
                        onChange={e => setNewCompany(prev => ({ ...prev, arabicName: e.target.value }))}
                      />
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

          <Input
            placeholder="بحث سريع..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />

          <CompanyDataTable
            companies={companies}
            searchQuery={searchQuery}
            onEdit={handleEditCompany}
            onDelete={handleDeleteCompany}
          />

          {editCompany && (
            <Dialog open={!!editCompany} onOpenChange={open => { if (!open) setEditCompany(null) }}>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSaveEdit}>
                  <DialogHeader>
                    <DialogTitle>تعديل الشركة</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="editName">الاسم بالإنجليزية</Label>
                      <Input
                        id="editName"
                        value={editCompany.name}
                        onChange={e => setEditCompany(prev => prev ? { ...prev, name: e.target.value } : null)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="editArabicName">الاسم بالعربية</Label>
                      <Input
                        id="editArabicName"
                        value={editCompany.arabicName}
                        onChange={e => setEditCompany(prev => prev ? { ...prev, arabicName: e.target.value } : null)}
                      />
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
