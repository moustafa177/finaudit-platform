import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { Public } from '../common/decorators/public.decorator'
import * as os from 'os'

@ApiTags('System Health')
@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private config: ConfigService,
  ) {}

  @Get()
  @Public()
  async getHealth() {
    const start = Date.now()

    // DB check
    let dbStatus = 'ok'
    let dbLatency = 0
    let dbTables = 0
    try {
      const t = Date.now()
      await this.dataSource.query('SELECT 1')
      dbLatency = Date.now() - t
      const tables = await this.dataSource.query(
        `SELECT count(*) FROM information_schema.tables WHERE table_schema='public'`,
      )
      dbTables = parseInt(tables[0].count)
    } catch {
      dbStatus = 'error'
    }

    // AI check
    const aiKey = this.config.get('ANTHROPIC_API_KEY')
    const aiStatus = aiKey && aiKey !== 'your-anthropic-api-key-here' ? 'connected' : 'mock'

    // System info
    const uptime = process.uptime()
    const memUsage = process.memoryUsage()
    const freeMem = os.freemem()
    const totalMem = os.totalmem()

    return {
      success: true,
      timestamp: new Date().toISOString(),
      status: dbStatus === 'ok' ? 'healthy' : 'degraded',
      latency: Date.now() - start,
      services: {
        api:      { status: 'ok',   latency: Date.now() - start },
        database: { status: dbStatus, latency: dbLatency, tables: dbTables },
        ai:       { status: aiStatus, model: 'claude-opus-4-5' },
        zatca:    { status: 'ok',   env: this.config.get('ZATCA_ENV', 'sandbox') },
        rpa:      { status: 'active', rulesCount: 3 },
      },
      system: {
        uptime:      Math.floor(uptime),
        uptimeHuman: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
        nodeVersion: process.version,
        platform:    process.platform,
        memory: {
          used:  Math.round(memUsage.heapUsed / 1024 / 1024),
          total: Math.round(memUsage.heapTotal / 1024 / 1024),
          free:  Math.round(freeMem / 1024 / 1024),
          totalRam: Math.round(totalMem / 1024 / 1024),
          usagePercent: Math.round(((totalMem - freeMem) / totalMem) * 100),
        },
      },
    }
  }
}
