import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { TenantsService } from './tenants.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentTenant } from '../common/decorators/tenant.decorator'

@ApiTags('الشركة')
@Controller('tenant')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TenantsController {
  constructor(private tenantsService: TenantsService) {}

  @Get()
  async getMyTenant(@CurrentTenant() tenantId: string) {
    const tenant = await this.tenantsService.findById(tenantId)
    return { success: true, data: tenant }
  }

  @Patch()
  async updateTenant(@CurrentTenant() tenantId: string, @Body() body: Partial<import('./tenant.entity').Tenant>) {
    const tenant = await this.tenantsService.update(tenantId, body)
    return { success: true, data: tenant }
  }
}
