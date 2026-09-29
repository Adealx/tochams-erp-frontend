"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  ReceiptText,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getCustomers,
} from "@/services/customerService";

import {
  getProducts,
} from "@/services/productService";

import {
  createInvoice,
} from "@/services/invoiceService";

import AppShell from "@/components/layout/AppShell";


interface Customer {
  id: number;
  name: string;
  is_active: boolean;
}


interface Product {
  id: number;
  name: string;
}


type Item = {
  product: string;
  quantity: number;
  discount: number;
  vat: number;
};


const input =
  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100";


export default function AddInvoice() {
  const router =
    useRouter();

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [customer, setCustomer] =
    useState("");

  const [dueDate, setDueDate] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [items, setItems] =
    useState<Item[]>([
      {
        product: "",
        quantity: 1,
        discount: 0,
        vat: 0,
      },
    ]);


  /*
   * --------------------------------------------------
   * LOAD OPTIONS
   * --------------------------------------------------
   */

  useEffect(() => {
    const loadOptions =
      async () => {
        try {
          /*
           * The normal customer endpoint is used.
           * Archived customers are additionally filtered
           * on the frontend as a safety measure.
           */
          const [
            customerData,
            productData,
          ] =
            await Promise.all([
              getCustomers(),
              getProducts(),
            ]);

          const activeCustomers =
            (
              Array.isArray(
                customerData
              )
                ? customerData
                : []
            ).filter(
              (
                entry: Customer
              ) =>
                entry.is_active ===
                true
            );

          setCustomers(
            activeCustomers
          );

          setProducts(
            Array.isArray(
              productData
            )
              ? productData
              : []
          );
        } catch (error) {
          console.error(
            "Invoice options error:",
            error
          );

          toast.error(
            "Unable to load invoice options."
          );
        }
      };

    loadOptions();
  }, []);


  /*
   * --------------------------------------------------
   * UPDATE ITEM
   * --------------------------------------------------
   */

  const updateItem = (
    index: number,
    field: keyof Item,
    value:
      | string
      | number
  ) => {
    setItems(
      (current) =>
        current.map(
          (
            item,
            itemIndex
          ) =>
            itemIndex ===
            index
              ? {
                  ...item,
                  [field]:
                    value,
                }
              : item
        )
    );
  };


  /*
   * --------------------------------------------------
   * SUBMIT
   * --------------------------------------------------
   */

  const submit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!customer) {
      toast.error(
        "Please select a customer."
      );

      return;
    }

    if (!items.length) {
      toast.error(
        "Add at least one product."
      );

      return;
    }

    setSaving(true);

    try {
      await createInvoice({
        customer,
        due_date:
          dueDate,
        items,
      });

      toast.success(
        "Invoice created"
      );

      router.push(
        "/invoices"
      );
    } catch (error: any) {
      console.error(
        "Create invoice error:",
        error
      );

      const message =
        error?.response?.data
          ?.customer ||
        error?.response?.data
          ?.detail ||
        "Unable to create invoice.";

      toast.error(
        Array.isArray(
          message
        )
          ? message[0]
          : message
      );
    } finally {
      setSaving(false);
    }
  };


  return (
    <AppShell
      title="Create invoice"
      subtitle="Issue a customer invoice with the products, quantities, and tax details required."
      breadcrumbs={[
        {
          label:
            "Dashboard",
          href: "/dashboard",
        },
        {
          label:
            "Invoices",
          href: "/invoices",
        },
        {
          label:
            "Create invoice",
        },
      ]}
    >

      <form
        onSubmit={submit}
        className="mx-auto max-w-6xl space-y-6"
      >

        {/* INVOICE DETAILS */}

        <section className="rounded-[20px] border border-slate-200/90 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,.035)] sm:p-7">

          <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">

            <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <ReceiptText
                size={19}
              />
            </span>

            <div>
              <h2 className="font-semibold text-slate-900">
                Invoice details
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Choose the customer and payment due date.
              </p>
            </div>

          </div>


          <div className="grid gap-5 md:grid-cols-2">

            <Field label="Customer">

              <select
                required
                value={
                  customer
                }
                onChange={(
                  event
                ) =>
                  setCustomer(
                    event.target
                      .value
                  )
                }
                className={
                  input
                }
              >

                <option value="">
                  Select active customer
                </option>

                {customers.map(
                  (
                    entry
                  ) => (
                    <option
                      key={
                        entry.id
                      }
                      value={
                        entry.id
                      }
                    >
                      {
                        entry.name
                      }
                    </option>
                  )
                )}

              </select>

              {customers.length ===
                0 && (
                <p className="mt-2 text-xs text-amber-600">
                  No active customers are currently available.
                </p>
              )}

            </Field>


            <Field label="Due date">

              <input
                required
                type="date"
                value={
                  dueDate
                }
                onChange={(
                  event
                ) =>
                  setDueDate(
                    event.target
                      .value
                  )
                }
                className={
                  input
                }
              />

            </Field>

          </div>

        </section>


        {/* LINE ITEMS */}

        <section className="overflow-hidden rounded-[20px] border border-slate-200/90 bg-white shadow-[0_6px_20px_rgba(15,23,42,.035)]">

          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-7">

            <div>
              <h2 className="font-semibold text-slate-900">
                Line items
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Add every product you want to bill.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setItems(
                  (
                    current
                  ) => [
                    ...current,
                    {
                      product:
                        "",
                      quantity:
                        1,
                      discount:
                        0,
                      vat: 0,
                    },
                  ]
                )
              }
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
            >
              <Plus
                size={16}
              />

              Add item
            </button>

          </div>


          <div className="overflow-x-auto">

            <div className="min-w-[780px] p-5 sm:p-7">

              <div className="grid grid-cols-[minmax(260px,1fr)_110px_130px_110px_40px] gap-3 px-1 pb-2 text-[11px] font-bold uppercase tracking-[.08em] text-slate-500">

                <span>
                  Product
                </span>

                <span>
                  Quantity
                </span>

                <span>
                  Discount
                </span>

                <span>
                  VAT
                </span>

                <span />

              </div>


              <div className="space-y-3">

                {items.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        index
                      }
                      className="grid grid-cols-[minmax(260px,1fr)_110px_130px_110px_40px] items-center gap-3 rounded-xl bg-slate-50/70 p-2"
                    >

                      <select
                        required
                        value={
                          item.product
                        }
                        onChange={(
                          event
                        ) =>
                          updateItem(
                            index,
                            "product",
                            event
                              .target
                              .value
                          )
                        }
                        className={
                          input
                        }
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
                              }
                            </option>
                          )
                        )}

                      </select>


                      <input
                        min={1}
                        type="number"
                        value={
                          item.quantity
                        }
                        onChange={(
                          event
                        ) =>
                          updateItem(
                            index,
                            "quantity",
                            Number(
                              event
                                .target
                                .value
                            )
                          )
                        }
                        className={
                          input
                        }
                      />


                      <input
                        min={0}
                        type="number"
                        value={
                          item.discount
                        }
                        onChange={(
                          event
                        ) =>
                          updateItem(
                            index,
                            "discount",
                            Number(
                              event
                                .target
                                .value
                            )
                          )
                        }
                        className={
                          input
                        }
                      />


                      <input
                        min={0}
                        type="number"
                        value={
                          item.vat
                        }
                        onChange={(
                          event
                        ) =>
                          updateItem(
                            index,
                            "vat",
                            Number(
                              event
                                .target
                                .value
                            )
                          )
                        }
                        className={
                          input
                        }
                      />


                      <button
                        type="button"
                        disabled={
                          items.length ===
                          1
                        }
                        aria-label="Remove line item"
                        onClick={() =>
                          setItems(
                            (
                              current
                            ) =>
                              current.filter(
                                (
                                  _,
                                  itemIndex
                                ) =>
                                  itemIndex !==
                                  index
                              )
                          )
                        }
                        className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Minus
                          size={17}
                        />
                      </button>

                    </div>
                  )
                )}

              </div>

            </div>

          </div>

        </section>


        {/* ACTIONS */}

        <div className="flex justify-end gap-3">

          <button
            type="button"
            onClick={() =>
              router.push(
                "/invoices"
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            disabled={
              saving ||
              customers.length ===
                0
            }
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(79,70,229,.22)] transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving
              ? "Creating…"
              : "Create invoice"}
          </button>

        </div>

      </form>

    </AppShell>
  );
}


function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700">

      <span className="mb-2 block">
        {label}
      </span>

      {children}

    </label>
  );
}