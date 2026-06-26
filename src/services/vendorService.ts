import api from "./api";

export const getVendors = async () => {
  const res = await api.get("/vendors/");
  return res.data;
};