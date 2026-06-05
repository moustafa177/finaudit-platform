"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessType = exports.TenantStatus = exports.TenantPlan = void 0;
var TenantPlan;
(function (TenantPlan) {
    TenantPlan["FREE"] = "free";
    TenantPlan["STARTER"] = "starter";
    TenantPlan["PROFESSIONAL"] = "professional";
    TenantPlan["ENTERPRISE"] = "enterprise";
})(TenantPlan || (exports.TenantPlan = TenantPlan = {}));
var TenantStatus;
(function (TenantStatus) {
    TenantStatus["ACTIVE"] = "active";
    TenantStatus["SUSPENDED"] = "suspended";
    TenantStatus["TRIAL"] = "trial";
})(TenantStatus || (exports.TenantStatus = TenantStatus = {}));
var BusinessType;
(function (BusinessType) {
    BusinessType["RETAIL"] = "retail";
    BusinessType["MANUFACTURING"] = "manufacturing";
    BusinessType["B2B_SERVICES"] = "b2b_services";
    BusinessType["MIXED"] = "mixed";
})(BusinessType || (exports.BusinessType = BusinessType = {}));
//# sourceMappingURL=tenant.types.js.map