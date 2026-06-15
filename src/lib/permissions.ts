// src/lib/permissions.ts

export const permissions = {
  admin: ["*"],

  manager: [
    "dashboard",
    "customers",
    "products",
    "orders",
    "invoices",
    "payments",
    "inventory",
    "users",
  ],

  sales_head: [
    "dashboard",
    "customers",
    "products",
    "orders",
    "invoices",
  ],

  sales_rep: [
    "dashboard",
    "customers",
    "orders",
  ],

  accounts_officer: [
    "dashboard",
    "invoices",
    "payments",
  ],

  finance_manager: [
    "dashboard",
    "invoices",
    "payments",
    "reports",
  ],
};