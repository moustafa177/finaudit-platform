export declare enum InvoiceType {
    STANDARD = "standard",
    SIMPLIFIED = "simplified",
    CREDIT_NOTE = "credit_note",
    DEBIT_NOTE = "debit_note"
}
export declare enum InvoiceStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    VALIDATED = "validated",
    CANCELLED = "cancelled"
}
export declare enum ZatcaStatus {
    PENDING = "pending",
    COMPLIANT = "compliant",
    NON_COMPLIANT = "non_compliant",
    CLEARED = "cleared",
    REPORTED = "reported"
}
export interface InvoiceParty {
    name: string;
    vatNumber?: string;
    crNumber?: string;
    address: {
        street: string;
        city: string;
        region: string;
        postalCode: string;
        country: string;
    };
}
export interface InvoiceLineItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    discountAmount?: number;
    vatRate: number;
    vatAmount: number;
    totalAmount: number;
}
export interface Invoice {
    id: string;
    tenantId: string;
    invoiceNumber: string;
    type: InvoiceType;
    status: InvoiceStatus;
    zatcaStatus: ZatcaStatus;
    issueDate: string;
    supplyDate?: string;
    seller: InvoiceParty;
    buyer: InvoiceParty;
    lineItems: InvoiceLineItem[];
    subtotal: number;
    discountTotal: number;
    vatTotal: number;
    totalAmount: number;
    currency: string;
    notes?: string;
    qrCode?: string;
    xmlContent?: string;
    pdfUrl?: string;
    createdAt: string;
    updatedAt: string;
}
export interface CreateInvoiceDto {
    type: InvoiceType;
    issueDate: string;
    supplyDate?: string;
    buyer: InvoiceParty;
    lineItems: Omit<InvoiceLineItem, 'id' | 'vatAmount' | 'totalAmount'>[];
    notes?: string;
    currency?: string;
}
