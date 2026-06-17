import api from "./api";

export const getLowStockAlerts =
  async () => {

    const response =
      await api.get(
        "/stock-movements/alerts/"
      );

    return response.data;
};