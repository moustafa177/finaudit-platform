import { Controller, Get, Patch, Post, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser, CurrentTenant } from '../common/decorators/tenant.decorator'
import { UpdateUserDto, ChangePasswordDto } from '@finaudit/shared-types'

@ApiTags('المستخدمون')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAll(@CurrentTenant() tenantId: string) {
    const users = await this.usersService.findAllByTenant(tenantId)
    return { success: true, data: users }
  }

  @Get('me')
  getMe(@CurrentUser() user: unknown) {
    return { success: true, data: user }
  }

  @Patch('me')
  async updateMe(@CurrentUser() user: { id: string; tenantId: string }, @Body() dto: UpdateUserDto) {
    const updated = await this.usersService.update(user.id, user.tenantId, dto)
    return { success: true, data: updated }
  }

  @Post('me/change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  changePassword(@CurrentUser() user: { id: string; tenantId: string }, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(user.id, user.tenantId, dto)
  }

  @Patch(':id/toggle-active')
  async toggleActive(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    await this.usersService.toggleActive(id, tenantId)
    return { success: true, message: 'تم تحديث حالة المستخدم' }
  }
}
