import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ThrottlerModule } from '@nestjs/throttler'
import { AiModule } from './ai/ai.module'
import { AuthModule } from './auth/auth.module'
import { HealthModule } from './health/health.module'
import { TenantsModule } from './tenants/tenants.module'
import { UsersModule } from './users/users.module'
import { InvoicesModule } from './invoices/invoices.module'
import { ZatcaModule } from './zatca/zatca.module'
import { ReportsModule } from './reports/reports.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: config.get('NODE_ENV') === 'development',
        logging: config.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'medium', ttl: 60000, limit: 100 },
    ]),

    AuthModule,
    AiModule,
    HealthModule,
    TenantsModule,
    UsersModule,
    InvoicesModule,
    ZatcaModule,
    ReportsModule,
  ],
})
export class AppModule {}
