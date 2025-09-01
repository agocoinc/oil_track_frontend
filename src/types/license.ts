// src/types/license.ts
export interface License {
  id: string
  name: string
  companyId: string    // مهم للربط بالشركة
  status: 'active' | 'expired' | 'inactive'   // للحالة
    type?: string 
}
