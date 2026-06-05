export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  companyName: string
  crNumber: string
  vatNumber: string
  email: string
  password: string
  fullName: string
  phone?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface JwtPayload {
  sub: string
  email: string
  tenantId: string
  role: UserRole
  iat?: number
  exp?: number
}

export enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  ACCOUNTANT = 'accountant',
  VIEWER = 'viewer',
}
