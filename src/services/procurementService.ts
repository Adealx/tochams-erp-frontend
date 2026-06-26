import api from "./api";

export const getProcurements = async () => {
  const res = await api.get("/procurement/");
  return res.data;
};

export const createProcurement = async (data: any) => {
  const res = await api.post("/procurement/", data);
  return res.data;
};

export const updateProcurement = async (
  id: number,
  data: any
) => {
  const res = await api.put(
    `/procurement/${id}/`,
    data
  );

  return res.data;
};

export const deleteProcurement = async (
  id: number
) => {
  return api.delete(
    `/procurement/${id}/`
  );
};