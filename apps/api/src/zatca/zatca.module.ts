import { Module } from '@nestjs/common'
import { ZatcaService } from './zatca.service'
import { ZatcaController } from './zatca.controller'

@Module({
  providers: [ZatcaService],
  controllers: [ZatcaController],
  exports: [ZatcaService],
})
export class ZatcaModule {}
