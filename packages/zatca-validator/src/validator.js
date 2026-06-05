"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateVatNumber = validateVatNumber;
exports.validateCrNumber = validateCrNumber;
exports.calculateVat = calculateVat;
exports.validateVatCalculation = validateVatCalculation;
exports.validateInvoiceDate = validateInvoiceDate;
exports.validateInvoice = validateInvoice;
const VAT_RATE = 0.15;
const VAT_NUMBER_REGEX = /^3\d{13}3$/;
const CR_NUMBER_REGEX = /^\d{10}$/;
function validateVatNumber(vatNumber) {
    return VAT_NUMBER_REGEX.test(vatNumber);
}
function validateCrNumber(crNumber) {
    return CR_NUMBER_REGEX.test(crNumber);
}
function calculateVat(amount, rate = VAT_RATE) {
    return Math.round(amount * rate * 100) / 100;
}
function validateVatCalculation(subtotal, vatAmount, rate = VAT_RATE) {
    const expected = calculateVat(subtotal, rate);
    return Math.abs(expected - vatAmount) < 0.01;
}
function validateInvoiceDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const maxFutureDays = 30;
    const maxPastDays = 1095;
    const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= -maxFutureDays && diffDays <= maxPastDays;
}
function validateInvoice(input) {
    const errors = [];
    if (!validateVatNumber(input.sellerVatNumber)) {
        errors.push({
            code: 'BR-KSA-01',
            field: 'sellerVatNumber',
            message: 'Seller VAT number format is invalid (must be 15 digits starting and ending with 3)',
            messageAr: 'رقم الضريبة للبائع غير صحيح (يجب أن يكون 15 رقماً يبدأ وينتهي بـ 3)',
        });
    }
    if (input.type === 'standard' && input.buyerVatNumber && !validateVatNumber(input.buyerVatNumber)) {
        errors.push({
            code: 'BR-KSA-02',
            field: 'buyerVatNumber',
            message: 'Buyer VAT number format is invalid',
            messageAr: 'رقم الضريبة للمشتري غير صحيح',
        });
    }
    if (!validateInvoiceDate(input.issueDate)) {
        errors.push({
            code: 'BR-KSA-03',
            field: 'issueDate',
            message: 'Invoice date is out of allowed range',
            messageAr: 'تاريخ الفاتورة خارج النطاق المسموح به',
        });
    }
    if (!validateVatCalculation(input.subtotal, input.vatTotal)) {
        errors.push({
            code: 'BR-KSA-04',
            field: 'vatTotal',
            message: `VAT calculation error. Expected: ${calculateVat(input.subtotal)}, Got: ${input.vatTotal}`,
            messageAr: `خطأ في حساب الضريبة. المتوقع: ${calculateVat(input.subtotal)}، الموجود: ${input.vatTotal}`,
        });
    }
    const expectedTotal = input.subtotal + input.vatTotal;
    if (Math.abs(expectedTotal - input.totalAmount) > 0.01) {
        errors.push({
            code: 'BR-KSA-05',
            field: 'totalAmount',
            message: 'Total amount does not match subtotal + VAT',
            messageAr: 'المبلغ الإجمالي لا يتطابق مع المجموع + الضريبة',
        });
    }
    if (input.lineItems.length === 0) {
        errors.push({
            code: 'BR-KSA-06',
            field: 'lineItems',
            message: 'Invoice must have at least one line item',
            messageAr: 'يجب أن تحتوي الفاتورة على بند واحد على الأقل',
        });
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
    };
}
//# sourceMappingURL=validator.js.map