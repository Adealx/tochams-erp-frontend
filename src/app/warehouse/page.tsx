"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock3,
  Search,
  RefreshCw,
  ChevronRight,
  X,
  Warehouse as WarehouseIcon,
  Boxes,
  ClipboardList,
  AlertTriangle,
} from "lucide-react";

import api from "@/services/api";
import AppShell from "@/components/layout/AppShell";
import RoleGuard from "@/components/RoleGuard";


/* ============================================================
   TYPES
============================================================ */

interface SalesOrderItem {
  id?: number;
  product: number;
  product_name?: string;
  quantity: number;
  retail_price?: number;
  line_total?: number;
}

interface SalesOrder {
  id: number;
  order_number?: string;
  sales_rep_name?: string;
  customer: number;
  customer_name?: string;
  total_amount: number;
  status: string;
  warehouse_status?: string;
  items: SalesOrderItem[];
  created_at: string;
  updated_at?: string;
}

type WarehouseStatus =
  | "Pending"
  | "Picking"
  | "Packed"
  | "Dispatched"
  | "Delivered";


/* ============================================================
   STATUS CONFIGURATION
============================================================ */

const STATUS_CONFIG: Record<
  WarehouseStatus,
  {
    label: string;
    description: string;
    icon: typeof Clock3;
    className: string;
  }
> = {
  Pending: {
    label: "Pending",
    description: "Waiting for warehouse processing",
    icon: Clock3,
    className:
      "bg-slate-100 text-slate-700 border-slate-200",
  },

  Picking: {
    label: "Picking",
    description: "Warehouse is picking products",
    icon: Boxes,
    className:
      "bg-amber-50 text-amber-700 border-amber-200",
  },

  Packed: {
    label: "Packed",
    description: "Products have been packed",
    icon: Package,
    className:
      "bg-blue-50 text-blue-700 border-blue-200",
  },

  Dispatched: {
    label: "Dispatched",
    description: "Order has left the warehouse",
    icon: Truck,
    className:
      "bg-purple-50 text-purple-700 border-purple-200",
  },

  Delivered: {
    label: "Delivered",
    description: "Order delivered to customer",
    icon: CheckCircle2,
    className:
      "bg-green-50 text-green-700 border-green-200",
  },
};


/* ============================================================
   STATUS ORDER
============================================================ */

const STATUS_ORDER: Record<
  WarehouseStatus,
  number
> = {
  Pending: 0,
  Picking: 1,
  Packed: 2,
  Dispatched: 3,
  Delivered: 4,
};


/* ============================================================
   HELPERS
============================================================ */

function getStatus(
  status?: string
): WarehouseStatus {
  if (
    status === "Picking" ||
    status === "Packed" ||
    status === "Dispatched" ||
    status === "Delivered"
  ) {
    return status;
  }

  return "Pending";
}


