
export const permissions: Record<string, string[]> = {
  admin: ["*"],

  manager: [
    "dashboard",
    "customers",
    "vendors",
    "inventory",
    "procurement",
    "orders",
    "invoices",
    "payments",
    "accounting",
    "expenses",
    "transaction-tracker",
    "reports",
    "users",
    "attendance",
    "settings",
    "warehouse",
  ],

  sales_head: [
    "dashboard",
    "customers",
    "orders",
    "invoices",
    "attendance",
  ],

  sales: [
    "dashboard",
    "customers",
    "orders",
    "attendance",
  ],

  accountant: [
    "dashboard",
    "customers",
    "vendors",
    "procurement",
    "invoices",
    "payments",
    "inventory",
    "accounting",
    "expenses",
    "transaction-tracker",
    "reports",
    "attendance",
  ],

  inventory: [
    "dashboard",
    "inventory",
    "procurement",
    "vendors",
    "attendance",
  ],

  warehouse: [
    "dashboard",
    "warehouse",
    "orders",
    "attendance",
  ],

  procurement: [
    "dashboard",
    "vendors",
    "inventory",
    "procurement",
    "attendance",
  ],

  pending: [],
};

export const hasPermission = (
  role: string | null | undefined,
  permission: string
): boolean => {
  if (!role) return false;

  const rolePermissions = permissions[role] ?? [];

  return (
    rolePermissions.includes("*") ||
    rolePermissions.includes(permission)
  );
};
