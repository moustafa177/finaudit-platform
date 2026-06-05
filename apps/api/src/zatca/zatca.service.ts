import { Injectable, Logger } from '@nestjs/common'
import { Invoice } from '../invoices/invoice.entity'
import {
  validateInvoice,
  generateZatcaQrPayload,
  buildZatcaXml,
} from '@finaudit/zatca-validator'
import { ZatcaStatus } from '@finaudit/shared-types'

@Injectable()
export class ZatcaService {
  private readonly logger = new Logger(ZatcaService.name)

  async validateAndEnrich(invoice: Invoice): Promise<Invoice> {
    const validationResult = validateInvoice({
      type: invoice.type as 'standard' | 'simplified',
      sellerVatNumber: invoice.seller.vatNumber || '',
      buyerVatNumber: invoice.buyer.vatNumber,
      issueDate: invoice.issueDate,
      lineItems: invoice.lineItems.map((i) => ({
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        vatRate: i.vatRate,
        vatAmount: i.vatAmount,
        totalAmount: i.totalAmount,
      })),
      subtotal: invoice.subtotal,
      vatTotal: invoice.vatTotal,
      totalAmount: invoice.totalAmount,
    })

    invoice.zatcaStatus = validationResult.isValid ? ZatcaStatus.COMPLIANT : ZatcaStatus.NON_COMPLIANT
    invoice.zatcaErrors = validationResult.errors

    if (validationResult.isValid) {
      invoice.qrCode = generateZatcaQrPayload({
        sellerName: invoice.seller.name,
        vatNumber: invoice.seller.vatNumber || '',
        timestamp: new Date().toISOString(),
        invoiceTotal: invoice.totalAmount,
        vatTotal: invoice.vatTotal,
      })

      invoice.xmlContent = buildZatcaXml({
        invoiceNumber: invoice.invoiceNumber,
        issueDate: invoice.issueDate,
        issueTime: new Date().toISOString().split('T')[1].split('.')[0],
        type: invoice.type as 'standard' | 'simplified',
        currency: invoice.currency,
        seller: {
          name: invoice.seller.name,
          vatNumber: invoice.seller.vatNumber || '',
          street: invoice.seller.address?.street || '',
          city: invoice.seller.address?.city || '',
          postalCode: invoice.seller.address?.postalCode || '',
          country: invoice.seller.address?.country || 'SA',
        },
        buyer: {
          name: invoice.buyer.name,
          vatNumber: invoice.buyer.vatNumber,
          street: invoice.buyer.address?.street || '',
          city: invoice.buyer.address?.city || '',
          postalCode: invoice.buyer.address?.postalCode || '',
          country: invoice.buyer.address?.country || 'SA',
        },
        lineItems: invoice.lineItems.map((i) => ({
          id: i.id,
          description: i.description,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          vatRate: i.vatRate,
          vatAmount: i.vatAmount,
          lineTotal: i.totalAmount,
        })),
        subtotal: invoice.subtotal,
        vatTotal: invoice.vatTotal,
        totalAmount: invoice.totalAmount,
        qrCode: invoice.qrCode,
      })
    }

    return invoice
  }

  validateVatNumber(vatNumber: string): { isValid: boolean; message?: string } {
    const regex = /^3\d{13}3$/
    if (!regex.test(vatNumber)) {
      return { isValid: false, message: 'رقم الضريبة يجب أن يكون 15 رقماً ويبدأ وينتهي بـ 3' }
    }
    return { isValid: true }
  }
}
