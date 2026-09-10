"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Check,
  Mail,
  MapPin,
  Phone,
  Save,
  UserPlus,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";

import AppShell from "@/components/layout/AppShell";
import { createCustomer } from "@/services/customerService";

interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
}

export default function AddCustomer() {
  const router = useRouter();

  const [formData, setFormData] =
    useState<CustomerFormData>({
      name: "",
      email: "",
      phone: "",
      address: "",
      company: "",
    });

  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Customer name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email address is required");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    if (!formData.address.trim()) {
      toast.error("Address is required");
      return;
    }

    if (!formData.company.trim()) {
      toast.error("Company is required");
      return;
    }

    try {
      setSaving(true);

      await createCustomer({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        company: formData.company.trim(),
      });

      toast.success(
        "Customer created successfully"
      );

      router.push("/customers");
      router.refresh();

    } catch (error: any) {
      console.error(
        "Error creating customer:",
        error
      );

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Failed to create customer";

      toast.error(message);

    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell
      title="New Customer"
      subtitle="Create a new customer account"
      breadcrumbs={[
        {
          label: "Dashboard",
          href: "/dashboard",
        },
        {
          label: "Customers",
          href: "/customers",
        },
        {
          label: "New Customer",
        },
      ]}
    >
      <div className="mx-auto max-w-4xl">

        {/* Back */}

        <Link
          href="/customers"
          className="
            mb-6
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-slate-500
            transition
            hover:text-blue-600
          "
        >
          <ArrowLeft size={17} />
          Back to Customers
        </Link>

        {/* Header Card */}

        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 bg-slate-50 px-6 py-5">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <UserPlus size={24} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Customer Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the customer's contact and business
                  information below.
                </p>
              </div>

            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6"
          >

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* Customer Name */}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Customer Name
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">
                  <UserRound
                    size={17}
                    className="
                      pointer-events-none
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      py-3
                      pl-10
                      pr-4
                      text-sm
                      text-slate-800
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-100
                    "
                    required
                  />
                </div>
              </div>

              {/* Company */}

              <div>
                <label
                  htmlFor="company"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Company
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">
                  <Building2
                    size={17}
                    className="
                      pointer-events-none
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      py-3
                      pl-10
                      pr-4
                      text-sm
                      text-slate-800
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-100
                    "
                    required
                  />
                </div>
              </div>

              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="
                      pointer-events-none
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="customer@example.com"
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      py-3
                      pl-10
                      pr-4
                      text-sm
                      text-slate-800
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-100
                    "
                    required
                  />
                </div>
              </div>

              {/* Phone */}

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Phone Number
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">
                  <Phone
                    size={17}
                    className="
                      pointer-events-none
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="
                      w-full
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      py-3
                      pl-10
                      pr-4
                      text-sm
                      text-slate-800
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-100
                    "
                    required
                  />
                </div>
              </div>

              {/* Address */}

              <div className="md:col-span-2">

                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Address
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">
                  <MapPin
                    size={17}
                    className="
                      pointer-events-none
                      absolute
                      left-3
                      top-3.5
                      text-slate-400
                    "
                  />

                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter customer's full address"
                    rows={4}
                    className="
                      w-full
                      resize-none
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      py-3
                      pl-10
                      pr-4
                      text-sm
                      text-slate-800
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-100
                    "
                    required
                  />
                </div>

              </div>

            </div>

            {/* Information Notice */}

            <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-4">

              <div className="flex gap-3">

                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Check size={17} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    Customer account
                  </p>

                  <p className="mt-1 text-xs leading-5 text-blue-700">
                    Once created, this customer can be used
                    for sales orders, invoices, payments and
                    customer account statements.
                  </p>
                </div>

              </div>

            </div>

            {/* Actions */}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

              <Link
                href="/customers"
                className="
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-5
                  text-sm
                  font-semibold
                  text-slate-700
                  transition
                  hover:bg-slate-50
                "
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-blue-600
                  px-6
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-blue-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Save Customer
                  </>
                )}
              </button>

            </div>

          </form>

        </div>

      </div>
    </AppShell>
  );
}