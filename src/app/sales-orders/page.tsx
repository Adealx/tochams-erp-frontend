"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import AppShell from "@/components/layout/AppShell";

interface SalesOrderItem {
  id?: number;
  product: number;
  product_name?: string;
  quantity: number;
  price_type?: "Retail" | "Wholesale";
  retail_price: number | string;
  line_total?: number | string;
}

interface SalesOrder {
  id: number;
  order_number?: string;
  sales_rep_name: string;
  customer: number;
  customer_name: string;
  total_amount: number | string;
  status: string;
  warehouse_status?: string;
  remarks?: string;
  items: SalesOrderItem[];
  created_at: string;
  updated_at?: string;
}

interface Customer {
  id: number;
  name: string;
}

interface Product {
  id: number;
  sku: string;
  name: string;
  category?: string;
  supplier?: string;
  stock_quantity: number;
  reorder_level?: number;
  retail_price: string | number;
  wholesale_price: string | number;
}

interface OrderItemForm {
  product: number | "";
  quantity: number;
  retail_price: number;
  price_type: "Retail" | "Wholesale";
}

const createEmptyItem = (): OrderItemForm => ({
  product: "",
  quantity: 1,
  retail_price: 0,
  price_type: "Retail",
});

const formatNaira = (
  value: number | string
) => {
  const amount = Number(value || 0);

  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (value: string) => {
  if (!value) return "—";

  return new Date(value).toLocaleDateString(
    "en-NG",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const getErrorMessage = (
  error: any,
  fallback: string
) => {
  const data = error?.response?.data;

  if (!data) return fallback;

  if (typeof data === "string") {
    return data;
  }

  if (data.error) {
    return data.error;
  }

  if (data.detail) {
    return data.detail;
  }

  if (data.quantity) {
    return Array.isArray(data.quantity)
      ? data.quantity[0]
      : data.quantity;
  }

  if (data.product) {
    return Array.isArray(data.product)
      ? data.product[0]
      : data.product;
  }

  if (data.customer) {
    return Array.isArray(data.customer)
      ? data.customer[0]
      : data.customer;
  }

  return fallback;
};

export default function SalesOrdersPage() {
  const { user } = useAuth();

  const [orders, setOrders] =
    useState<SalesOrder[]>([]);

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  /*
   * The create form stays on the Sales Orders page.
   * New Order simply scrolls the user to it.
   */
  const [showCreateForm, setShowCreateForm] =
    useState(true);

  const [editingOrder, setEditingOrder] =
    useState<SalesOrder | null>(null);

  /*
   * Stores the IDs of orders whose product
   * lists are currently expanded.
   */
  const [expandedOrders, setExpandedOrders] =
    useState<Set<number>>(
      new Set()
    );

  const [formData, setFormData] =
    useState({
      customer: "",
      remarks: "",
    });

  const [items, setItems] =
    useState<OrderItemForm[]>([
      createEmptyItem(),
    ]);

  /*
   * --------------------------------------------------
   * DATA LOADING
   * --------------------------------------------------
   */

  const loadOrders = async () => {
    try {
      const response =
        await api.get("/orders/");

      setOrders(response.data);
    } catch (error: any) {
      console.error(
        "Sales Orders Error:",
        error
      );

      toast.error(
        getErrorMessage(
          error,
          "Unable to load sales orders."
        )
      );
    }
  };

  const loadCustomers = async () => {
    try {
      const response =
        await api.get("/customers/");

      setCustomers(response.data);
    } catch (error: any) {
      console.error(
        "Customers Error:",
        error
      );
    }
  };

  const loadProducts = async () => {
    try {
      const response =
        await api.get("/products/");

      setProducts(response.data);
    } catch (error: any) {
      console.error(
        "Products Error:",
        error
      );
    }
  };

  const loadPage = async () => {
    setLoading(true);

    try {
      await Promise.all([
        loadOrders(),
        loadCustomers(),
        loadProducts(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, []);

  /*
   * --------------------------------------------------
   * FORM HELPERS
   * --------------------------------------------------
   */

  const resetForm = () => {
    setFormData({
      customer: "",
      remarks: "",
    });

    setItems([
      createEmptyItem(),
    ]);

    setEditingOrder(null);
  };

  const scrollToCreateForm = () => {
    setShowCreateForm(true);

    setTimeout(() => {
      document
        .getElementById("create-order")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  /*
   * Support /sales-orders#create-order
   * if the user opens that URL directly.
   */
  useEffect(() => {
    const handleHash = () => {
      if (
        window.location.hash ===
        "#create-order"
      ) {
        setShowCreateForm(true);

        setTimeout(() => {
          document
            .getElementById("create-order")
            ?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
        }, 100);
      }
    };

    handleHash();

    window.addEventListener(
      "hashchange",
      handleHash
    );

    return () => {
      window.removeEventListener(
        "hashchange",
        handleHash
      );
    };
  }, []);

  const addItem = () => {
    setItems((current) => [
      ...current,
      createEmptyItem(),
    ]);
  };

  const removeItem = (
    index: number
  ) => {
    setItems((current) => {
      if (current.length === 1) {
        return current;
      }

      return current.filter(
        (_, itemIndex) =>
          itemIndex !== index
      );
    });
  };

  const updateItem = (
    index: number,
    changes: Partial<OrderItemForm>
  ) => {
    setItems((current) =>
      current.map(
        (item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                ...changes,
              }
            : item
      )
    );
  };

  /*
   * --------------------------------------------------
   * PRODUCT / PRICE HANDLING
   * --------------------------------------------------
   */

  const handleProductChange = (
    index: number,
    productId: string
  ) => {
    const selectedProduct =
      products.find(
        (product) =>
          product.id ===
          Number(productId)
      );

    if (!selectedProduct) {
      updateItem(index, {
        product: "",
        retail_price: 0,
      });

      return;
    }

    const currentItem =
      items[index];

    const price =
      currentItem.price_type ===
      "Wholesale"
        ? Number(
            selectedProduct.wholesale_price
          )
        : Number(
            selectedProduct.retail_price
          );

    updateItem(index, {
      product: selectedProduct.id,
      retail_price: price,
    });
  };

  const handlePriceTypeChange = (
    index: number,
    priceType:
      | "Retail"
      | "Wholesale"
  ) => {
    const item = items[index];

    const selectedProduct =
      products.find(
        (product) =>
          product.id ===
          Number(item.product)
      );

    const price = selectedProduct
      ? priceType === "Wholesale"
        ? Number(
            selectedProduct.wholesale_price
          )
        : Number(
            selectedProduct.retail_price
          )
      : 0;

    updateItem(index, {
      price_type: priceType,
      retail_price: price,
    });
  };

  /*
   * --------------------------------------------------
   * ORDER TOTALS
   * --------------------------------------------------
   */

  const grandTotal = useMemo(() => {
    return items.reduce(
      (total, item) => {
        return (
          total +
          Number(item.quantity || 0) *
            Number(
              item.retail_price || 0
            )
        );
      },
      0
    );
  }, [items]);

  const totalQuantity = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total +
        Number(
          item.quantity || 0
        ),
      0
    );
  }, [items]);

  /*
   * --------------------------------------------------
   * CREATE ORDER
   * --------------------------------------------------
   */

  const validateOrder = () => {
    if (!formData.customer) {
      toast.error(
        "Please select a customer."
      );

      return false;
    }

    const validItems =
      items.filter(
        (item) =>
          item.product &&
          Number(item.quantity) > 0
      );

    if (!validItems.length) {
      toast.error(
        "Add at least one product."
      );

      return false;
    }

    for (const item of validItems) {
      const product =
        products.find(
          (productItem) =>
            productItem.id ===
            Number(item.product)
        );

      if (!product) {
        toast.error(
          "One of the selected products is invalid."
        );

        return false;
      }

      if (
        Number(item.quantity) >
        product.stock_quantity
      ) {
        toast.error(
          `${product.name}: only ${product.stock_quantity} units available.`
        );

        return false;
      }
    }

    return true;
  };

  const createOrder = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!validateOrder()) {
      return;
    }

    const validItems =
      items.filter(
        (item) =>
          item.product &&
          Number(item.quantity) > 0
      );

    setSaving(true);

    try {
      await api.post(
        "/orders/",
        {
          customer:
            Number(
              formData.customer
            ),

          remarks:
            formData.remarks,

          items:
            validItems.map(
              (item) => ({
                product:
                  Number(
                    item.product
                  ),

                quantity:
                  Number(
                    item.quantity
                  ),

                retail_price:
                  Number(
                    item.retail_price
                  ),

                price_type:
                  item.price_type,
              })
            ),
        }
      );

      toast.success(
        "Sales Order created successfully."
      );

      resetForm();

      await Promise.all([
        loadOrders(),
        loadProducts(),
      ]);
    } catch (error: any) {
      console.error(
        "Create Order Error:",
        error
      );

      toast.error(
        getErrorMessage(
          error,
          "Failed to create sales order."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * --------------------------------------------------
   * EDIT ORDER
   * --------------------------------------------------
   */

  const editOrder = (
    order: SalesOrder
  ) => {
    if (
      order.status !==
      "Pending"
    ) {
      toast.error(
        "Only Pending orders can be edited."
      );

      return;
    }

    setEditingOrder(order);

    setFormData({
      customer:
        String(order.customer),

      remarks:
        order.remarks || "",
    });

    setItems(
      order.items.map(
        (item) => ({
          product:
            item.product,

          quantity:
            item.quantity,

          retail_price:
            Number(
              item.retail_price
            ),

          price_type:
            item.price_type ||
            "Retail",
        })
      )
    );

    scrollToCreateForm();
  };

  const updateOrder = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!editingOrder) {
      return;
    }

    if (!formData.customer) {
      toast.error(
        "Please select a customer."
      );

      return;
    }

    const validItems =
      items.filter(
        (item) =>
          item.product &&
          Number(item.quantity) > 0
      );

    if (!validItems.length) {
      toast.error(
        "Add at least one product."
      );

      return;
    }

    setSaving(true);

    try {
      await api.put(
        `/orders/${editingOrder.id}/`,
        {
          customer:
            Number(
              formData.customer
            ),

          remarks:
            formData.remarks,

          items:
            validItems.map(
              (item) => ({
                product:
                  Number(
                    item.product
                  ),

                quantity:
                  Number(
                    item.quantity
                  ),

                retail_price:
                  Number(
                    item.retail_price
                  ),

                price_type:
                  item.price_type,
              })
            ),
        }
      );

      toast.success(
        "Sales Order updated successfully."
      );

      resetForm();

      await Promise.all([
        loadOrders(),
        loadProducts(),
      ]);
    } catch (error: any) {
      console.error(
        "Update Order Error:",
        error
      );

      toast.error(
        getErrorMessage(
          error,
          "Failed to update sales order."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * --------------------------------------------------
   * DELETE ORDER
   * --------------------------------------------------
   */

  const deleteOrder = async (
    id: number
  ) => {
    const order =
      orders.find(
        (item) =>
          item.id === id
      );

    if (!order) {
      return;
    }

    if (
      order.status !==
      "Pending"
    ) {
      toast.error(
        "Only Pending orders can be deleted."
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Delete ${
          order.order_number ||
          `Order #${order.id}`
        }?`
      );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/orders/${id}/`
      );

      toast.success(
        "Sales Order deleted successfully."
      );

      await loadOrders();
    } catch (error: any) {
      console.error(
        "Delete Order Error:",
        error
      );

      toast.error(
        getErrorMessage(
          error,
          "Failed to delete sales order."
        )
      );
    }
  };

  /*
   * --------------------------------------------------
   * APPROVAL WORKFLOW
   * --------------------------------------------------
   */

  const approveOrder = async (
    order: SalesOrder
  ) => {
    if (!user) {
      toast.error(
        "User information is not available."
      );

      return;
    }

    try {
      /*
       * Sales Head / Admin:
       * Pending -> Sales Head Approved
       */
      if (
        (
          user.role ===
            "sales_head" ||
          user.role ===
            "admin"
        ) &&
        order.status ===
          "Pending"
      ) {
        await api.post(
          `/orders/${order.id}/sales-head-approve/`
        );

        toast.success(
          "Sales Head approval successful."
        );
      }

      /*
       * Manager / Admin:
       * Sales Head Approved -> Manager Approved
       */
      else if (
        (
          user.role ===
            "manager" ||
          user.role ===
            "admin"
        ) &&
        order.status ===
          "Sales Head Approved"
      ) {
        await api.post(
          `/orders/${order.id}/manager-approve/`
        );

        toast.success(
          "Manager approval successful."
        );
      }

      else {
        toast.error(
          "You are not authorized for the next approval step."
        );

        return;
      }

      await loadOrders();
    } catch (error: any) {
      console.error(
        "Approval Error:",
        error
      );

      toast.error(
        getErrorMessage(
          error,
          "Approval failed."
        )
      );
    }
  };

  /*
   * --------------------------------------------------
   * CONVERT TO INVOICE
   * --------------------------------------------------
   */

  const convertToInvoice = async (
    order: SalesOrder
  ) => {
    if (
      user?.role !==
        "manager" &&
      user?.role !==
        "admin"
    ) {
      toast.error(
        "Only a Manager or Admin can create an invoice."
      );

      return;
    }

    if (
      order.status !==
      "Manager Approved"
    ) {
      toast.error(
        "Manager approval is required before invoicing."
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Create an invoice for ${
          order.order_number ||
          `Order #${order.id}`
        }?`
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await api.post(
          `/orders/${order.id}/invoice/`
        );

      const invoiceNumber =
        response.data
          ?.invoice_number;

      toast.success(
        invoiceNumber
          ? `Invoice ${invoiceNumber} created successfully.`
          : "Invoice created successfully."
      );

      await loadOrders();
    } catch (error: any) {
      console.error(
        "Invoice Error:",
        error
      );

      toast.error(
        getErrorMessage(
          error,
          "Failed to create invoice."
        )
      );
    }
  };

  /*
   * --------------------------------------------------
   * COLLAPSIBLE ORDERS
   * --------------------------------------------------
   */

  const toggleOrder = (
    id: number
  ) => {
    setExpandedOrders(
      (current) => {
        const next =
          new Set(current);

        if (
          next.has(id)
        ) {
          next.delete(id);
        } else {
          next.add(id);
        }

        return next;
      }
    );
  };

  /*
   * --------------------------------------------------
   * SEARCH / FILTER
   * --------------------------------------------------
   */

  const filteredOrders =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return orders.filter(
        (order) => {
          const matchesStatus =
            statusFilter ===
              "All" ||
            order.status ===
              statusFilter;

          if (
            !matchesStatus
          ) {
            return false;
          }

          if (!query) {
            return true;
          }

          const orderNumber =
            order.order_number
              ?.toLowerCase() ||
            "";

          const customer =
            order.customer_name
              ?.toLowerCase() ||
            "";

          const salesRep =
            order.sales_rep_name
              ?.toLowerCase() ||
            "";

          const productsText =
            order.items
              ?.map(
                (item) =>
                  item.product_name
                    ?.toLowerCase() ||
                  ""
              )
              .join(" ") ||
            "";

          return (
            orderNumber.includes(
              query
            ) ||
            customer.includes(
              query
            ) ||
            salesRep.includes(
              query
            ) ||
            productsText.includes(
              query
            )
          );
        }
      );
    }, [
      orders,
      search,
      statusFilter,
    ]);

  /*
   * --------------------------------------------------
   * STATUS COUNTS
   * --------------------------------------------------
   */

  const statusCounts =
    useMemo(() => {
      return {
        all:
          orders.length,

        pending:
          orders.filter(
            (order) =>
              order.status ===
              "Pending"
          ).length,

        salesHeadApproved:
          orders.filter(
            (order) =>
              order.status ===
              "Sales Head Approved"
          ).length,

        managerApproved:
          orders.filter(
            (order) =>
              order.status ===
              "Manager Approved"
          ).length,

        invoiced:
          orders.filter(
            (order) =>
              order.status ===
              "Invoiced"
          ).length,
      };
    }, [orders]);

  /*
   * --------------------------------------------------
   * STATUS STYLING
   * --------------------------------------------------
   */

  const getStatusClass = (
    status: string
  ) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";

      case "Sales Head Approved":
        return "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200";

      case "Manager Approved":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";

      case "Invoiced":
        return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";

      case "Completed":
        return "bg-green-50 text-green-700 ring-1 ring-green-200";

      case "Rejected":
        return "bg-red-50 text-red-700 ring-1 ring-red-200";

      case "Cancelled":
        return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";

      default:
        return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
    }
  };

  const getWarehouseClass = (
    status: string
  ) => {
    switch (status) {
      case "Delivered":
        return "text-emerald-700";

      case "Dispatched":
        return "text-blue-700";

      case "Packed":
        return "text-violet-700";

      case "Picking":
        return "text-amber-700";

      default:
        return "text-slate-500";
    }
  };

  /*
   * --------------------------------------------------
   * LOADING STATE
   * --------------------------------------------------
   */

  if (loading) {
    return (
      <AppShell
        title="Sales Orders"
        subtitle="Create, approve and manage customer sales orders."
        breadcrumbs={[
          {
            label: "Dashboard",
            href: "/dashboard",
          },
          {
            label: "Sales Orders",
          },
        ]}
      >
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="animate-pulse space-y-5">
              <div className="h-8 w-56 rounded bg-slate-200" />

              <div className="h-12 w-full rounded-xl bg-slate-100" />

              <div className="h-12 w-full rounded-xl bg-slate-100" />

              <div className="h-64 w-full rounded-xl bg-slate-100" />
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  /*
   * --------------------------------------------------
   * MAIN PAGE
   * --------------------------------------------------
   */

  return (
    <AppShell
      title="Sales Orders"
      subtitle="Create, approve and manage customer sales orders."
      breadcrumbs={[
        {
          label: "Dashboard",
          href: "/dashboard",
        },
        {
          label: "Sales Orders",
        },
      ]}
      actions={[
        {
          label: showCreateForm
            ? "New Order"
            : "New Order",
          href: "#create-order",
        },
      ]}
    >
      <div className="space-y-6">

        {/* -------------------------------------------
            SUMMARY CARDS
        -------------------------------------------- */}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">

          <button
            type="button"
            onClick={() =>
              setStatusFilter("All")
            }
            className={`rounded-2xl border p-4 text-left transition ${
              statusFilter ===
              "All"
                ? "border-indigo-300 bg-indigo-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              All Orders
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {statusCounts.all}
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setStatusFilter(
                "Pending"
              )
            }
            className={`rounded-2xl border p-4 text-left transition ${
              statusFilter ===
              "Pending"
                ? "border-amber-300 bg-amber-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Pending
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {statusCounts.pending}
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setStatusFilter(
                "Sales Head Approved"
              )
            }
            className={`rounded-2xl border p-4 text-left transition ${
              statusFilter ===
              "Sales Head Approved"
                ? "border-indigo-300 bg-indigo-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Sales Head
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {
                statusCounts.salesHeadApproved
              }
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setStatusFilter(
                "Manager Approved"
              )
            }
            className={`rounded-2xl border p-4 text-left transition ${
              statusFilter ===
              "Manager Approved"
                ? "border-emerald-300 bg-emerald-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Manager
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {
                statusCounts.managerApproved
              }
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setStatusFilter(
                "Invoiced"
              )
            }
            className={`rounded-2xl border p-4 text-left transition ${
              statusFilter ===
              "Invoiced"
                ? "border-blue-300 bg-blue-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Invoiced
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {statusCounts.invoiced}
            </p>
          </button>

        </div>

        {/* -------------------------------------------
            CREATE / EDIT ORDER FORM
        -------------------------------------------- */}

        {showCreateForm && (
          <section
            id="create-order"
            className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white shadow-sm"
          >

            <div className="border-b border-slate-200 px-6 py-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <div className="flex items-center gap-3">

                    <h2 className="text-lg font-semibold text-slate-900">
                      {editingOrder
                        ? "Edit Sales Order"
                        : "Create Sales Order"}
                    </h2>

                    {editingOrder && (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                        Editing
                      </span>
                    )}

                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {editingOrder
                      ? "Update this Pending sales order before approval."
                      : "Create a customer order with one or more products."}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 px-4 py-3 text-right">

                  <p className="text-xs text-slate-500">
                    Order Total
                  </p>

                  <p className="text-lg font-bold text-slate-900">
                    {formatNaira(
                      grandTotal
                    )}
                  </p>

                </div>

              </div>

            </div>

            <form
              onSubmit={
                editingOrder
                  ? updateOrder
                  : createOrder
              }
              className="space-y-6 p-6"
            >

              {/* CUSTOMER */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Customer
                </label>

                <select
                  value={
                    formData.customer
                  }
                  onChange={(
                    event
                  ) =>
                    setFormData(
                      (current) => ({
                        ...current,
                        customer:
                          event.target
                            .value,
                      })
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  required
                >

                  <option value="">
                    Select customer
                  </option>

                  {customers.map(
                    (customer) => (
                      <option
                        key={
                          customer.id
                        }
                        value={
                          customer.id
                        }
                      >
                        {
                          customer.name
                        }
                      </option>
                    )
                  )}

                </select>
              </div>

              {/* ORDER ITEMS */}

              <div className="space-y-4">

                <div className="flex items-center justify-between">

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Order Items
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {items.length} product
                      {items.length !==
                      1
                        ? "s"
                        : ""}{" "}
                      ·{" "}
                      {totalQuantity} unit
                      {totalQuantity !==
                      1
                        ? "s"
                        : ""}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      addItem
                    }
                    className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                  >
                    + Add Product
                  </button>

                </div>

                {items.map(
                  (
                    item,
                    index
                  ) => {
                    const selectedProduct =
                      products.find(
                        (
                          product
                        ) =>
                          product.id ===
                          Number(
                            item.product
                          )
                      );

                    const lineTotal =
                      Number(
                        item.quantity
                      ) *
                      Number(
                        item.retail_price
                      );

                    return (
                      <div
                        key={
                          index
                        }
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                      >

                        {/* ITEM HEADER */}

                        <div className="mb-4 flex items-center justify-between">

                          <div className="flex items-center gap-3">

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-slate-700 shadow-sm">
                              {index +
                                1}
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                Product{" "}
                                {index +
                                  1}
                              </p>

                              {selectedProduct && (
                                <p className="text-xs text-slate-500">
                                  Available stock:{" "}
                                  <strong>
                                    {
                                      selectedProduct.stock_quantity
                                    }
                                  </strong>
                                </p>
                              )}
                            </div>

                          </div>

                          {items.length >
                            1 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeItem(
                                  index
                                )
                              }
                              className="text-sm font-medium text-red-600 hover:text-red-700"
                            >
                              Remove
                            </button>
                          )}

                        </div>

                        {/* ITEM FIELDS */}

                        <div className="grid gap-4 md:grid-cols-12">

                          {/* PRODUCT */}

                          <div className="md:col-span-5">

                            <label className="mb-2 block text-xs font-medium text-slate-600">
                              Product
                            </label>

                            <select
                              value={
                                item.product
                              }
                              onChange={(
                                event
                              ) =>
                                handleProductChange(
                                  index,
                                  event
                                    .target
                                    .value
                                )
                              }
                              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                              required
                            >

                              <option value="">
                                Select product
                              </option>

                              {products.map(
                                (
                                  product
                                ) => (
                                  <option
                                    key={
                                      product.id
                                    }
                                    value={
                                      product.id
                                    }
                                  >
                                    {
                                      product.name
                                    }{" "}
                                    —{" "}
                                    {
                                      product.sku
                                    }
                                  </option>
                                )
                              )}

                            </select>

                          </div>

                          {/* PRICE TYPE */}

                          <div className="md:col-span-3">

                            <label className="mb-2 block text-xs font-medium text-slate-600">
                              Price Type
                            </label>

                            <select
                              value={
                                item.price_type
                              }
                              onChange={(
                                event
                              ) =>
                                handlePriceTypeChange(
                                  index,
                                  event
                                    .target
                                    .value as
                                    | "Retail"
                                    | "Wholesale"
                                )
                              }
                              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            >

                              <option value="Retail">
                                Retail
                              </option>

                              <option value="Wholesale">
                                Wholesale
                              </option>

                            </select>

                          </div>

                          {/* QUANTITY */}

                          <div className="md:col-span-2">

                            <label className="mb-2 block text-xs font-medium text-slate-600">
                              Quantity
                            </label>

                            <input
                              type="number"
                              min="1"
                              value={
                                item.quantity
                              }
                              onChange={(
                                event
                              ) =>
                                updateItem(
                                  index,
                                  {
                                    quantity:
                                      Math.max(
                                        1,
                                        Number(
                                          event
                                            .target
                                            .value
                                        ) ||
                                          1
                                      ),
                                  }
                                )
                              }
                              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                              required
                            />

                          </div>

                          {/* LINE TOTAL */}

                          <div className="md:col-span-2">

                            <label className="mb-2 block text-xs font-medium text-slate-600">
                              Line Total
                            </label>

                            <div className="flex h-[46px] items-center rounded-xl bg-white px-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200">
                              {formatNaira(
                                lineTotal
                              )}
                            </div>

                          </div>

                        </div>

                        {/* PRODUCT INFORMATION */}

                        {selectedProduct && (
                          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-200 pt-4 text-xs">

                            <span className="text-slate-500">
                              Retail:{" "}
                              <strong className="text-slate-700">
                                {formatNaira(
                                  selectedProduct.retail_price
                                )}
                              </strong>
                            </span>

                            <span className="text-slate-500">
                              Wholesale:{" "}
                              <strong className="text-slate-700">
                                {formatNaira(
                                  selectedProduct.wholesale_price
                                )}
                              </strong>
                            </span>

                            <span
                              className={
                                selectedProduct.stock_quantity <
                                Number(
                                  item.quantity
                                )
                                  ? "font-semibold text-red-600"
                                  : "font-semibold text-emerald-600"
                              }
                            >
                              Available:{" "}
                              {
                                selectedProduct.stock_quantity
                              }
                            </span>

                          </div>
                        )}

                      </div>
                    );
                  }
                )}

              </div>

              {/* REMARKS */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Remarks
                  <span className="ml-1 font-normal text-slate-400">
                    (optional)
                  </span>
                </label>

                <textarea
                  value={
                    formData.remarks
                  }
                  onChange={(
                    event
                  ) =>
                    setFormData(
                      (current) => ({
                        ...current,
                        remarks:
                          event.target
                            .value,
                      })
                    )
                  }
                  rows={3}
                  placeholder="Add any relevant order notes..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

              </div>

              {/* ORDER SUMMARY */}

              <div className="rounded-2xl bg-slate-900 p-5 text-white">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <p className="text-sm text-slate-300">
                      Order Summary
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      {items.length} product
                      {items.length !==
                      1
                        ? "s"
                        : ""}{" "}
                      ·{" "}
                      {totalQuantity} total unit
                      {totalQuantity !==
                      1
                        ? "s"
                        : ""}
                    </p>

                  </div>

                  <div className="text-left sm:text-right">

                    <p className="text-xs text-slate-400">
                      Grand Total
                    </p>

                    <p className="text-2xl font-bold">
                      {formatNaira(
                        grandTotal
                      )}
                    </p>

                  </div>

                </div>

              </div>

              {/* FORM ACTIONS */}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

                {editingOrder && (
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                    }}
                    className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel Edit
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                  }}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Clear
                </button>

                <button
                  type="submit"
                  disabled={
                    saving
                  }
                  className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? editingOrder
                      ? "Updating Order..."
                      : "Creating Order..."
                    : editingOrder
                      ? "Update Sales Order"
                      : "Create Sales Order"}
                </button>

              </div>

            </form>

          </section>
        )}

        {/* -------------------------------------------
            SALES ORDER REGISTER
        -------------------------------------------- */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* REGISTER HEADER */}

          <div className="border-b border-slate-200 p-5">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <h2 className="text-lg font-semibold text-slate-900">
                  Sales Order Register
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredOrders.length} order
                  {filteredOrders.length !==
                  1
                    ? "s"
                    : ""}{" "}
                  displayed
                </p>

              </div>

              <div className="flex flex-col gap-3 sm:flex-row">

                <input
                  type="text"
                  value={
                    search
                  }
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event.target
                        .value
                    )
                  }
                  placeholder="Search order, customer, product..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-80"
                />

                <select
                  value={
                    statusFilter
                  }
                  onChange={(
                    event
                  ) =>
                    setStatusFilter(
                      event.target
                        .value
                    )
                  }
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >

                  <option value="All">
                    All Statuses
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Sales Head Approved">
                    Sales Head Approved
                  </option>

                  <option value="Manager Approved">
                    Manager Approved
                  </option>

                  <option value="Invoiced">
                    Invoiced
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Rejected">
                    Rejected
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                </select>

              </div>

            </div>

          </div>

          {/* EMPTY STATE */}

          {filteredOrders.length ===
          0 ? (
            <div className="p-12 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">

                <svg
                  className="h-6 w-6 text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h4m5-9-3-3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7Z"
                  />
                </svg>

              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                No sales orders found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or status filter.
              </p>

            </div>
          ) : (

            /* ---------------------------------------
               TABLE
            ---------------------------------------- */

            <div className="overflow-x-auto">

              <table className="min-w-[1200px] w-full">

                <thead>

                  <tr className="border-b border-slate-200 bg-slate-50">

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Order
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Customer
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Items
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Total
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Warehouse
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Sales Rep
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredOrders.map(
                    (order) => {

                      const canSalesHeadApprove =
                        (
                          user?.role ===
                            "sales_head" ||
                          user?.role ===
                            "admin"
                        ) &&
                        order.status ===
                          "Pending";

                      const canManagerApprove =
                        (
                          user?.role ===
                            "manager" ||
                          user?.role ===
                            "admin"
                        ) &&
                        order.status ===
                          "Sales Head Approved";

                      const canInvoice =
                        (
                          user?.role ===
                            "manager" ||
                          user?.role ===
                            "admin"
                        ) &&
                        order.status ===
                          "Manager Approved";

                      const canEdit =
                        order.status ===
                        "Pending";

                      const canDelete =
                        order.status ===
                        "Pending";

                      const isExpanded =
                        expandedOrders.has(
                          order.id
                        );

                      return (
                        <tr
                          key={
                            order.id
                          }
                          className="transition hover:bg-slate-50"
                        >

                          {/* ORDER */}

                          <td className="px-5 py-4 align-top">

                            <p className="font-semibold text-slate-900">
                              {order.order_number ||
                                `#${order.id}`}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              ID #
                              {
                                order.id
                              }
                            </p>

                          </td>

                          {/* CUSTOMER */}

                          <td className="px-5 py-4 align-top">

                            <p className="font-medium text-slate-900">
                              {
                                order.customer_name
                              }
                            </p>

                          </td>

                          {/* COLLAPSIBLE ITEMS */}

                          <td className="px-5 py-4 align-top">

                            <button
                              type="button"
                              onClick={() =>
                                toggleOrder(
                                  order.id
                                )
                              }
                              className="flex items-center gap-2 text-left"
                            >

                              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-lg font-medium text-slate-600 transition hover:bg-slate-200">
                                {isExpanded
                                  ? "−"
                                  : "+"}
                              </span>

                              <span>
                                <span className="block text-sm font-semibold text-slate-800">
                                  {
                                    order.items
                                      ?.length
                                  }{" "}
                                  product
                                  {
                                    order
                                      .items
                                      ?.length !==
                                    1
                                      ? "s"
                                      : ""}
                                </span>

                                {!isExpanded &&
                                  order.items
                                    ?.length >
                                    0 && (
                                    <span className="mt-1 block max-w-[260px] truncate text-xs text-slate-500">
                                      {
                                        order
                                          .items[0]
                                          ?.product_name
                                      }

                                      {order
                                        .items
                                        .length >
                                        1 &&
                                        ` + ${
                                          order
                                            .items
                                            .length -
                                          1
                                        } more`}
                                    </span>
                                  )}
                              </span>

                            </button>

                            {isExpanded && (
                              <div className="mt-3 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">

                                <div className="space-y-2">

                                  {order.items?.map(
                                    (
                                      item
                                    ) => (
                                      <div
                                        key={
                                          item.id ??
                                          `${order.id}-${item.product}`
                                        }
                                        className="flex items-center justify-between gap-4 border-b border-slate-200 pb-2 text-sm last:border-0 last:pb-0"
                                      >

                                        <div className="min-w-0">

                                          <p className="truncate font-medium text-slate-700">
                                            {
                                              item.product_name
                                            }
                                          </p>

                                          <p className="mt-0.5 text-xs text-slate-400">
                                            {item.price_type ||
                                              "Retail"}{" "}
                                            ·{" "}
                                            {formatNaira(
                                              item.retail_price
                                            )}
                                          </p>

                                        </div>

                                        <span className="shrink-0 rounded-lg bg-white px-2 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                                          ×{" "}
                                          {
                                            item.quantity
                                          }
                                        </span>

                                      </div>
                                    )
                                  )}

                                </div>

                              </div>
                            )}

                          </td>

                          {/* TOTAL */}

                          <td className="px-5 py-4 text-right align-top">

                            <p className="font-semibold text-slate-900">
                              {formatNaira(
                                order.total_amount
                              )}
                            </p>

                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4 align-top">

                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                                order.status
                              )}`}
                            >
                              {
                                order.status
                              }
                            </span>

                          </td>

                          {/* WAREHOUSE */}

                          <td className="px-5 py-4 align-top">

                            <span
                              className={`text-sm font-medium ${getWarehouseClass(
                                order.warehouse_status ||
                                  "Pending"
                              )}`}
                            >
                              {
                                order.warehouse_status ||
                                "Pending"
                              }
                            </span>

                          </td>

                          {/* SALES REP */}

                          <td className="px-5 py-4 align-top">

                            <span className="text-sm text-slate-700">
                              {
                                order.sales_rep_name
                              }
                            </span>

                          </td>

                          {/* DATE */}

                          <td className="px-5 py-4 align-top">

                            <span className="text-sm text-slate-600">
                              {formatDate(
                                order.created_at
                              )}
                            </span>

                          </td>

                          {/* ACTIONS */}

                          <td className="px-5 py-4 align-top">

                            <div className="flex flex-wrap justify-end gap-2">

                              {/* EDIT */}

                              {canEdit && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    editOrder(
                                      order
                                    )
                                  }
                                  className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
                                >
                                  Edit
                                </button>
                              )}

                              {/* SALES HEAD / FIRST APPROVAL */}

                              {canSalesHeadApprove && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    approveOrder(
                                      order
                                    )
                                  }
                                  className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                                >
                                  Approve
                                </button>
                              )}

                              {/* MANAGER / SECOND APPROVAL */}

                              {canManagerApprove && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    approveOrder(
                                      order
                                    )
                                  }
                                  className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
                                >
                                  Approve
                                </button>
                              )}

                              {/* INVOICE */}

                              {canInvoice && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    convertToInvoice(
                                      order
                                    )
                                  }
                                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                                >
                                  Invoice
                                </button>
                              )}

                              {/* DELETE */}

                              {canDelete && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteOrder(
                                      order.id
                                    )
                                  }
                                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                                >
                                  Delete
                                </button>
                              )}

                              {/* NO ACTION */}

                              {!canEdit &&
                                !canSalesHeadApprove &&
                                !canManagerApprove &&
                                !canInvoice &&
                                !canDelete && (
                                  <span className="text-xs text-slate-400">
                                    No actions
                                  </span>
                                )}

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>
    </AppShell>
  );
}