"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

interface SalesOrderItem {
  id?: number;
  product: number;
  product_name?: string;
  quantity: number;
  retail_price: number;
  line_total?: number;
}

interface SalesOrder {
  id: number;
  sales_rep_name: string;
  customer: number;
  customer_name: string;
  total_amount: number;
  status: string;
  items: SalesOrderItem[];
  created_at: string;
  updated_at: string;
}

interface Customer {
  id: number;
  name: string;
}

interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  supplier: string;
  stock: number;
  reorder_level: number;
  retail_price: string;
  wholesale_price: string;
}
  
interface OrderItemForm {
  product: number | "";
  quantity: number;
  retail_price: number;
  price_type: "Retail" | "Wholesale";
}

export default function SalesOrdersPage() {
  const [orders, setOrders] =
    useState<SalesOrder[]>([]);

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [editingOrder, setEditingOrder] =
  useState<any>(null);  

  const user =
  typeof window !== "undefined"
    ? JSON.parse(
        localStorage.getItem("user") || "{}"
      )
    : {};

  const role = user.role; 

  const [formData, setFormData] =
  useState({
    customer: "",
    status: "Pending",
  });
  
  const [items, setItems] =
  useState<OrderItemForm[]>([
  {
    product: "",
    quantity: 1,
    retail_price: 0,
    price_type: "Retail",
  }
]);
 
  const addItem = () => {

    setItems([
      ...items,
      {
        product: "",
        quantity: 1,
        retail_price: 0,
        price_type: "Retail",
      },
    ]);

  };

  const removeItem = (
  index: number
) => {

  const updated =
    items.filter(
      (_, i) =>
        i !== index
    );

  setItems(updated);

};

  useEffect(() => {
    loadOrders();
    loadCustomers();
    loadProducts();
  }, []);

  const loadOrders = async () => {
    try {
      const response =
        await api.get("/orders/");

      setOrders(response.data);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const response =
        await api.get("/customers/");

      setCustomers(response.data);
    } catch (error: any) {
      console.error(error);
    }
  };

  const loadProducts = async () => {
    try {
      const response =
        await api.get("/products/");

      console.log(
        "PRODUCTS RESPONSE",
        response.data
      );

      setProducts(response.data);
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "number"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const createOrder = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    console.log({
  customer: Number(formData.customer),
  items: items.map((item) => ({
    product: Number(item.product),
    quantity: Number(item.quantity),
    retail_price: Number(item.retail_price),
    price_type: item.price_type,
  })),
});

    try {
      await api.post(
        "/orders/",
        {
          customer: Number(
            formData.customer
          ),

          items: items.map(
            (item) => ({
              product: Number(
                item.product
          ),
              quantity: Number(
                item.quantity
          ),
          retail_price: Number(
                item.retail_price
          ),
          price_type: item.price_type,
        })
      ),
    }
  );

      alert(
        "Sales Order Created Successfully"
      );

      setFormData({
        customer: "",
        status: "Pending",
      });

      setItems([
        {
          product: "",
          quantity: 1,
          retail_price: 0,
          price_type: "Retail",
        },
      ]);

      loadOrders();
    } catch (error: any) {
      console.error(error);

      alert(
        JSON.stringify(
          error.response?.data
        )
      );
    }
  };

  const deleteOrder = async (
    id: number
  ) => {
    const confirmed = confirm(
      "Delete this order?"
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/orders/${id}/`
      );

      loadOrders();

      alert(
        "Order deleted successfully"
      );
    } catch (error: any) {
      console.error(error);

      alert(
        "Failed to delete order"
      );
    }
  };

  const editOrder = (order: any) => {

  console.log(
    "Editing Order:",
    order
  );

  setEditingOrder(order);

  setFormData({
    customer: String(order.customer),
    status: order.status,
  });

  setItems(
    order.items.map((item: any) => ({
      product: item.product,
      quantity: item.quantity,
      retail_price: item.retail_price,
      price_type: "Retail",
    }))
  );

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

};

  if (loading) {
    return (
      <div className="p-6">
        Loading Orders...
      </div>
    );
  }
  
  const approveOrder = async (
  id: number
) => {

  try {

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    if (user.role === "sales_head") {

      await api.post(
        `/orders/${id}/sales-head-approve/`
      );

      alert(
        "Sales Head Approval Successful"
      );

    } else if (
      user.role === "manager" ||
      user.role === "admin"
    ) {

      await api.post(
        `/orders/${id}/manager-approve/`
      );

      alert(
        "Manager Approval Successful"
      );

    } else {

      alert(
        "You do not have approval rights"
      );

      return;
    }

    loadOrders();

  } catch (error: any) {

    console.error(error);

    alert(
      JSON.stringify(
        error.response?.data
      )
    );
  }
};
   
  const convertToInvoice = async (
  id: number
) => {

  try {

    await api.post(
      `/orders/${id}/invoice/`
    );

    alert(
      "Invoice Created"
    );

    loadOrders();

  } catch (error: any) {

    console.error(
      "Invoice Error:",
      error
    );

    console.log(
      error.response?.data
    );

    alert(
      JSON.stringify(
        error.response?.data
      ) 
    );
  }
};
 
  const grandTotal = items.reduce(
  (sum, item) => {
    return sum + (
      Number(item.quantity) *
      Number(item.retail_price)
    );
  },
  0
);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Sales Orders
        </h1>
      </div>

      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Create Sales Order
        </h2>

        <form
  onSubmit={createOrder}
  className="space-y-4"
>

  <select
    name="customer"
    value={formData.customer}
    onChange={handleChange}
    className="border p-3 rounded w-full"
    required
  >
    <option value="">
      Select Customer
    </option>

    {customers.map((customer) => (
      <option
        key={customer.id}
        value={customer.id}
      >
        {customer.name}
      </option>
    ))}
  </select>

  {items.map((item, index) => (

    <div
      key={index}
      className="border p-4 rounded bg-gray-50"
    >

      <select
        value={item.product}
        onChange={(e) => {

          const selected =
            products.find(
              p =>
                p.id === Number(
                  e.target.value
                )
            );

          const updated = [...items];

          updated[index] = {
            ...updated[index],
            product: Number(
              e.target.value
            ),
            retail_price: selected
              ? (
                  updated[index].price_type ===
                  "Wholesale"
                    ? Number(
                        selected.wholesale_price
                      )
                    : Number(
                        selected.retail_price
                      )
                )      
              : 0,
          };

          setItems(updated);

        }}
        className="border p-3 rounded w-full"
      >

        <option value="">
          Select Product
        </option>

        {products.map((product) => (

          <option
            key={product.id}
            value={product.id}
          >
            {product.name}
          </option>

        ))}

      </select>
      
      <select
        value={item.price_type}
        onChange={(e) => {

          const updated = [...items];

          const selected =
            products.find(
              p =>
                p.id === item.product
            );

          updated[index].price_type =
            e.target.value as
            "Retail" | "Wholesale";

          if (selected) {

            updated[index].retail_price =
              updated[index].price_type ===
              "Wholesale"
                ? Number(
                    selected.wholesale_price
                  )
                : Number(
                    selected.retail_price
                  );

          }

          setItems(updated);

       }}
       className="border p-3 rounded w-full mt-2"
      >

       <option value="Retail">
         Retail Price
       </option>

       <option value="Wholesale">
         Wholesale Price
       </option>

     </select>

      <input
        type="number"
        value={item.quantity}
        onChange={(e) => {

          const updated = [...items];

          updated[index].quantity =
            Number(e.target.value);

          setItems(updated);

        }}
        placeholder="Quantity"
        className="border p-3 rounded w-full mt-2"
      />

      <div className="mt-2 text-sm">

        <div>
          Price Type:
          <strong>
            {" "}
            {item.price_type}
          </strong>
        </div>

        <div>
          Unit Price:
          ₦{Number(
            item.retail_price
          ).toLocaleString()}
        </div>

      </div>

    </div>

  ))}

  <button
    type="button"
    onClick={addItem}
    className="bg-green-600 text-white px-4 py-2 rounded"
  >
    + Add Another Product
  </button>

  <div className="text-xl font-bold">
    Grand Total:
    ₦{grandTotal.toLocaleString()}
  </div>

  <button
    type="submit"
    className="bg-blue-600 text-white px-6 py-3 rounded w-full"
  >
    Create Order
  </button>

</form>
      </div>

      <input
        type="text"
        placeholder="Search Orders..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="border p-3 rounded w-full mb-4"
      />

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">
                Customer
              </th>

              <th className="text-left p-4">
                Items
              </th>

              <th className="text-left p-4">
                Total
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-left p-4">
                Sales Rep
              </th>

              <th className="text-left p-4">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {orders

              .filter((order) => {

                const customerMatch =
                  order.customer_name
                    .toLowerCase()
                    .includes(
                      search.toLowerCase()
                    );

                const productMatch =
                  order.items?.some(
                    item =>
                      item.product_name
                        ?.toLowerCase()
                        .includes(
                          search.toLowerCase()
                        )
                  );

                return (
                  customerMatch ||
                  productMatch
                );

              })
              .map((order) => (
                <tr
                  key={order.id}
                  className="border-b"
                >
                  <td className="p-4">
                    {order.customer_name}
                  </td>

                  <td className="p-4">

                    {order.items.map(
                      (item) => (

                        <div
                          key={item.id}
                          className="mb-1"
                        >

                          {item.product_name}
                          {" × "}
                          {item.quantity}

                        </div>

                      )
                    )}
 
                  </td>

                  <td className="p-4 font-semibold">
                    ₦{order.total_amount}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded text-white ${
                        order.status ===
                        "Pending"
                          ? "bg-yellow-500"
                          : order.status ===
                            "Approved"
                          ? "bg-green-600"
                          : "bg-blue-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="p-4">
                    {
                      order.sales_rep_name
                    }
                  </td>

                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() =>
                        deleteOrder(
                          order.id
                        )
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => editOrder(order)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"      
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        approveOrder(order.id)
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                    
                  {(
                    role === "manager" ||
                    role === "admin"
                  ) && (
                    <button
                      onClick={() =>
                        convertToInvoice(order.id)
                      }
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Invoice
                    </button>
                  )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}