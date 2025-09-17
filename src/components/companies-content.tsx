// "use client"

// import { useState } from "react"
// import useSWR from "swr"
// import { toast } from "sonner"
// import { Button } from "@/components/ui/button"
// import { CompanySheet } from "@/components/sheets/companysheet"
// import { Company } from "@/types"

// import { CompanyList } from "./company-list"
// import { LoadingState } from "./loading-state"
// import { EmptyState } from "./empty-state"
// import { ErrorMessage } from "./error-message"

// const fetcher = (url: string) => fetch(url).then(res => res.json())
// const COMPANIES_API_URL = "/api/companies"

// export function CompaniesContent() {
//   const [sheetOpen, setSheetOpen] = useState(false)
//   const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)

//   const { data: companies, error, isLoading, mutate } = useSWR<Company[]>(
//     COMPANIES_API_URL,
//     fetcher,
//     { onError: () => toast.error("فشل جلب بيانات الشركات") }
//   )

//   const handleSuccess = () => {
//     toast.success("تم حفظ التغييرات")
//     setSheetOpen(false)
//     setSelectedCompany(null)
//     mutate()
//   }

//   const handleEdit = (company: Company) => {
//     setSelectedCompany(company)
//     setSheetOpen(true)
//   }

//   const handleAdd = () => {
//     setSelectedCompany(null)
//     setSheetOpen(true)
//   }

//   const handleCloseSheet = () => {
//     setSheetOpen(false)
//     setSelectedCompany(null)
//   }

//   let content

//   if (isLoading) content = <LoadingState />
//   else if (error || !companies) content = <ErrorMessage />
//   else if (companies.length === 0) content = <EmptyState handleAdd={handleAdd} />
//   else content = <CompanyList companies={companies} onEdit={handleEdit} />

//   return (
//     <div className="flex flex-1 flex-col px-6 py-8 space-y-8 bg-gray-100 dark:bg-gray-950">
//       <div className="flex justify-between items-center">
//         <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
//           الشركات 🏢
//         </h1>
//         <Button onClick={handleAdd}>إضافة شركة جديدة</Button>
//       </div>

//       {content}

//       <CompanySheet
//         initialData={selectedCompany || undefined}
//         open={sheetOpen}
//         onOpenChange={handleCloseSheet}
//         onSuccess={handleSuccess}
//       />
//     </div>
//   )
// }
