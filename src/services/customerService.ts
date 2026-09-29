import api from "./api";

/**
 * Get customers.
 *
 * includeArchived = true is used by the customer-management
 * page so management users can see archived customers.
 */
export const getCustomers = async (
  includeArchived = false
) => {
  try {
    const response = await api.get("/customers/", {
      params: includeArchived
        ? { include_archived: "true" }
        : {},
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Get Customers Error:",
      error.response?.data
    );

    throw error;
  }
};


/**
 * Get a single customer
 */
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


/**
 * Create customer
 */
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
    const response = await api.post(
      "/customers/",
      customerData
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


/**
 * Update customer
 */
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


/**
 * Delete customer
 */
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


/**
 * Archive customer
 */
export const archiveCustomer = async (
  id: number
) => {
  try {
    const response = await api.post(
      `/customers/${id}/`,
      {
        action: "archive",
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Archive Customer Error:",
      error.response?.data
    );

    throw error;
  }
};


/**
 * Reactivate customer
 */
export const reactivateCustomer = async (
  id: number
) => {
  try {
    const response = await api.post(
      `/customers/${id}/`,
      {
        action: "reactivate",
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Reactivate Customer Error:",
      error.response?.data
    );

    throw error;
  }
};


/**
 * Download customer statement
 */
export const downloadCustomerStatement =
  async (id: number) => {
    const response =
      await api.get(
        `/customers/${id}/statement/`,
        {
          responseType: "blob",
        }
      );

    const url =
      window.URL.createObjectURL(
        new Blob([response.data])
      );

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `customer-${id}-statement.pdf`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
  };