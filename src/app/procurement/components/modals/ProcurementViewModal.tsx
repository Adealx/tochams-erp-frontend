"use client";

interface ProcurementItem {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface Procurement {
  id: number;
  po_number: string;
  vendor_name: string;
  order_date: string;
  expected_delivery: string;
  status: string;
  notes: string;
  total_amount: number;
  items: ProcurementItem[];
}

interface ProcurementViewModalProps {
  procurement: Procurement | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProcurementViewModal({
  procurement,
  isOpen,
  onClose,
}: ProcurementViewModalProps) {
  if (!isOpen || !procurement) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl p-8 max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">
            Procurement Order
          </h2>

          <button
            onClick={onClose}
            className="text-2xl font-bold text-gray-500 hover:text-red-600"
          >
            ✕
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <div>
            <p className="text-gray-500">PO Number</p>
            <p className="font-semibold">{procurement.po_number}</p>
          </div>

          <div>
            <p className="text-gray-500">Vendor</p>
            <p className="font-semibold">{procurement.vendor_name}</p>
          </div>

          <div>
            <p className="text-gray-500">Order Date</p>
            <p>
              {new Date(
                procurement.order_date
              ).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Expected Delivery
            </p>

            <p>
              {procurement.expected_delivery
                ? new Date(
                    procurement.expected_delivery
                  ).toLocaleDateString()
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Status
            </p>

            <p>{procurement.status}</p>
          </div>

          <div>
            <p className="text-gray-500">
              Notes
            </p>

            <p>{procurement.notes || "-"}</p>
          </div>

        </div>

        <h3 className="text-xl font-bold mb-4">
          Procurement Items
        </h3>

        <table className="min-w-full border">

          <thead className="bg-gray-100">

            <tr>

              <th className="border p-3 text-left">
                Product
              </th>

              <th className="border p-3">
                Qty
              </th>

              <th className="border p-3">
                Cost Price
              </th>

              <th className="border p-3">
                Total
              </th>

            </tr>

          </thead>

          <tbody>

            {procurement.items.map((item) => (

              <tr key={item.id}>

                <td className="border p-3">
                  {item.product_name}
                </td>

                <td className="border p-3 text-center">
                  {item.quantity}
                </td>

                <td className="border p-3 text-right">
                  ₦
                  {Number(
                    item.unit_price
                  ).toLocaleString()}
                </td>

                <td className="border p-3 text-right">
                  ₦
                  {Number(
                    item.total
                  ).toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

        <div className="mt-8 flex justify-end">
          <div className="text-2xl font-bold">
            Grand Total: ₦
            {Number(
              procurement.total_amount
            ).toLocaleString()}
          </div>
        </div>

      </div>
    </div>
  );
}