import api from "./api";

export const getInvoices = async () => {
  const response = await api.get(
    "/invoices/"
  );

  return response.data;
};

export const getInvoice = async (
  id: number
) => {
  const response =
    await api.get(
      `/invoices/${id}/detail/`
    );

  return response.data;
};

export const createInvoice = async (
  data: any
) => {
  const response =
    await api.post(
      "/invoices/",
      data
    );

  return response.data;
};

export const downloadInvoicePDF =
  async (id: number) => {

    const response =
      await api.get(
        `/invoices/${id}/pdf/`,
        {
          responseType: "blob",
        }
      );

    const url =
      window.URL.createObjectURL(
        new Blob([
          response.data,
        ])
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      `invoice-${id}.pdf`;

    document.body.appendChild(
      link
    );

    link.click();

    link.remove();

    window.URL.revokeObjectURL(
      url
    );
};