import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Get } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { RegisterDto, LoginDto } from '@finaudit/shared-types'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { Public } from '../common/decorators/public.decorator'
import { CurrentUser } from '../common/decorators/tenant.decorator'

@ApiTags('المصادقة')
@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'تسجيل شركة جديدة' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'تسجيل الدخول' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'تجديد رمز الوصول' })
  refresh(@Body() body: { userId: string; refreshToken: string }) {
    return this.authService.refreshTokens(body.userId, body.refreshToken)
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'تسجيل الخروج' })
  logout(@CurrentUser() user: { sub: string }) {
    return this.authService.logout(user.sub)
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'بيانات المستخدم الحالي' })
  getMe(@CurrentUser() user: unknown) {
    return { success: true, data: user }
  }
}
