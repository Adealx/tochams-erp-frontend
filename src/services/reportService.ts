import api from "./api";

/* ================================
   Executive Summary
================================ */

export interface ReportSummary {
    revenue: number;
    expenses: number;
    profit: number;
    inventory_value: number;
    pending_procurements: number;
    outstanding_invoices: number;
    low_stock_products: number;
}

export async function getReportSummary() {
    const response = await api.get<ReportSummary>("/reports/summary/");
    return response.data;
}

/* ================================
   Sales Report
================================ */

export interface SalesReport {
    total_sales: number;
    total_orders: number;
    average_sale: number;
    paid_invoices: number;
    pending_invoices: number;
    outstanding_amount: number;
}

export async function getSalesReport() {
    const response = await api.get<SalesReport>("/reports/sales/");
    return response.data;
}

export interface HighestValueProduct {
    name: string;
    sku: string;
    quantity: number;
    value: number;
}

export interface InventoryReportData {
    total_products: number;
    inventory_value: number;
    low_stock_items: number;
    out_of_stock: number;
    stock_in: number;
    stock_out: number;
    average_stock: number;
    highest_value_product: HighestValueProduct | null;
}

export async function getInventoryReport(): Promise<InventoryReportData> {
    const response = await api.get<InventoryReportData>(
        "/reports/inventory/"
    );

    return response.data;
}