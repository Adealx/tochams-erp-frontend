"use client";

interface Props {
  formData: {
    vendor: string;
    expected_delivery: string;
    status: string;
    notes: string;
  };

  vendors: {
    id: number;
    company_name: string;
  }[];

  editing: boolean;

  onChange: (
    field: string,
    value: string
  ) => void;
}

export default function ProcurementInformation({
  formData,
  vendors,
  editing,
  onChange,
}: Props) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
        p-8
      "
    >
      <div className="mb-8">

        <h2 className="text-xl font-bold">

          Purchase Information

        </h2>

        <p className="text-slate-500 mt-2">

          Enter procurement details.

        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Vendor */}

        <div>

          <label className="mb-2 block font-medium">

            Vendor

          </label>

          <select
            value={formData.vendor}
            onChange={(e) =>
              onChange(
                "vendor",
                e.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              p-3
            "
          >
            <option value="">
              Select Vendor
            </option>

            {vendors.map((vendor) => (

              <option
                key={vendor.id}
                value={vendor.id}
              >
                {vendor.company_name}
              </option>

            ))}

          </select>

        </div>

        {/* Delivery */}

        <div>

          <label className="mb-2 block font-medium">

            Expected Delivery

          </label>

          <input
            type="date"
            value={formData.expected_delivery}
            onChange={(e) =>
              onChange(
                "expected_delivery",
                e.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              p-3
            "
          />

        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">

        {/* Status */}

        <div>

          <label className="mb-2 block font-medium">

            Status

          </label>

          <input
            readOnly
            value={
              editing
                ? formData.status
                : "Draft"
            }
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              bg-slate-100
              p-3
            "
          />

        </div>

        {/* Notes */}

        <div>

          <label className="mb-2 block font-medium">

            Notes

          </label>

          <textarea
            rows={4}
            value={formData.notes}
            onChange={(e) =>
              onChange(
                "notes",
                e.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              p-3
            "
          />

        </div>

      </div>

    </div>
  );
}