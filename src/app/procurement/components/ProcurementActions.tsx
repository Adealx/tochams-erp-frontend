"use client";

import {
  Eye,
  Pencil,
  Trash2,
  Send,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Procurement {
  id: number;
  status: string;
}

interface Props {
  procurement: Procurement;

  onView?: (id: number) => void;

  onEdit?: (id: number) => void;

  onDelete?: (id: number) => void;

  onSubmit?: (id: number) => void;

  onApprove?: (id: number) => void;

  onReject?: (id: number) => void;
}

export default function ProcurementActions({
  procurement,
  onView,
  onEdit,
  onDelete,
  onSubmit,
  onApprove,
  onReject,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-2">

      <button
        onClick={() =>
          onView?.(
            procurement.id
          )
        }
        className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
      >
        <Eye size={18} />
      </button>

      {procurement.status ===
        "Draft" && (
        <>
          <button
            onClick={() =>
              onEdit?.(
                procurement.id
              )
            }
            className="rounded-lg bg-green-50 p-2 text-green-600 hover:bg-green-100"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() =>
              onSubmit?.(
                procurement.id
              )
            }
            className="rounded-lg bg-indigo-50 p-2 text-indigo-600 hover:bg-indigo-100"
          >
            <Send size={18} />
          </button>

          <button
            onClick={() =>
              onDelete?.(
                procurement.id
              )
            }
            className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
          >
            <Trash2 size={18} />
          </button>
        </>
      )}

      {procurement.status ===
        "Pending Approval" && (
        <>
          <button
            onClick={() =>
              onApprove?.(
                procurement.id
              )
            }
            className="rounded-lg bg-emerald-50 p-2 text-emerald-600 hover:bg-emerald-100"
          >
            <CheckCircle size={18} />
          </button>

          <button
            onClick={() =>
              onReject?.(
                procurement.id
              )
            }
            className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
          >
            <XCircle size={18} />
          </button>
        </>
      )}
    </div>
  );
}