// "use client"

// import * as React from "react"
// import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"
// import Image from "next/image"
// import { License } from "@/types/detail"

// interface LicenseSheetProps {
//   initialData?: License
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   onSuccess: (license: License) => void
// }

// export default function LicenseSheet({ initialData, open, onOpenChange, onSuccess }: LicenseSheetProps) {
//   const [name, setName] = React.useState(initialData?.name || "")
//   const [imageUrl, setImageUrl] = React.useState<string | undefined>(initialData?.imageUrl)

//   React.useEffect(() => {
//     setName(initialData?.name || "")
//     setImageUrl(initialData?.imageUrl)
//   }, [initialData])

//   const handleSave = () => {
//     const license: License = {
//       id: initialData?.id || Date.now().toString(),
//       name,
//       imageUrl: imageUrl || "",
//     }
//     onSuccess(license)
//   }

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       setImageUrl(URL.createObjectURL(e.target.files[0]))
//     }
//   }

//   return (
//     <Sheet open={open} onOpenChange={onOpenChange}>
//       <SheetContent className="w-[400px] sm:w-[540px]">
//         <SheetHeader>
//           <SheetTitle>{initialData ? "تعديل الترخيص" : "إضافة ترخيص"}</SheetTitle>
//         </SheetHeader>

//         <div className="space-y-4">
//           <Label htmlFor="licenseName">اسم الترخيص</Label>
//           <Input id="licenseName" value={name} onChange={e => setName(e.target.value)} />

//           <Label htmlFor="licenseImage">صورة الترخيص</Label>
//           <Input id="licenseImage" type="file" accept="image/*" onChange={handleImageChange} />
//           {imageUrl && (
//             <div className="relative w-32 h-32 mt-2">
//               <Image src={imageUrl} alt="License Preview" fill className="object-contain rounded-md" />
//             </div>
//           )}
//         </div>

//         <SheetFooter className="flex justify-end gap-2 mt-4">
//           <Button variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
//           <Button onClick={handleSave}>{initialData ? "حفظ" : "إضافة"}</Button>
//         </SheetFooter>
//       </SheetContent>
//     </Sheet>
//   )
// }
