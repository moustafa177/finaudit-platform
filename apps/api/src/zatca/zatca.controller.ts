import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { ZatcaService } from './zatca.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { Public } from '../common/decorators/public.decorator'

@ApiTags('ZATCA')
@Controller('zatca')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ZatcaController {
  constructor(private zatcaService: ZatcaService) {}

  @Post('validate-vat')
  @Public()
  validateVat(@Body() body: { vatNumber: string }) {
    return { success: true, data: this.zatcaService.validateVatNumber(body.vatNumber) }
  }
}
