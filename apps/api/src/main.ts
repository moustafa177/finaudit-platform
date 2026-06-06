import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'

async function bootstrap() {
  console.log('=== FinAudit API Starting ===')
  console.log('NODE_ENV:', process.env.NODE_ENV)
  console.log('PORT:', process.env.PORT)
  console.log('DATABASE_URL set:', !!process.env.DATABASE_URL)
  console.log('JWT_SECRET set:', !!process.env.JWT_SECRET)

  try {
    const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] })

    app.enableCors({
      origin: process.env.NEXT_PUBLIC_APP_URL || '*',
      credentials: true,
    })

    app.setGlobalPrefix(process.env.API_PREFIX || 'api/v1')
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
      }),
    )
    app.useGlobalFilters(new HttpExceptionFilter())

    const port = process.env.PORT || process.env.API_PORT || 3001
    await app.listen(port, '0.0.0.0')
    console.log(`API running on port ${port}`)
    console.log(`Health: http://localhost:${port}/api/v1/health`)
  } catch (error) {
    console.error('=== STARTUP ERROR ===')
    console.error(error)
    process.exit(1)
  }
}

bootstrap()
