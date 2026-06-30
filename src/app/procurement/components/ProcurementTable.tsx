"use client";

interface Procurement {
  id: number;
  po_number: string;
  vendor_name: string;
  status: string;
  total_amount: number;
  order_date: string;
}

interface ProcurementTableProps {
  procurements: Procurement[];

  onView?: (id: number) => void;

  onEdit?: (id: number) => void;

  onDelete?: (id: number) => void;

  onSubmit?: (id: number) => void;

  onApprove?: (id: number) => void;

  onReject?: (id: number) => void;
}

export default function ProcurementTable({
  procurements,
  onView,
  onEdit,
  onDelete,
  onSubmit,
  onApprove,
  onReject,
}: ProcurementTableProps) {
  return (
    <div className="mt-10 bg-white rounded-2xl shadow-lg p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Procurement Orders
        </h2>

        <span className="text-gray-500">
          Total Orders: {procurements.length}
        </span>

      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full border border-gray-200">

          <thead className="bg-gray-100">

            <tr>

              <th className="border px-4 py-3 text-left">
                PO Number
              </th>

              <th className="border px-4 py-3 text-left">
                Vendor
              </th>

              <th className="border px-4 py-3 text-left">
                Status
              </th>

              <th className="border px-4 py-3 text-right">
                Total
              </th>

              <th className="border px-4 py-3 text-center">
                Order Date
              </th>

              <th className="border px-4 py-3 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {procurements.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="text-center py-8 text-gray-500"
                >
                  No procurement orders found.
                </td>

              </tr>

            ) : (

              procurements.map((procurement) => (

                <tr
                  key={procurement.id}
                  className="hover:bg-gray-50"
                >

                  <td className="border px-4 py-3 font-semibold">
                    {procurement.po_number}
                  </td>

                  <td className="border px-4 py-3">
                    {procurement.vendor_name}
                  </td>

                  <td className="border px-4 py-3">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium
                        ${
                          procurement.status === "Draft"
                            ? "bg-yellow-100 text-yellow-700"
                            : procurement.status === "Submitted"
                            ? "bg-blue-100 text-blue-700"
                            : procurement.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : procurement.status === "Ordered"
                            ? "bg-purple-100 text-purple-700"
                            : procurement.status === "Received"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {procurement.status}
                    </span>

                  </td>

                  <td className="border px-4 py-3 text-right font-semibold">
                    ₦
                    {Number(
                      procurement.total_amount
                    ).toLocaleString()}
                  </td>

                  <td className="border px-4 py-3 text-center">
                    {new Date(
                      procurement.order_date
                    ).toLocaleDateString()}
                  </td>

                  <td className="border px-4 py-3">

                    <div className="flex flex-wrap justify-center gap-2">

                      <button
                        onClick={() => onView?.(procurement.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      >
                        View
                      </button>

                      {procurement.status === "Draft" && (
                        <>
                          <button
                            onClick={() => onEdit?.(procurement.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => onSubmit?.(procurement.id)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                          >
                            Submit
                          </button>

                          <button
                            onClick={() => onDelete?.(procurement.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </>
                      )}

                      {procurement.status === "Pending Approval" && (
                        <>
                          <button
                            onClick={() => onApprove?.(procurement.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => onReject?.(procurement.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {procurement.status === "Approved" && (
                        <span className="text-green-700 font-semibold">
                          Awaiting PO Email
                        </span>
                      )}

                      {procurement.status === "Rejected" && (
                        <span className="text-red-600 font-semibold">
                          Rejected
                        </span>
                      )}

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}