export interface Equipment {
  id: string
  name: string
  imageUrl?: string
  companyId: string   // ربط المعدة بالشركة
  type: 'hardware' | 'software'   // تصنيف المعدات
  status?: 'active' | 'inactive' | 'maintenance' // الحالة التشغيلية
  licenseStatus?: 'valid' | 'expired' | 'trial' // إذا كان Software
}
