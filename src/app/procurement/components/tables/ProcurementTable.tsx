"use client";

import DataTable, {
  Column,
} from "@/components/table/DataTable";

import StatusBadge from "@/components/ui/StatusBadge";

import ProcurementActions from "../ProcurementActions";

interface Procurement {
  id: number;
  po_number: string;
  vendor_name: string;
  status: string;
  total_amount: number;
  order_date: string;
}

interface Props {
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
}: Props) {

  const columns: Column<Procurement>[] = [

    {
      key: "po_number",
      title: "PO Number",
      sortable: true,
      size: "md",
    },

    {
      key: "vendor_name",
      title: "Vendor",
      sortable: true,
      size: "lg",
    },

    {
      key: "status",
      title: "Status",
      sortable: true,
      size: "sm",
      align: "center",

      render: (procurement) => (
        <StatusBadge
          status={procurement.status}
        />
      ),
    },

    {
      key: "total_amount",
      title: "Total",
      sortable: true,
      size: "md",
      align: "right",

      render: (procurement) => (
        <span className="font-semibold tabular-nums">
          ₦{Number(
            procurement.total_amount
          ).toLocaleString()}
        </span>
      ),
    },

    {
      key: "order_date",
      title: "Order Date",
      sortable: true,
      size: "sm",
      align: "center",

      render: (procurement) => (
        <span className="whitespace-nowrap">
          {new Date(
            procurement.order_date
          ).toLocaleDateString()}
        </span>
      ),
    },

    {
      key: "actions",
      title: "Actions",
      size: "xl",
      align: "center",

      render: (procurement) => (
        <ProcurementActions
          procurement={procurement}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onSubmit={onSubmit}
          onApprove={onApprove}
          onReject={onReject}
        />
      ),
    },

  ];

  return (

    <DataTable
      columns={columns}
      data={procurements}
      rowKey="id"

      searchable
      selectable

      striped
      hover

      pageSize={10}

      emptyMessage="No procurement orders found."

      className="shadow-md"
    />

  );

}