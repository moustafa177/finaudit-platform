import { ValidationResult } from './types';
export declare function validateVatNumber(vatNumber: string): boolean;
export declare function validateCrNumber(crNumber: string): boolean;
export declare function calculateVat(amount: number, rate?: number): number;
export declare function validateVatCalculation(subtotal: number, vatAmount: number, rate?: number): boolean;
export declare function validateInvoiceDate(dateStr: string): boolean;
export interface InvoiceValidationInput {
    type: 'standard' | 'simplified';
    sellerVatNumber: string;
    sellerCrNumber?: string;
    buyerVatNumber?: string;
    issueDate: string;
    lineItems: Array<{
        quantity: number;
        unitPrice: number;
        vatRate: number;
        vatAmount: number;
        totalAmount: number;
    }>;
    subtotal: number;
    vatTotal: number;
    totalAmount: number;
}
export declare function validateInvoice(input: InvoiceValidationInput): ValidationResult;
