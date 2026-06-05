import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { TenantPlan, TenantStatus, BusinessType } from '@finaudit/shared-types'

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 255 })
  name: string

  @Column({ name: 'cr_number', length: 10, unique: true })
  crNumber: string

  @Column({ name: 'vat_number', length: 15, unique: true })
  vatNumber: string

  @Column({ type: 'enum', enum: TenantPlan, default: TenantPlan.FREE })
  plan: TenantPlan

  @Column({ type: 'enum', enum: TenantStatus, default: TenantStatus.TRIAL })
  status: TenantStatus

  @Column({ name: 'business_type', type: 'enum', enum: BusinessType, default: BusinessType.MIXED })
  businessType: BusinessType

  @Column({ name: 'logo_url', nullable: true })
  logoUrl?: string

  @Column({ type: 'jsonb', nullable: true })
  address?: {
    street: string
    city: string
    region: string
    postalCode: string
    country: string
  }

  @Column({ name: 'invoice_counter', default: 0 })
  invoiceCounter: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
