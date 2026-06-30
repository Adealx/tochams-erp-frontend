import api from "./api";

export const getProcurements = async () => {
  const res = await api.get("/procurement/");
  return res.data;
};

export const getProcurement = async (
  id: number
) => {
  const res = await api.get(
    `/procurement/${id}/`
  );

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

export const submitProcurement = async (
  id: number
) => {
  const res = await api.post(
    `/procurement/${id}/submit/`
  );

  return res.data;
};

export const approveProcurement = async (
  id: number
) => {
  const res = await api.post(
    `/procurement/${id}/approve/`
  );

  return res.data;
};

export const rejectProcurement = async (
  id: number,
  comment = ""
) => {
  const res = await api.post(
    `/procurement/${id}/reject/`,
    {
      comment,
    }
  );

  return res.data;
};