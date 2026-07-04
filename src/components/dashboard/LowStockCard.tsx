interface Props {
  products: any[];
}

export default function LowStockCard({
  products,
}: Props) {
  return (
    <div
      className="
      bg-white
      rounded-3xl
      shadow-lg
      border
      border-red-100
      p-6
      "
    >
      <div className="flex items-center gap-3 mb-4">

        <span className="text-3xl">
          ⚠️
        </span>

        <h2 className="text-2xl font-bold text-red-600">
          Low Stock Alerts
        </h2>

      </div>

      {products.length === 0 ? (

        <div className="bg-green-50 text-green-700 p-4 rounded-xl">
          All products are adequately stocked.
        </div>

      ) : (

        <div className="space-y-3">

          {products.map((product) => (

            <div
              key={product.id}
              className="
              flex
              justify-between
              rounded-xl
              bg-red-50
              p-4
              "
            >
              <span>{product.name}</span>

              <span className="font-bold text-red-600">
                {product.stock_quantity}
              </span>

            </div>

          ))}

        </div>

      )}
    </div>
  );
}