// src/components/ui/sheet-add-all.tsx
"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm, Controller } from "react-hook-form"

export function AddAllSheet() {
  const [open, setOpen] = React.useState(false)

  const companyForm = useForm({
    defaultValues: { name: "", location: "", employees: "", activity: "", type: "" },
  })

  const equipmentForm = useForm({
    defaultValues: { name: "", type: "", status: "", location: "" },
  })

  const licenseForm = useForm({
    defaultValues: { licenseName: "", expiration: "" },
  })

  const structureForm = useForm({
    defaultValues: { department: "", units: "", coordinators: "", sections: "" },
  })

  const handleSubmit = () => {
    console.log("شركة:", companyForm.getValues())
    console.log("معدات:", equipmentForm.getValues())
    console.log("تراخيص:", licenseForm.getValues())
    console.log("هيكلية:", structureForm.getValues())
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">إضافة بيانات كاملة</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[600px]">
        <SheetHeader>
          <SheetTitle>إضافة بيانات الشركة</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="company" className="space-y-4">
          <TabsList>
            <TabsTrigger value="company">الشركة</TabsTrigger>
            <TabsTrigger value="equipment">المعدات</TabsTrigger>
            <TabsTrigger value="licenses">التراخيص</TabsTrigger>
            <TabsTrigger value="structure">الهيكلية</TabsTrigger>
          </TabsList>

          {/* تبويب الشركة */}
          <TabsContent value="company">
            <form className="space-y-4">
              <Controller
                name="name"
                control={companyForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم الشركة</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="أدخل اسم الشركة" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Controller
                name="location"
                control={companyForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الموقع</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="مثال: طرابلس" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Controller
                name="employees"
                control={companyForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عدد الموظفين</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="مثال: 120" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Controller
                name="activity"
                control={companyForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نشاط الشركة</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="مثال: النفط والغاز" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Controller
                name="type"
                control={companyForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع الشركة</FormLabel>
                    <Select {...field}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع الشركة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="نفط">نفط</SelectItem>
                        <SelectItem value="غاز">غاز</SelectItem>
                        <SelectItem value="تقنية">تقنية</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </form>
          </TabsContent>

          {/* تبويب المعدات */}
          <TabsContent value="equipment">
            <form className="space-y-4">
              <Controller
                name="name"
                control={equipmentForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المعدة</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="مثال: مضخة نفط" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Controller
                name="type"
                control={equipmentForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع المعدة</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ميكانيكي / كهربائي" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Controller
                name="status"
                control={equipmentForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الحالة</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="جاهز / قيد الصيانة" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Controller
                name="location"
                control={equipmentForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الموقع</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="المخزن / الوحدة الشمالية" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </TabsContent>

          {/* تبويب التراخيص */}
          <TabsContent value="licenses">
            <form className="space-y-4">
              <Controller
                name="licenseName"
                control={licenseForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم الترخيص</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="مثال: ISO9001" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Controller
                name="expiration"
                control={licenseForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاريخ الانتهاء</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </TabsContent>

          {/* تبويب الهيكلية */}
          <TabsContent value="structure">
            <form className="space-y-4">
              <Controller
                name="department"
                control={structureForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الإدارة</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="مثال: إدارة تقنية المعلومات" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Controller
                name="units"
                control={structureForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عدد الوحدات</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="مثال: 3" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Controller
                name="coordinators"
                control={structureForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عدد المنسقات</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="مثال: 2" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Controller
                name="sections"
                control={structureForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عدد الأقسام</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="مثال: 5" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </TabsContent>
        </Tabs>

        <Button onClick={handleSubmit} className="w-full mt-4">
          حفظ كل البيانات
        </Button>
      </SheetContent>
    </Sheet>
  )
}
