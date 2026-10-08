import api from "./api";

/**
 * Customer interface
 */
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  company: string;
  is_active: boolean;
}

/**
 * Get customers
 *
 * includeArchived = true:
 * - Management users can retrieve active + archived customers
 * - The request sends ?include_archived=true
 */
export const getCustomers = async (
  includeArchived = false
): Promise<Customer[]> => {
  try {
    const response = await api.get<Customer[]>(
      "/customers/",
      {
        params: includeArchived
          ? {
              include_archived: "true",
            }
          : {},
      }
    );

    /*
     * -----------------------------------------------
     * DEBUG INFORMATION
     * -----------------------------------------------
     */
    console.log(
      "CUSTOMERS API STATUS:",
      response.status
    );

    console.log(
      "CUSTOMERS API DATA:",
      response.data
    );

    console.log(
      "CUSTOMERS API COUNT:",
      Array.isArray(response.data)
        ? response.data.length
        : "NOT AN ARRAY"
    );

    /*
     * -----------------------------------------------
     * VALIDATE RESPONSE
     * -----------------------------------------------
     */
    if (!Array.isArray(response.data)) {
      console.error(
        "CUSTOMERS API ERROR: Expected an array but received:",
        response.data
      );

      throw new Error(
        "Invalid customers response from server."
      );
    }

    return response.data;
  } catch (error: any) {
    /*
     * -----------------------------------------------
     * DETAILED ERROR LOGGING
     * -----------------------------------------------
     */

    console.error(
      "========================================"
    );

    console.error(
      "GET CUSTOMERS ERROR"
    );

    console.error(
      "========================================"
    );

    console.error(
      "Message:",
      error?.message
    );

    console.error(
      "Status:",
      error?.response?.status
    );

    console.error(
      "Response:",
      error?.response?.data
    );

    console.error(
      "Request URL:",
      error?.config?.url
    );

    console.error(
      "Request params:",
      error?.config?.params
    );

    console.error(
      "========================================"
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
    const response =
      await api.get<Customer>(
        `/customers/${id}/`
      );

    return response.data;
  } catch (error: any) {
    console.error(
      "Get Customer Error:",
      error?.response?.data
    );

    console.error(
      "Get Customer Status:",
      error?.response?.status
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
    const response =
      await api.post<Customer>(
        "/customers/",
        customerData
      );

    return response.data;
  } catch (error: any) {
    console.error(
      "Create Customer Error:",
      error?.response?.data
    );

    console.error(
      "Create Customer Status:",
      error?.response?.status
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
    const response =
      await api.put<Customer>(
        `/customers/${id}/`,
        customerData
      );

    return response.data;
  } catch (error: any) {
    console.error(
      "Update Customer Error:",
      error?.response?.data
    );

    console.error(
      "Update Customer Status:",
      error?.response?.status
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
      error?.response?.data
    );

    console.error(
      "Delete Customer Status:",
      error?.response?.status
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
    const response =
      await api.post(
        `/customers/${id}/`,
        {
          action: "archive",
        }
      );

    return response.data;
  } catch (error: any) {
    console.error(
      "Archive Customer Error:",
      error?.response?.data
    );

    console.error(
      "Archive Customer Status:",
      error?.response?.status
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
    const response =
      await api.post(
        `/customers/${id}/`,
        {
          action: "reactivate",
        }
      );

    return response.data;
  } catch (error: any) {
    console.error(
      "Reactivate Customer Error:",
      error?.response?.data
    );

    console.error(
      "Reactivate Customer Status:",
      error?.response?.status
    );

    throw error;
  }
};


/**
 * Download customer statement
 */
export const downloadCustomerStatement =
  async (id: number) => {
    try {
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
    } catch (error: any) {
      console.error(
        "Download Customer Statement Error:",
        error?.response?.data
      );

      console.error(
        "Download Customer Statement Status:",
        error?.response?.status
      );

      throw error;
    }
  };