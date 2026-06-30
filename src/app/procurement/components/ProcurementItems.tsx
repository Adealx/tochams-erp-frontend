"use client";

interface Product {
  id: number;
  name: string;
  cost_price: number;
}

interface ProcurementItem {
  product: string;
  quantity: number;
  unit_price: number;
}

interface ProcurementItemsProps {
  products: Product[];
  items: ProcurementItem[];
  addItem: () => void;
  removeItem: (index: number) => void;
  updateItem: (
    index: number,
    field: keyof ProcurementItem,
    value: any
  ) => void;
}

export default function ProcurementItems({
  products,
  items,
  addItem,
  removeItem,
  updateItem,
}: ProcurementItemsProps) {
  console.log("Products:", products);

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Procurement Items
        </h2>

        <button
          type="button"
          onClick={addItem}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          + Add Product
        </button>
      </div>

      {items.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-12 gap-4 mb-5 items-end"
        >
          {/* Product */}
          <div className="col-span-5">
            <label className="block mb-2 font-medium">
              Product
            </label>

            <select
              className="w-full border rounded-lg p-3"
              value={item.product}
              onChange={(e) => {
                const productId = Number(e.target.value);

                updateItem(index, "product", e.target.value);

                const selected = products.find(
                   (p) => p.id === Number(productId)
                );

                if (selected) {
                  setTimeout(() => {
                    updateItem(
                      index,
                      "unit_price",
                      Number(selected.cost_price)
                    );
                  }, 0);
                }
              }}
            >
            
              <option value="">Select Product</option>

              {products.map((product) => {
                console.log("Rendering Product:", product);

                return (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Quantity */}
          <div className="col-span-2">
            <label className="block mb-2 font-medium">
              Qty
            </label>

            <input
              type="number"
              min={1}
              className="w-full border rounded-lg p-3"
              value={item.quantity}
              onChange={(e) =>
                updateItem(
                  index,
                  "quantity",
                  Number(e.target.value)
                )
              }
            />
          </div>

          {/* Unit Price */}
          <div className="col-span-2">
            <label className="block mb-2 font-medium">
              Cost Price
            </label>

            <input
              type="number"
              className="w-full border rounded-lg p-3"
              value={item.unit_price}
              onChange={(e) =>
                updateItem(
                  index,
                  "unit_price",
                  Number(e.target.value)
                )
              }
            />
          </div>

          {/* Subtotal */}
          <div className="col-span-2">
            <label className="block mb-2 font-medium">
              Subtotal
            </label>

            <div className="border rounded-lg p-3 bg-gray-100 font-semibold">
              ₦
              {(
                Number(item.quantity) *
                Number(item.unit_price)
              ).toLocaleString()}
            </div>
          </div>

          {/* Remove */}
          <div className="col-span-1">
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg w-full py-3"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}