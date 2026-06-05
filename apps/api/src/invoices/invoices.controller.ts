import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { InvoicesService } from './invoices.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentTenant } from '../common/decorators/tenant.decorator'
import { CreateInvoiceDto, InvoiceStatus, PaginationQuery } from '@finaudit/shared-types'

@ApiTags('الفواتير')
@Controller('invoices')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @Get()
  async findAll(
    @CurrentTenant() tenantId: string,
    @Query() query: PaginationQuery & { status?: InvoiceStatus; dateFrom?: string; dateTo?: string },
  ) {
    const result = await this.invoicesService.findAll(tenantId, query)
    return { success: true, ...result }
  }

  @Get('stats')
  async getStats(@CurrentTenant() tenantId: string, @Query('year') year = new Date().getFullYear()) {
    const stats = await this.invoicesService.getStats(tenantId, year)
    return { success: true, data: stats }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    const invoice = await this.invoicesService.findOne(id, tenantId)
    return { success: true, data: invoice }
  }

  @Post()
  async create(@CurrentTenant() tenantId: string, @Body() dto: CreateInvoiceDto) {
    const invoice = await this.invoicesService.create(tenantId, dto)
    return { success: true, data: invoice, message: 'تم إنشاء الفاتورة بنجاح' }
  }

  @Patch(':id/submit')
  @HttpCode(HttpStatus.OK)
  async submit(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    const invoice = await this.invoicesService.submit(id, tenantId)
    return { success: true, data: invoice, message: 'تم تقديم الفاتورة بنجاح' }
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    const invoice = await this.invoicesService.cancel(id, tenantId)
    return { success: true, data: invoice, message: 'تم إلغاء الفاتورة' }
  }
}
