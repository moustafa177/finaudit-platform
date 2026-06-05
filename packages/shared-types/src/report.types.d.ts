export declare enum ReportType {
    ZATCA_MONTHLY = "zatca_monthly",
    VAT_RETURN = "vat_return",
    PROFIT_LOSS = "profit_loss",
    CASH_FLOW = "cash_flow",
    INVOICE_SUMMARY = "invoice_summary"
}
export declare enum ReportStatus {
    GENERATING = "generating",
    READY = "ready",
    FAILED = "failed"
}
export interface Report {
    id: string;
    tenantId: string;
    type: ReportType;
    status: ReportStatus;
    periodStart: string;
    periodEnd: string;
    data: Record<string, unknown>;
    fileUrl?: string;
    createdAt: string;
}
export interface DashboardKPIs {
    totalRevenue: number;
    totalVat: number;
    totalInvoices: number;
    complianceRate: number;
    pendingInvoices: number;
    nonCompliantInvoices: number;
    revenueGrowth: number;
    cashFlow: MonthlyData[];
    expenseBreakdown: CategoryData[];
    vatSummary: VatSummary;
}
export interface MonthlyData {
    month: string;
    revenue: number;
    expenses: number;
    vat: number;
}
export interface CategoryData {
    category: string;
    amount: number;
    percentage: number;
}
export interface VatSummary {
    collected: number;
    paid: number;
    netPayable: number;
    period: string;
}
