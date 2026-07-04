interface Props {
  orders: any[];
}

export default function RecentOrders({
  orders,
}: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">

      <div className="flex justify-between items-center mb-4">

        <h2 className="text-xl font-bold">
          Recent Orders
        </h2>

        <button
          onClick={() =>
            (window.location.href = "/sales-orders")
          }
          className="text-blue-600 hover:text-blue-800"
        >
          View All
        </button>

      </div>

      <div className="space-y-3">

        {orders.slice(0, 5).map((order: any) => (

          <div
            key={order.id}
            className="flex justify-between border-b pb-3"
          >

            <div>

              <p className="font-semibold">
                {order.customer_name}
              </p>

              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  order.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : order.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "Rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {order.status}
              </span>

            </div>

            <div className="font-bold">
              ₦{Number(order.total_amount || 0).toLocaleString()}
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}