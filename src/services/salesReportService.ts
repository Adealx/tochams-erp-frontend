import api from "./api";

export interface SalesReport {

    total_sales: number;

    total_orders: number;

    average_sale: number;

    paid_invoices: number;

    pending_invoices: number;

    outstanding_amount: number;
}

export async function getSalesReport() {

    const response = await api.get<SalesReport>(
        "/reports/sales/"
    );

    return response.data;
}