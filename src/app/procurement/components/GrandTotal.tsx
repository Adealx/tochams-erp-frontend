"use client";

interface GrandTotalProps {
  total: number;
}

export default function GrandTotal({
  total,
}: GrandTotalProps) {
  return (
    <div className="mt-8">

      <div className="flex justify-end">

        <div className="w-full md:w-80 bg-gray-50 border rounded-xl p-6 shadow-sm">

          <div className="flex justify-between items-center mb-3">

            <span className="text-lg font-medium text-gray-700">
              Grand Total
            </span>

            <span className="text-3xl font-bold text-green-600">
              ₦{total.toLocaleString()}
            </span>

          </div>

          <hr className="my-3" />

          <p className="text-sm text-gray-500">
            Total value of all procurement items.
          </p>

        </div>

      </div>

    </div>
  );
}