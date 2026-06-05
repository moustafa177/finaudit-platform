"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportStatus = exports.ReportType = void 0;
var ReportType;
(function (ReportType) {
    ReportType["ZATCA_MONTHLY"] = "zatca_monthly";
    ReportType["VAT_RETURN"] = "vat_return";
    ReportType["PROFIT_LOSS"] = "profit_loss";
    ReportType["CASH_FLOW"] = "cash_flow";
    ReportType["INVOICE_SUMMARY"] = "invoice_summary";
})(ReportType || (exports.ReportType = ReportType = {}));
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["GENERATING"] = "generating";
    ReportStatus["READY"] = "ready";
    ReportStatus["FAILED"] = "failed";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
//# sourceMappingURL=report.types.js.map