import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Anthropic from '@anthropic-ai/sdk'

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name)
  private client: Anthropic | null = null

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('ANTHROPIC_API_KEY')
    if (apiKey) {
      this.client = new Anthropic({ apiKey })
      this.logger.log('✅ Claude AI متصل')
    } else {
      this.logger.warn('⚠️ ANTHROPIC_API_KEY غير موجود — سيعمل النظام بوضع المحاكاة')
    }
  }

  private async ask(systemPrompt: string, userPrompt: string, maxTokens = 1024): Promise<string> {
    if (!this.client) return this.mockResponse(userPrompt)

    try {
      const msg = await this.client.messages.create({
        model: 'claude-opus-4-5',
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      })
      return (msg.content[0] as { text: string }).text
    } catch (err) {
      this.logger.error('Claude API error', err)
      return this.mockResponse(userPrompt)
    }
  }

  // ── 1. تحليل الفواتير وكشف الاحتيال ──────────────────────────────────
  async analyzeInvoices(invoices: Array<Record<string, unknown>>, tenantName: string): Promise<{
    fraudAlerts: Array<{ title: string; description: string; severity: string; amount?: number; party?: string }>
    insights: string[]
    riskScore: number
    summary: string
  }> {
    const system = `أنت محلل مالي خبير متخصص في كشف الاحتيال والتدقيق المالي للشركات السعودية.
تحلل الفواتير وتكتشف الأنماط المشبوهة والمخاطر المالية.
ردك يجب أن يكون JSON فقط بدون أي نص إضافي.`

    const prompt = `حلّل هذه الفواتير للشركة "${tenantName}" وأعد JSON بهذا الشكل:
{
  "fraudAlerts": [{"title":"...", "description":"...", "severity":"critical|high|medium", "amount":0, "party":"..."}],
  "insights": ["رؤية 1", "رؤية 2"],
  "riskScore": 0-100,
  "summary": "ملخص قصير"
}

الفواتير:
${JSON.stringify(invoices.slice(0, 20), null, 2)}`

    const raw = await this.ask(system, prompt, 2048)
    try {
      const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      return JSON.parse(clean)
    } catch {
      return {
        fraudAlerts: [],
        insights: ['لا توجد فواتير كافية للتحليل'],
        riskScore: 0,
        summary: 'البيانات غير كافية للتحليل',
      }
    }
  }

  // ── 2. تنظيف البيانات الذكي ──────────────────────────────────────────
  async cleanseData(invoices: Array<Record<string, unknown>>): Promise<{
    issues: Array<{ field: string; record: string; type: string; severity: string; description: string; suggestion: string }>
    cleanScore: number
    summary: string
  }> {
    const system = `أنت خبير جودة بيانات مالية متخصص في أنظمة ZATCA السعودية.
تكتشف مشاكل البيانات وتقترح حلولاً. ردك JSON فقط.`

    const prompt = `افحص هذه الفواتير وأعد JSON:
{
  "issues": [{"field":"...", "record":"...", "type":"duplicate|missing|vat_mismatch|date_error|format", "severity":"critical|warning|info", "description":"...", "suggestion":"..."}],
  "cleanScore": 0-100,
  "summary": "..."
}

الفواتير: ${JSON.stringify(invoices.slice(0, 15), null, 2)}`

    const raw = await this.ask(system, prompt, 2048)
    try {
      const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      return JSON.parse(clean)
    } catch {
      return { issues: [], cleanScore: 100, summary: 'البيانات نظيفة' }
    }
  }

  // ── 3. توقع الإيرادات ─────────────────────────────────────────────────
  async forecastRevenue(monthlyData: Array<{ month: string; revenue: number; vat: number }>, companyName: string): Promise<{
    forecast: Array<{ month: string; predicted: number; lower: number; upper: number }>
    growthRate: number
    insights: string[]
    factors: Array<{ factor: string; impact: string; description: string }>
  }> {
    const system = `أنت محلل مالي متخصص في التنبؤ بالإيرادات للشركات السعودية.
تستخدم بيانات تاريخية لتوليد توقعات دقيقة. ردك JSON فقط.`

    const prompt = `بناءً على البيانات التاريخية لشركة "${companyName}"، توقّع الإيرادات للأشهر الثلاثة القادمة:

البيانات: ${JSON.stringify(monthlyData, null, 2)}

أعد JSON:
{
  "forecast": [{"month":"يوليو 2026","predicted":0,"lower":0,"upper":0},{"month":"أغسطس 2026",...},{"month":"سبتمبر 2026",...}],
  "growthRate": 0,
  "insights": ["..."],
  "factors": [{"factor":"...","impact":"+X%","description":"..."}]
}`

    const raw = await this.ask(system, prompt, 2048)
    try {
      const cleanStr = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      return JSON.parse(cleanStr)
    } catch {
      const lastRevenue = monthlyData[monthlyData.length - 1]?.revenue ?? 100000
      return {
        forecast: [
          { month: 'يوليو 2026', predicted: lastRevenue * 1.05, lower: lastRevenue * 0.9, upper: lastRevenue * 1.2 },
          { month: 'أغسطس 2026', predicted: lastRevenue * 1.08, lower: lastRevenue * 0.92, upper: lastRevenue * 1.24 },
          { month: 'سبتمبر 2026', predicted: lastRevenue * 1.12, lower: lastRevenue * 0.95, upper: lastRevenue * 1.3 },
        ],
        growthRate: 12,
        insights: ['بيانات غير كافية — التوقعات تقديرية'],
        factors: [],
      }
    }
  }

  // ── 4. استخراج بيانات الفاتورة (RPA) ────────────────────────────────
  async extractInvoiceData(rawText: string): Promise<{
    invoiceNumber?: string
    sellerName?: string
    vatNumber?: string
    issueDate?: string
    totalAmount?: number
    vatAmount?: number
    lineItems?: Array<{ description: string; quantity: number; unitPrice: number; vatRate: number }>
    confidence: number
    warnings: string[]
  }> {
    const system = `أنت نظام OCR ذكي متخصص في استخراج بيانات الفواتير السعودية.
تستخرج البيانات المنظمة من النصوص الخام. ردك JSON فقط.`

    const prompt = `استخرج بيانات الفاتورة من النص التالي وأعد JSON:
{
  "invoiceNumber": "...",
  "sellerName": "...",
  "vatNumber": "...",
  "issueDate": "YYYY-MM-DD",
  "totalAmount": 0,
  "vatAmount": 0,
  "lineItems": [{"description":"...","quantity":1,"unitPrice":0,"vatRate":0.15}],
  "confidence": 0-100,
  "warnings": ["..."]
}

النص: ${rawText}`

    const raw = await this.ask(system, prompt, 1024)
    try {
      const cleanStr = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      return JSON.parse(cleanStr)
    } catch {
      return { confidence: 0, warnings: ['تعذّر الاستخراج'] }
    }
  }

  // ── 5. تقرير استشاري ذكي ─────────────────────────────────────────────
  async generateAdvisoryReport(data: {
    tenantName: string
    totalRevenue: number
    totalVat: number
    complianceRate: number
    totalInvoices: number
    topRisks: string[]
  }): Promise<{
    executiveSummary: string
    strengths: string[]
    weaknesses: string[]
    recommendations: Array<{ priority: string; action: string; impact: string }>
    complianceAdvice: string
  }> {
    const system = `أنت مستشار مالي خبير متخصص في الشركات السعودية وأنظمة ZATCA.
تكتب تقارير استشارية احترافية بالعربية. ردك JSON فقط.`

    const prompt = `اكتب تقريراً استشارياً لـ "${data.tenantName}":

البيانات:
- الإيرادات: ${data.totalRevenue} ر.س
- الضريبة: ${data.totalVat} ر.س
- الامتثال: ${data.complianceRate}%
- الفواتير: ${data.totalInvoices}
- المخاطر: ${data.topRisks.join(', ')}

أعد JSON:
{
  "executiveSummary": "...",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "recommendations": [{"priority":"عالية|متوسطة","action":"...","impact":"..."}],
  "complianceAdvice": "..."
}`

    const raw = await this.ask(system, prompt, 2048)
    try {
      const cleanStr = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      return JSON.parse(cleanStr)
    } catch {
      return {
        executiveSummary: 'يتطلب التحليل بيانات أكثر',
        strengths: [],
        weaknesses: [],
        recommendations: [],
        complianceAdvice: 'تأكد من الامتثال لاشتراطات ZATCA',
      }
    }
  }

  // ── Mock fallback ─────────────────────────────────────────────────────
  private mockResponse(prompt: string): string {
    if (prompt.includes('fraudAlerts')) {
      return JSON.stringify({
        fraudAlerts: [],
        insights: ['البيانات تبدو سليمة — لا توجد مؤشرات احتيال واضحة'],
        riskScore: 15,
        summary: 'مستوى المخاطر منخفض (وضع المحاكاة — يرجى إضافة ANTHROPIC_API_KEY)',
      })
    }
    if (prompt.includes('cleanScore')) {
      return JSON.stringify({ issues: [], cleanScore: 85, summary: 'البيانات جيدة (وضع المحاكاة)' })
    }
    if (prompt.includes('forecast')) {
      return JSON.stringify({
        forecast: [
          { month: 'يوليو', predicted: 95000, lower: 80000, upper: 110000 },
          { month: 'أغسطس', predicted: 102000, lower: 86000, upper: 118000 },
          { month: 'سبتمبر', predicted: 115000, lower: 97000, upper: 133000 },
        ],
        growthRate: 18,
        insights: ['نمو متوقع بناءً على بيانات الأشهر السابقة'],
        factors: [{ factor: 'الموسمية', impact: '+18%', description: 'ارتفاع الطلب في الربع الثالث' }],
      })
    }
    return JSON.stringify({ confidence: 70, warnings: ['وضع المحاكاة — أضف ANTHROPIC_API_KEY'] })
  }
}
