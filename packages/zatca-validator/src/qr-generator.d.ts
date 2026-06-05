import { ZatcaInvoiceData } from './types';
export declare function generateZatcaQrPayload(data: ZatcaInvoiceData): string;
export declare function decodeZatcaQr(base64: string): ZatcaInvoiceData | null;
