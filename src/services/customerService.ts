import api from "./api";

export const getCustomers = async () => {
  try {
    const response = await api.get(
      "/customers/"
    );

    return response.data;

  } catch (error: any) {

    console.error(
      "Get Customers Error:",
      error.response?.data
    );

    throw error;
  }
};

export const getCustomer = async (
  id: number
) => {
  try {
    const response = await api.get(
      `/customers/${id}/`
    );

    return response.data;

  } catch (error: any) {

    console.error(
      "Get Customer Error:",
      error.response?.data
    );

    throw error;
  }
};

export const createCustomer = async (
  customerData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    company: string;
  }
) => {

  try {

    console.log(
      "Creating Customer:",
      customerData
    );

    const response = await api.post(
      "/customers/",
      customerData
    );

    console.log(
      "Customer Created:",
      response.data
    );

    return response.data;

  } catch (error: any) {

    console.error(
      "Create Customer Error:",
      error.response?.data
    );

    throw error;
  }
};

export const updateCustomer = async (
  id: number,
  customerData: any
) => {

  try {

    const response = await api.put(
      `/customers/${id}/`,
      customerData
    );

    return response.data;

  } catch (error: any) {

    console.error(
      "Update Customer Error:",
      error.response?.data
    );

    throw error;
  }
};

export const deleteCustomer = async (
  id: number
) => {

  try {

    await api.delete(
      `/customers/${id}/`
    );

  } catch (error: any) {

    console.error(
      "Delete Customer Error:",
      error.response?.data
    );

    throw error;
  }
};