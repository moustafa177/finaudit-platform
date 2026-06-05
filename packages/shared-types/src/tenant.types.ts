export enum TenantPlan {
  FREE = 'free',
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

export enum TenantStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  TRIAL = 'trial',
}

export enum BusinessType {
  RETAIL = 'retail',
  MANUFACTURING = 'manufacturing',
  B2B_SERVICES = 'b2b_services',
  MIXED = 'mixed',
}

export interface Tenant {
  id: string
  name: string
  crNumber: string
  vatNumber: string
  plan: TenantPlan
  status: TenantStatus
  businessType: BusinessType
  logoUrl?: string
  address?: TenantAddress
  createdAt: string
  updatedAt: string
}

export interface TenantAddress {
  street: string
  city: string
  region: string
  postalCode: string
  country: string
}
