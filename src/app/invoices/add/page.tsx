"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { getCustomers } from "@/services/customerService";
import { getProducts } from "@/services/productService";
import { createInvoice } from "@/services/invoiceService";

export default function AddInvoice() {

    const router = useRouter();

    const [customers, setCustomers] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);

    const [customer, setCustomer] = useState("");

    const [dueDate, setDueDate] = useState("");

    const [items, setItems] = useState([
        {
            product: "",
            quantity: 1,
            discount: 0,
            vat: 0,
        },
    ]);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {

        const customersData = await getCustomers();

        const productsData = await getProducts();

        setCustomers(customersData);

        setProducts(productsData);
    }

    function updateItem(index: number, field: string, value: any) {

        const copy = [...items];

        copy[index] = {

            ...copy[index],

            [field]: value,

        };

        setItems(copy);
    }

    function addRow() {

        setItems([

            ...items,

            {

                product: "",

                quantity: 1,

                discount: 0,

                vat: 0,

            },

        ]);
    }

    function removeRow(index: number) {

        if (items.length === 1) return;

        setItems(

            items.filter((_, i) => i !== index)

        );
    }

    async function handleSubmit(e: React.FormEvent) {

        e.preventDefault();

        try {

            await createInvoice({

                customer,

                due_date: dueDate,

                items,

            });

            toast.success("Invoice Created");

            router.push("/invoices");

        } catch (error: any) {

            console.log(error.response?.data);

            toast.error("Unable to create invoice.");

        }

    }

    return (

        <div className="max-w-5xl mx-auto p-8">

            <h1 className="text-3xl font-bold mb-8">

                Create Invoice

            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-8"
            >

                <div className="grid grid-cols-2 gap-6">

                    <select
                        required
                        value={customer}
                        onChange={(e)=>setCustomer(e.target.value)}
                        className="border rounded-lg p-3"
                    >

                        <option value="">
                            Select Customer
                        </option>

                        {customers.map((customer)=>(

                            <option
                                key={customer.id}
                                value={customer.id}
                            >
                                {customer.name}
                            </option>

                        ))}

                    </select>

                    <input

                        type="date"

                        value={dueDate}

                        onChange={(e)=>setDueDate(e.target.value)}

                        className="border rounded-lg p-3"

                        required

                    />

                </div>

                <div className="bg-white rounded-xl shadow">

                    <table className="w-full">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="p-3">Product</th>

                                <th>Qty</th>

                                <th>Discount</th>

                                <th>VAT</th>

                                <th></th>

                            </tr>

                        </thead>

                        <tbody>

                            {items.map((item,index)=>(

                                <tr key={index}>

                                    <td className="p-3">

                                        <select

                                            value={item.product}

                                            onChange={(e)=>

                                                updateItem(

                                                    index,

                                                    "product",

                                                    e.target.value

                                                )

                                            }

                                            className="border rounded p-2 w-full"

                                            required

                                        >

                                            <option value="">

                                                Select Product

                                            </option>

                                            {products.map((product)=>(

                                                <option

                                                    key={product.id}

                                                    value={product.id}

                                                >

                                                    {product.name}

                                                </option>

                                            ))}

                                        </select>

                                    </td>

                                    <td>

                                        <input

                                            type="number"

                                            value={item.quantity}

                                            onChange={(e)=>

                                                updateItem(

                                                    index,

                                                    "quantity",

                                                    Number(e.target.value)

                                                )

                                            }

                                            className="border rounded p-2 w-24"

                                        />

                                    </td>

                                    <td>

                                        <input

                                            type="number"

                                            value={item.discount}

                                            onChange={(e)=>

                                                updateItem(

                                                    index,

                                                    "discount",

                                                    Number(e.target.value)

                                                )

                                            }

                                            className="border rounded p-2 w-24"

                                        />

                                    </td>

                                    <td>

                                        <input

                                            type="number"

                                            value={item.vat}

                                            onChange={(e)=>

                                                updateItem(

                                                    index,

                                                    "vat",

                                                    Number(e.target.value)

                                                )

                                            }

                                            className="border rounded p-2 w-24"

                                        />

                                    </td>

                                    <td>

                                        <button

                                            type="button"

                                            onClick={()=>removeRow(index)}

                                            className="text-red-600"

                                        >

                                            Remove

                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

                <button

                    type="button"

                    onClick={addRow}

                    className="bg-gray-200 px-4 py-2 rounded"

                >

                    + Add Product

                </button>

                <div>

                    <button

                        className="bg-blue-600 text-white px-6 py-3 rounded-lg"

                    >

                        Save Invoice

                    </button>

                </div>

            </form>

        </div>

    );

}