function formatCurrency(
  amount: number
) {
  return `₦${Number(
    amount || 0
  ).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}


function formatDate(
  value?: string
) {
  if (!value) return "—";

  return new Date(
    value
  ).toLocaleDateString(
    "en-NG",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}


/* ============================================================
   PAGE
============================================================ */

export default function WarehousePage() {

  const [orders, setOrders] =
    useState<SalesOrder[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<"All" | WarehouseStatus>("All");

  const [selectedOrder, setSelectedOrder] =
    useState<SalesOrder | null>(null);

  const [updatingOrderId, setUpdatingOrderId] =
    useState<number | null>(null);


  /* ==========================================================
     LOAD ORDERS
  ========================================================== */

  useEffect(() => {
    loadOrders();
  }, []);


  const loadOrders = async () => {

    try {

      setRefreshing(true);

      const response =
        await api.get("/orders/");

      const data =
        Array.isArray(response.data)
          ? response.data
          : response.data?.results || [];

      setOrders(data);

    } catch (error) {

      console.error(error);

      toast.error(
        "Unable to load warehouse orders."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);
    }
  };


  /* ==========================================================
     WAREHOUSE STATUS UPDATE
  ========================================================== */

  const updateWarehouseStatus = async (
    order: SalesOrder,
    nextStatus: WarehouseStatus
  ) => {

    const currentStatus =
      getStatus(order.warehouse_status);


    /* --------------------------------------------------------
       Prevent backward movement in UI
    -------------------------------------------------------- */

    if (
      STATUS_ORDER[nextStatus] <=
      STATUS_ORDER[currentStatus]
    ) {
      toast.error(
        "Warehouse status cannot move backwards."
      );

      return;
    }


    /* --------------------------------------------------------
       Dispatch confirmation
    -------------------------------------------------------- */

    if (
      nextStatus === "Dispatched"
    ) {

      const confirmed =
        window.confirm(
          `Dispatch ${order.order_number || `Order #${order.id}`}?\n\n` +
          "This action will deduct the reserved quantity from physical stock " +
          "and mark the inventory reservations as fulfilled."
        );

      if (!confirmed) {
        return;
      }
    }


    try {

      setUpdatingOrderId(
        order.id
      );

      await api.post(
        `/orders/${order.id}/warehouse/`,
        {
          warehouse_status:
            nextStatus,
        }
      );


      toast.success(
        `Order moved to ${nextStatus}.`
      );


      await loadOrders();


      setSelectedOrder(
        (current) =>
          current?.id === order.id
            ? {
                ...current,
                warehouse_status:
                  nextStatus,
                status:
                  nextStatus === "Delivered"
                    ? "Completed"
                    : current.status,
              }
            : current
      );

    } catch (error: any) {

      console.error(error);

      const message =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        `Unable to move order to ${nextStatus}.`;

      toast.error(message);

    } finally {

      setUpdatingOrderId(null);
    }
  };


  /* ==========================================================
     FILTER ORDERS
  ========================================================== */

  const filteredOrders =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();

      return orders.filter(
        (order) => {

          const warehouseStatus =
            getStatus(
              order.warehouse_status
            );

          const matchesStatus =
            statusFilter === "All" ||
            warehouseStatus ===
              statusFilter;

          const matchesSearch =
            !query ||
            (
              order.order_number ||
              ""
            )
              .toLowerCase()
              .includes(query) ||
            (
              order.customer_name ||
              ""
            )
              .toLowerCase()
              .includes(query) ||
            (
              order.sales_rep_name ||
              ""
            )
              .toLowerCase()
              .includes(query) ||
            order.items?.some(
              (item) =>
                (
                  item.product_name ||
                  ""
                )
                  .toLowerCase()
                  .includes(query)
            );

          return (
            matchesStatus &&
            matchesSearch
          );
        }
      );

    }, [
      orders,
      search,
      statusFilter,
    ]);


  /* ==========================================================
     SUMMARY COUNTS
  ========================================================== */

  const counts =
    useMemo(() => {

      const result = {
        Pending: 0,
        Picking: 0,
        Packed: 0,
        Dispatched: 0,
        Delivered: 0,
      };

      orders.forEach(
        (order) => {

          const status =
            getStatus(
              order.warehouse_status
            );

          result[status]++;
        }
      );

      return result;

    }, [orders]);


  /* ==========================================================
     NEXT STATUS
  ========================================================== */

  const getNextStatus = (
    status: WarehouseStatus
  ): WarehouseStatus | null => {

    if (status === "Pending")
      return "Picking";

    if (status === "Picking")
      return "Packed";

    if (status === "Packed")
      return "Dispatched";

    if (status === "Dispatched")
      return "Delivered";

    return null;
  };


  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {

    return (
      <AppShell
        title="Warehouse"
        subtitle="Manage order picking, packing, dispatch and delivery."
        breadcrumbs={[
          {
            label: "Dashboard",
            href: "/dashboard",
          },
          {
            label: "Warehouse",
          },
        ]}
      >

        <div className="flex items-center justify-center py-20">

          <div className="text-center">

            <RefreshCw
              className="mx-auto animate-spin text-slate-400"
              size={30}
            />

            <p className="mt-4 text-slate-500">
              Loading warehouse orders...
            </p>

          </div>

        </div>

      </AppShell>
    );
  }


  /* ==========================================================
     PAGE
  ========================================================== */

  return (

    <RoleGuard
      roles={[
        "warehouse",
        "manager",
        "admin",
      ]}
    >

      <AppShell

        title="Warehouse"

        subtitle="Process approved sales orders from picking through delivery."

        breadcrumbs={[
          {
            label: "Dashboard",
            href: "/dashboard",
          },
          {
            label: "Warehouse",
          },
        ]}

        actions={[
          {
            label: "Refresh",
            href: "#refresh",
          },
        ]}
      >

        <div className="space-y-6">


          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">

                  <WarehouseIcon
                    size={24}
                  />

                </div>

                <div>

                  <h1 className="text-2xl font-bold text-slate-900">
                    Warehouse Operations
                  </h1>

                  <p className="text-sm text-slate-500">
                    Pick, pack, dispatch and deliver customer orders.
                  </p>

                </div>

              </div>

            </div>


            <button
              id="refresh"
              type="button"
              onClick={loadOrders}
              disabled={refreshing}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-medium
                text-slate-700
                shadow-sm
                transition
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh

            </button>

          </div>


          {/* ==================================================
              OPERATIONAL WARNING
          ================================================== */}

          <div className="
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-amber-200
            bg-amber-50
            p-4
          ">

            <AlertTriangle
              className="mt-0.5 shrink-0 text-amber-600"
              size={20}
            />

            <div>

              <p className="font-semibold text-amber-900">
                Dispatch control
              </p>

              <p className="mt-1 text-sm text-amber-800">
                Dispatching an order deducts physical stock,
                creates a stock OUT movement and fulfills its
                inventory reservation. Cost of Sales accounting
                will be connected after Accounts confirms the
                official Inventory and Cost of Sales accounts.
              </p>

            </div>

          </div>


          {/* ==================================================
              KPI CARDS
          ================================================== */}

          <div className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-5
          ">

            {(
              Object.keys(
                STATUS_CONFIG
              ) as WarehouseStatus[]
            ).map((status) => {

              const config =
                STATUS_CONFIG[status];

              const Icon =
                config.icon;

              const active =
                statusFilter === status;

              return (

                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    setStatusFilter(
                      active
                        ? "All"
                        : status
                    )
                  }
                  className={`
                    rounded-2xl
                    border
                    bg-white
                    p-5
                    text-left
                    shadow-sm
                    transition
                    hover:-translate-y-0.5
                    hover:shadow-md
                    ${
                      active
                        ? "ring-2 ring-slate-900"
                        : ""
                    }
                  `}
                >

                  <div className="flex items-center justify-between">

                    <div className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-slate-100
                    ">

                      <Icon
                        size={20}
                        className="text-slate-700"
                      />

                    </div>

                    <span className="text-2xl font-bold text-slate-900">
                      {counts[status]}
                    </span>

                  </div>

                  <p className="mt-4 font-semibold text-slate-900">
                    {config.label}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {config.description}
                  </p>

                </button>

              );
            })}

          </div>


          {/* ==================================================
              SEARCH / FILTER
          ================================================== */}

          <div className="
            flex
            flex-col
            gap-3
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-4
            shadow-sm
            md:flex-row
          ">

            <div className="relative flex-1">

              <Search
                size={18}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search order, customer, sales rep or product..."
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  py-2.5
                  pl-10
                  pr-4
                  text-sm
                  outline-none
                  transition
                  focus:border-slate-400
                  focus:ring-2
                  focus:ring-slate-100
                "
              />

            </div>


            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as
                    | "All"
                    | WarehouseStatus
                )
              }
              className="
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-2.5
                text-sm
                outline-none
                focus:border-slate-400
              "
            >

              <option value="All">
                All Warehouse Statuses
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Picking">
                Picking
              </option>

              <option value="Packed">
                Packed
              </option>

              <option value="Dispatched">
                Dispatched
              </option>

              <option value="Delivered">
                Delivered
              </option>

            </select>

          </div>


          {/* ==================================================
              ORDER TABLE
          ================================================== */}

          <div className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
          ">

            <div className="border-b border-slate-200 px-6 py-4">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="font-semibold text-slate-900">
                    Warehouse Queue
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {filteredOrders.length} order
                    {filteredOrders.length === 1
                      ? ""
                      : "s"} displayed
                  </p>

                </div>

                <ClipboardList
                  size={20}
                  className="text-slate-400"
                />

              </div>

            </div>


            {filteredOrders.length === 0 ? (

              <div className="px-6 py-16 text-center">

                <Package
                  size={40}
                  className="mx-auto text-slate-300"
                />

                <h3 className="mt-4 font-semibold text-slate-700">
                  No warehouse orders found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or status filter.
                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="min-w-full">

                  <thead className="bg-slate-50">

                    <tr>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Order
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Customer
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Products
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Order Status
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Warehouse
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Value
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Action
                      </th>

                    </tr>

                  </thead>


                  <tbody className="divide-y divide-slate-100">

                    {filteredOrders.map(
                      (order) => {

                        const warehouseStatus =
                          getStatus(
                            order.warehouse_status
                          );

                        const config =
                          STATUS_CONFIG[
                            warehouseStatus
                          ];

                        const Icon =
                          config.icon;

                        const nextStatus =
                          getNextStatus(
                            warehouseStatus
                          );

                        const isUpdating =
                          updatingOrderId ===
                          order.id;

                        return (

                          <tr
                            key={order.id}
                            className="transition hover:bg-slate-50"
                          >

                            {/* ORDER */}

                            <td className="px-6 py-4">

                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedOrder(
                                    order
                                  )
                                }
                                className="text-left"
                              >

                                <p className="font-semibold text-slate-900 hover:underline">
                                  {order.order_number ||
                                    `Order #${order.id}`}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {formatDate(
                                    order.created_at
                                  )}
                                </p>

                              </button>

                            </td>


                            {/* CUSTOMER */}

                            <td className="px-6 py-4">

                              <p className="font-medium text-slate-800">
                                {order.customer_name ||
                                  "Customer"}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {order.sales_rep_name ||
                                  "—"}
                              </p>

                            </td>


                            {/* PRODUCTS */}

                            <td className="px-6 py-4">

                              <div className="max-w-xs space-y-1">

                                {order.items
                                  ?.slice(0, 3)
                                  .map(
                                    (item) => (

                                      <div
                                        key={
                                          item.id ||
                                          `${order.id}-${item.product}`
                                        }
                                        className="text-sm text-slate-700"
                                      >

                                        <span className="font-medium">
                                          {item.product_name ||
                                            `Product #${item.product}`}
                                        </span>

                                        <span className="ml-2 text-slate-400">
                                          × {item.quantity}
                                        </span>

                                      </div>

                                    )
                                  )}

                                {(order.items?.length || 0) >
                                  3 && (

                                  <p className="text-xs text-slate-500">
                                    +
                                    {(order.items?.length || 0) -
                                      3}{" "}
                                    more
                                  </p>

                                )}

                              </div>

                            </td>


                            {/* ORDER STATUS */}

                            <td className="px-6 py-4">

                              <span className="
                                inline-flex
                                rounded-full
                                bg-slate-100
                                px-3
                                py-1
                                text-xs
                                font-medium
                                text-slate-700
                              ">

                                {order.status}

                              </span>

                            </td>


                            {/* WAREHOUSE STATUS */}

                            <td className="px-6 py-4">

                              <span
                                className={`
                                  inline-flex
                                  items-center
                                  gap-1.5
                                  rounded-full
                                  border
                                  px-3
                                  py-1.5
                                  text-xs
                                  font-semibold
                                  ${config.className}
                                `}
                              >

                                <Icon
                                  size={14}
                                />

                                {warehouseStatus}

                              </span>

                            </td>


                            {/* VALUE */}

                            <td className="px-6 py-4 text-right">

                              <p className="font-semibold text-slate-900">
                                {formatCurrency(
                                  order.total_amount
                                )}
                              </p>

                            </td>


                            {/* ACTION */}

                            <td className="px-6 py-4 text-right">

                              <div className="flex justify-end">

                                {nextStatus ? (

                                  <button
                                    type="button"
                                    disabled={
                                      isUpdating
                                    }
                                    onClick={() =>
                                      updateWarehouseStatus(
                                        order,
                                        nextStatus
                                      )
                                    }
                                    className="
                                      inline-flex
                                      items-center
                                      gap-1.5
                                      rounded-xl
                                      bg-slate-900
                                      px-3
                                      py-2
                                      text-xs
                                      font-semibold
                                      text-white
                                      transition
                                      hover:bg-slate-700
                                      disabled:cursor-not-allowed
                                      disabled:opacity-50
                                    "
                                  >

                                    {isUpdating ? (

                                      <RefreshCw
                                        size={14}
                                        className="animate-spin"
                                      />

                                    ) : (

                                      <>
                                        {nextStatus}

                                        <ChevronRight
                                          size={14}
                                        />
                                      </>

                                    )}

                                  </button>

                                ) : (

                                  <span className="
                                    inline-flex
                                    items-center
                                    gap-1
                                    text-xs
                                    font-medium
                                    text-green-600
                                  ">

                                    <CheckCircle2
                                      size={14}
                                    />

                                    Complete

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

          </div>

        </div>


        {/* ====================================================
            ORDER DETAIL DRAWER
        ==================================================== */}

        {selectedOrder && (

          <div className="
            fixed
            inset-0
            z-50
            flex
            justify-end
          ">

            {/* BACKDROP */}

            <button
              type="button"
              aria-label="Close order details"
              onClick={() =>
                setSelectedOrder(null)
              }
              className="
                absolute
                inset-0
                cursor-default
                bg-slate-950/40
              "
            />


            {/* DRAWER */}

            <aside className="
              relative
              z-10
              h-full
              w-full
              max-w-xl
              overflow-y-auto
              bg-white
              shadow-2xl
            ">

              {/* HEADER */}

              <div className="
                sticky
                top-0
                z-20
                flex
                items-center
                justify-between
                border-b
                bg-white
                px-6
                py-5
              ">

                <div>

                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Warehouse Order
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {selectedOrder.order_number ||
                      `Order #${selectedOrder.id}`}
                  </h2>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    setSelectedOrder(null)
                  }
                  className="
                    rounded-xl
                    p-2
                    text-slate-500
                    hover:bg-slate-100
                    hover:text-slate-900
                  "
                >

                  <X
                    size={20}
                  />

                </button>

              </div>


              <div className="space-y-6 p-6">


                {/* CUSTOMER */}

                <div className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-5
                ">

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Customer
                  </p>

                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {selectedOrder.customer_name ||
                      "Customer"}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Sales Rep:{" "}
                    {selectedOrder.sales_rep_name ||
                      "—"}
                  </p>

                </div>


                {/* STATUS PROGRESS */}

                <div>

                  <h3 className="font-semibold text-slate-900">
                    Warehouse Progress
                  </h3>

                  <div className="mt-4 space-y-3">

                    {(
                      Object.keys(
                        STATUS_CONFIG
                      ) as WarehouseStatus[]
                    ).map(
                      (status) => {

                        const current =
                          getStatus(
                            selectedOrder.warehouse_status
                          );

                        const completed =
                          STATUS_ORDER[
                            current
                          ] >=
                          STATUS_ORDER[
                            status
                          ];

                        const config =
                          STATUS_CONFIG[
                            status
                          ];

                        const Icon =
                          config.icon;

                        return (

                          <div
                            key={status}
                            className={`
                              flex
                              items-center
                              gap-3
                              rounded-xl
                              border
                              p-3
                              ${
                                completed
                                  ? "border-green-200 bg-green-50"
                                  : "border-slate-200 bg-white"
                              }
                            `}
                          >

                            <div className={`
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-full
                              ${
                                completed
                                  ? "bg-green-600 text-white"
                                  : "bg-slate-100 text-slate-400"
                              }
                            `}>

                              <Icon
                                size={17}
                              />

                            </div>

                            <div className="flex-1">

                              <p className={`
                                text-sm
                                font-semibold
                                ${
                                  completed
                                    ? "text-green-800"
                                    : "text-slate-600"
                                }
                              `}>

                                {status}

                              </p>

                              <p className="text-xs text-slate-500">
                                {config.description}
                              </p>

                            </div>

                            {completed && (

                              <CheckCircle2
                                size={17}
                                className="text-green-600"
                              />

                            )}

                          </div>

                        );

                      }
                    )}

                  </div>

                </div>


                {/* PRODUCTS */}

                <div>

                  <div className="flex items-center justify-between">

                    <h3 className="font-semibold text-slate-900">
                      Order Products
                    </h3>

                    <span className="text-xs text-slate-500">
                      {selectedOrder.items?.length || 0} item
                      {(selectedOrder.items?.length || 0) === 1
                        ? ""
                        : "s"}
                    </span>

                  </div>


                  <div className="
                    mt-3
                    divide-y
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                  ">

                    {selectedOrder.items?.map(
                      (item) => (

                        <div
                          key={
                            item.id ||
                            `${selectedOrder.id}-${item.product}`
                          }
                          className="flex items-center justify-between gap-4 p-4"
                        >

                          <div>

                            <p className="font-medium text-slate-800">
                              {item.product_name ||
                                `Product #${item.product}`}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              Product ID:{" "}
                              {item.product}
                            </p>

                          </div>

                          <div className="text-right">

                            <p className="font-semibold text-slate-900">
                              × {item.quantity}
                            </p>

                            {item.line_total !==
                              undefined && (

                              <p className="mt-1 text-xs text-slate-500">
                                {formatCurrency(
                                  Number(
                                    item.line_total
                                  )
                                )}
                              </p>

                            )}

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>


                {/* ORDER TOTAL */}

                <div className="
                  flex
                  items-center
                  justify-between
                  rounded-2xl
                  bg-slate-900
                  p-5
                  text-white
                ">

                  <span className="text-sm text-slate-300">
                    Order Value
                  </span>

                  <span className="text-xl font-bold">
                    {formatCurrency(
                      selectedOrder.total_amount
                    )}
                  </span>

                </div>


                {/* ACTIONS */}

                {(() => {

                  const currentStatus =
                    getStatus(
                      selectedOrder.warehouse_status
                    );

                  const nextStatus =
                    getNextStatus(
                      currentStatus
                    );

                  if (!nextStatus) {
                    return (
                      <div className="
                        rounded-2xl
                        border
                        border-green-200
                        bg-green-50
                        p-5
                        text-center
                      ">

                        <CheckCircle2
                          size={28}
                          className="mx-auto text-green-600"
                        />

                        <p className="mt-2 font-semibold text-green-800">
                          Order Delivered
                        </p>

                        <p className="mt-1 text-sm text-green-700">
                          Warehouse processing is complete.
                        </p>

                      </div>
                    );
                  }

                  const isUpdating =
                    updatingOrderId ===
                    selectedOrder.id;

                  return (

                    <div>

                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          updateWarehouseStatus(
                            selectedOrder,
                            nextStatus
                          )
                        }
                        className="
                          flex
                          w-full
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          bg-slate-900
                          px-5
                          py-3
                          text-sm
                          font-semibold
                          text-white
                          transition
                          hover:bg-slate-700
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >

                        {isUpdating ? (

                          <>
                            <RefreshCw
                              size={17}
                              className="animate-spin"
                            />

                            Updating...

                          </>

                        ) : (

                          <>
                            Move to {nextStatus}

                            <ChevronRight
                              size={17}
                            />

                          </>

                        )}

                      </button>


                      {nextStatus ===
                        "Dispatched" && (

                        <p className="
                          mt-3
                          text-center
                          text-xs
                          text-amber-600
                        ">

                          Dispatch will deduct physical stock
                          and fulfill inventory reservations.

                        </p>

                      )}

                    </div>

                  );

                })()}

              </div>

            </aside>

          </div>

        )}

      </AppShell>

    </RoleGuard>
  );
}