export interface ZatcaInvoiceData {
  sellerName: string
  vatNumber: string
  timestamp: string
  invoiceTotal: number
  vatTotal: number
  invoiceHash?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  code: string
  field: string
  message: string
  messageAr: string
}

export interface ValidationWarning {
  code: string
  field: string
  message: string
}

export interface TlvTag {
  tag: number
  value: string
}
