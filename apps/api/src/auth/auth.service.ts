import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcryptjs'
import { User } from '../users/user.entity'
import { Tenant } from '../tenants/tenant.entity'
import { RegisterDto, LoginDto, AuthTokens, JwtPayload, UserRole } from '@finaudit/shared-types'
import { validateVatNumber, validateCrNumber } from '@finaudit/zatca-validator'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Tenant) private tenantRepo: Repository<Tenant>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthTokens> {
    if (!validateVatNumber(dto.vatNumber)) {
      throw new BadRequestException('رقم الضريبة غير صحيح. يجب أن يكون 15 رقماً يبدأ وينتهي بـ 3')
    }
    if (!validateCrNumber(dto.crNumber)) {
      throw new BadRequestException('رقم السجل التجاري غير صحيح. يجب أن يكون 10 أرقام')
    }

    const existingUser = await this.userRepo.findOne({ where: { email: dto.email } })
    if (existingUser) throw new ConflictException('البريد الإلكتروني مسجل مسبقاً')

    const existingTenant = await this.tenantRepo.findOne({
      where: [{ vatNumber: dto.vatNumber }, { crNumber: dto.crNumber }],
    })
    if (existingTenant) throw new ConflictException('رقم الضريبة أو السجل التجاري مسجل مسبقاً')

    const tenant = this.tenantRepo.create({
      name: dto.companyName,
      crNumber: dto.crNumber,
      vatNumber: dto.vatNumber,
    })
    await this.tenantRepo.save(tenant)

    const passwordHash = await bcrypt.hash(dto.password, 12)
    const user = this.userRepo.create({
      tenantId: tenant.id,
      email: dto.email,
      fullName: dto.fullName,
      phone: dto.phone,
      passwordHash,
      role: UserRole.OWNER,
    })
    await this.userRepo.save(user)

    return this.generateTokens(user)
  }

  async login(dto: LoginDto): Promise<AuthTokens> {
    const user = await this.userRepo.findOne({ where: { email: dto.email, isActive: true } })
    if (!user) throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة')

    const isValid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!isValid) throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة')

    user.lastLoginAt = new Date()
    const tokens = await this.generateTokens(user)
    user.refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10)
    await this.userRepo.save(user)

    return tokens
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<AuthTokens> {
    const user = await this.userRepo.findOne({ where: { id: userId, isActive: true } })
    if (!user?.refreshTokenHash) throw new UnauthorizedException('انتهت صلاحية الجلسة')

    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash)
    if (!isValid) throw new UnauthorizedException('رمز التحديث غير صالح')

    const tokens = await this.generateTokens(user)
    user.refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10)
    await this.userRepo.save(user)
    return tokens
  }

  async logout(userId: string): Promise<void> {
    await this.userRepo.update(userId, { refreshTokenHash: undefined })
  }

  private async generateTokens(user: User): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ])

    return { accessToken, refreshToken, expiresIn: 900 }
  }
}
