import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { UserRole } from '@finaudit/shared-types'
import { Tenant } from '../tenants/tenant.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'tenant_id' })
  tenantId: string

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant

  @Column({ unique: true, length: 255 })
  email: string

  @Column({ name: 'password_hash' })
  passwordHash: string

  @Column({ name: 'full_name', length: 255 })
  fullName: string

  @Column({ type: 'enum', enum: UserRole, default: UserRole.VIEWER })
  role: UserRole

  @Column({ nullable: true, length: 20 })
  phone?: string

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl?: string

  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @Column({ name: 'refresh_token_hash', nullable: true })
  refreshTokenHash?: string

  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt?: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
