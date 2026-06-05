import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { User } from './user.entity'
import { UpdateUserDto, ChangePasswordDto, UserRole } from '@finaudit/shared-types'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findAllByTenant(tenantId: string) {
    return this.userRepo.find({
      where: { tenantId },
      select: ['id', 'email', 'fullName', 'role', 'phone', 'avatarUrl', 'isActive', 'lastLoginAt', 'createdAt'],
    })
  }

  async findById(id: string, tenantId: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id, tenantId } })
    if (!user) throw new NotFoundException('المستخدم غير موجود')
    return user
  }

  async update(id: string, tenantId: string, dto: UpdateUserDto): Promise<User> {
    await this.findById(id, tenantId)
    await this.userRepo.update({ id, tenantId }, dto)
    return this.findById(id, tenantId)
  }

  async changePassword(id: string, tenantId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id, tenantId } })
    if (!user) throw new NotFoundException('المستخدم غير موجود')

    const isValid = await bcrypt.compare(dto.currentPassword, user.passwordHash)
    if (!isValid) throw new ForbiddenException('كلمة المرور الحالية غير صحيحة')

    const passwordHash = await bcrypt.hash(dto.newPassword, 12)
    await this.userRepo.update({ id, tenantId }, { passwordHash })
  }

  async inviteUser(tenantId: string, email: string, role: UserRole, fullName: string): Promise<User> {
    const tempPassword = Math.random().toString(36).slice(-8) + 'A1!'
    const passwordHash = await bcrypt.hash(tempPassword, 12)

    const user = this.userRepo.create({ tenantId, email, fullName, role, passwordHash })
    return this.userRepo.save(user)
  }

  async toggleActive(id: string, tenantId: string): Promise<void> {
    const user = await this.findById(id, tenantId)
    await this.userRepo.update({ id, tenantId }, { isActive: !user.isActive })
  }
}
