interface Props {
  customers: any[];
}

export default function RecentCustomers({
  customers,
}: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">

      <h2 className="text-xl font-bold mb-4">
        Recent Customers
      </h2>

      <div className="space-y-3">

        {customers.slice(0, 5).map((customer: any) => (

          <div
            key={customer.id}
            className="border-b pb-3"
          >

            <p className="font-semibold">
              {customer.name}
            </p>

            <p className="text-gray-500 text-sm">
              {customer.email}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}