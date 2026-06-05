import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/auth-context'
import './globals.css'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'الامتثال المالي — منصة التدقيق الآلي', template: '%s | الامتثال المالي' },
  description: 'منصة ذكية للتدقيق المالي الآلي والامتثال لاشتراطات هيئة الزكاة والضريبة والجمارك',
  keywords: ['ZATCA', 'فاتورة إلكترونية', 'تدقيق مالي', 'ضريبة القيمة المضافة'],
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
