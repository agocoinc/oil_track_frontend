import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"


export default function Page() {
  // Placeholder arrays جاهزة للربط لاحقًا
  const companies: Array<{ name: string; location: string; employees: number; activity: string }> = []
  const equipments: Array<{ name: string; type: string; status: string; location: string }> = []

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
        <div className="flex flex-1 flex-col px-4 py-6 space-y-12">

          {/* Companies Table */}
          <div className="flex flex-col gap-4">
           
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full table-auto border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border-b text-left">الاسم</th>
                    <th className="px-4 py-2 border-b text-left">الموقع</th>
                    <th className="px-4 py-2 border-b text-left">عدد الموظفين</th>
                    <th className="px-4 py-2 border-b text-left">نشاط الشركة</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-2 text-center text-gray-400">
                        لا توجد بيانات حاليا
                      </td>
                    </tr>
                  ) : (
                    companies.map((company, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm border-b">{company.name}</td>
                        <td className="px-4 py-2 text-sm border-b">{company.location}</td>
                        <td className="px-4 py-2 text-sm border-b">{company.employees}</td>
                        <td className="px-4 py-2 text-sm border-b">{company.activity}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Equipments Table */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">المعدات</h2>
              
            </div>
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full table-auto border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border-b text-left">الاسم</th>
                    <th className="px-4 py-2 border-b text-left">النوع</th>
                    <th className="px-4 py-2 border-b text-left">الحالة</th>
                    <th className="px-4 py-2 border-b text-left">الموقع</th>
                  </tr>
                </thead>
                <tbody>
                  {equipments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-2 text-center text-gray-400">
                        لا توجد بيانات حاليا
                      </td>
                    </tr>
                  ) : (
                    equipments.map((equipment, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm border-b">{equipment.name}</td>
                        <td className="px-4 py-2 text-sm border-b">{equipment.type}</td>
                        <td className="px-4 py-2 text-sm border-b">{equipment.status}</td>
                        <td className="px-4 py-2 text-sm border-b">{equipment.location}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
