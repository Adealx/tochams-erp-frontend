export const permissions = {
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
    "users",
  ],

  sales_head: [
    "dashboard",
    "customers",
    "orders",
    "invoices",
  ],

  sales: [
    "dashboard",
    "customers",
    "orders",
  ],

  accountant: [
    "dashboard",
    "vendors",
    "procurement",
    "invoices",
    "payments",
  ],

  procurement: [
    "dashboard",
    "vendors",
    "inventory",
    "procurement",
  ],
};

export const hasPermission = (
  role: string,
  permission: string
) => {
  const rolePermissions =
    permissions[
      role as keyof typeof permissions
    ] || [];

  return (
    rolePermissions.includes("*") ||
    rolePermissions.includes(permission)
  );
};