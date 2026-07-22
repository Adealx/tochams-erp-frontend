import api from "./api";

/* =====================================================
   PRODUCTS
===================================================== */

export const getProducts = async () => {
  const response = await api.get("/products/");
  return response.data;
};

export const getProduct = async (id: number) => {
  const response = await api.get(`/products/${id}/`);
  return response.data;
};

export const createProduct = async (data: any) => {
  const response = await api.post("/products/", data);
  return response.data;
};

export const updateProduct = async (
  id: number,
  data: any
) => {
  const response = await api.put(
    `/products/${id}/`,
    data
  );

  return response.data;
};

export const deleteProduct = async (
  id: number
) => {
  const response = await api.delete(
    `/products/${id}/`
  );

  return response.data;
};

/* =====================================================
   BULK IMPORT
===================================================== */

export const downloadTemplate = async () => {
  const response = await api.get(
    "/products/download-template/",
    {
      responseType: "blob",
    }
  );

  return response.data;
};

export const importProducts = async (
  file: File,
  onProgress?: (progress: number) => void
) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    "/products/import-csv/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },

      onUploadProgress(progressEvent) {
        if (
          progressEvent.total &&
          onProgress
        ) {
          onProgress(
            Math.round(
              (progressEvent.loaded * 100) /
                progressEvent.total
            )
          );
        }
      },
    }
  );

  return response.data;
};

/* =====================================================
   CATEGORIES
===================================================== */

export const getCategories = async () => {
  const response = await api.get(
    "/products/categories/"
  );

  return response.data;
};

/* =====================================================
   BRANDS
===================================================== */

export const getBrands = async () => {
  const response = await api.get(
    "/products/brands/"
  );

  return response.data;
};

/* =====================================================
   UNITS
===================================================== */

export const getUnits = async () => {
  const response = await api.get(
    "/products/units/"
  );

  return response.data;
};

/* =====================================================
   STOCK MANAGEMENT
===================================================== */

export const restockProduct = async (
  id: number,
  quantity: number
) => {
  const response = await api.post(
    `/products/${id}/restock/`,
    {
      quantity,
    }
  );

  return response.data;
};

export const getLowStockAlerts = async () => {
  const response = await api.get(
    "/stock-movements/alerts/"
  );

  return response.data;
};