import api from "./api";

export const getInvoices = async () => {
  const response = await api.get("/invoices/");
  return response.data;
};

export const getInvoice = async (id: number) => {
  const response = await api.get(`/invoices/${id}/`);
  return response.data;
};

export const createInvoice = async (invoiceData: any) => {
  const response = await api.post(
    "/invoices/",
    invoiceData
  );

  return response.data;
};