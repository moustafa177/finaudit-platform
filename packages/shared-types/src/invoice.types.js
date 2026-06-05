"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZatcaStatus = exports.InvoiceStatus = exports.InvoiceType = void 0;
var InvoiceType;
(function (InvoiceType) {
    InvoiceType["STANDARD"] = "standard";
    InvoiceType["SIMPLIFIED"] = "simplified";
    InvoiceType["CREDIT_NOTE"] = "credit_note";
    InvoiceType["DEBIT_NOTE"] = "debit_note";
})(InvoiceType || (exports.InvoiceType = InvoiceType = {}));
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["DRAFT"] = "draft";
    InvoiceStatus["SUBMITTED"] = "submitted";
    InvoiceStatus["VALIDATED"] = "validated";
    InvoiceStatus["CANCELLED"] = "cancelled";
})(InvoiceStatus || (exports.InvoiceStatus = InvoiceStatus = {}));
var ZatcaStatus;
(function (ZatcaStatus) {
    ZatcaStatus["PENDING"] = "pending";
    ZatcaStatus["COMPLIANT"] = "compliant";
    ZatcaStatus["NON_COMPLIANT"] = "non_compliant";
    ZatcaStatus["CLEARED"] = "cleared";
    ZatcaStatus["REPORTED"] = "reported";
})(ZatcaStatus || (exports.ZatcaStatus = ZatcaStatus = {}));
//# sourceMappingURL=invoice.types.js.map