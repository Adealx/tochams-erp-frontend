import api from "./api";

export const getProducts = async () => {

  const response = await api.get(
    "/products/"
  );

  return response.data;

};

export const getProduct = async (
  id: number
) => {

  const response = await api.get(
    `/products/${id}/`
  );

  return response.data;

};

export const getLowStockAlerts = async () => {

  const response = await api.get(
    "/stock-movements/alerts/"
  );

  return response.data;

};