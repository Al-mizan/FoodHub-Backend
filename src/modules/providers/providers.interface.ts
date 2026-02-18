export interface GetAllProvidersParams {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
    searchTerm?: string | undefined;
    isOpen?: boolean | undefined;
}

export interface GetProviderMealsParams {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
    name?: string | undefined;
    cuisine?: string | string[] | undefined;
    price?: number | undefined;
}


/* Update order status (status and/or payment_status) */
export const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
    PENDING: ["PREPARING", "CANCELLED"],
    PREPARING: ["ON_THE_WAY", "CANCELLED"],
    ON_THE_WAY: ["DELIVERED", "CANCELLED"],
    DELIVERED: [],
    CANCELLED: [],
};