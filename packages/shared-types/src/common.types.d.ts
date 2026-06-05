export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    meta?: PaginationMeta;
}
export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface PaginationQuery {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
export type DateRange = {
    from: string;
    to: string;
};
