import { UserRole } from './auth.types';
export interface User {
    id: string;
    tenantId: string;
    email: string;
    fullName: string;
    role: UserRole;
    phone?: string;
    avatarUrl?: string;
    isActive: boolean;
    lastLoginAt?: string;
    createdAt: string;
    updatedAt: string;
}
export interface UpdateUserDto {
    fullName?: string;
    phone?: string;
    avatarUrl?: string;
}
export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
