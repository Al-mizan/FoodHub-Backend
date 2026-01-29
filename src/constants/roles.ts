export const UserRole = {
    ADMIN: "ADMIN",
    CUSTOMER: "CUSTOMER",
    PROVIDER: "PROVIDER",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];