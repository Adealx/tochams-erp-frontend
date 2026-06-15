import api from "./api";

export const getPayments = async () => {
  const response = await api.get("/payments/");
  return response.data;
};

export const createPayment = async (paymentData: any) => {
  const response = await api.post(
    "/payments/",
    paymentData
  );

  return response.data;
};