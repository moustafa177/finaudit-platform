export interface XmlInvoiceInput {
    invoiceNumber: string;
    issueDate: string;
    issueTime: string;
    type: 'standard' | 'simplified';
    currency: string;
    seller: {
        name: string;
        vatNumber: string;
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };
    buyer: {
        name: string;
        vatNumber?: string;
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };
    lineItems: Array<{
        id: string;
        description: string;
        quantity: number;
        unitPrice: number;
        vatRate: number;
        vatAmount: number;
        lineTotal: number;
    }>;
    subtotal: number;
    vatTotal: number;
    totalAmount: number;
    qrCode: string;
}
export declare function buildZatcaXml(input: XmlInvoiceInput): string;
