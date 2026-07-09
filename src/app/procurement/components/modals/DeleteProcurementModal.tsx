"use client";

import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";

interface DeleteProcurementModalProps {
  open: boolean;
  poNumber: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteProcurementModal({
  open,
  poNumber,
  onClose,
  onConfirm,
}: DeleteProcurementModalProps) {
  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-slate-900/60
        backdrop-blur-sm
        p-4
      "
    >
      <div
        className="
          w-full
          max-w-md
          overflow-hidden
          rounded-3xl
          bg-white
          shadow-2xl
        "
      >
        {/* Header */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-200
            px-6
            py-5
          "
        >
          <div className="flex items-center gap-4">

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-red-100
                text-red-600
              "
            >
              <AlertTriangle size={24} />
            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Delete Procurement
              </h2>

              <p className="text-sm text-slate-500">
                This action cannot be undone.
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="
              rounded-xl
              p-2
              text-slate-500
              transition
              hover:bg-slate-100
            "
          >
            <X size={20} />
          </button>

        </div>

        {/* Body */}

        <div className="px-6 py-6">

          <p className="text-slate-600">
            You are about to permanently delete the
            following purchase order:
          </p>

          <div
            className="
              mt-5
              rounded-2xl
              border
              border-red-200
              bg-red-50
              p-4
            "
          >
            <p className="text-sm text-slate-500">
              Purchase Order
            </p>

            <h3 className="mt-1 text-lg font-bold text-red-700">
              {poNumber}
            </h3>

          </div>

        </div>

        {/* Footer */}

        <div
          className="
            flex
            justify-end
            gap-3
            border-t
            border-slate-200
            bg-slate-50
            px-6
            py-5
          "
        >
          <button
            onClick={onClose}
            className="
              rounded-xl
              border
              border-slate-300
              px-5
              py-2.5
              font-medium
              text-slate-700
              transition
              hover:bg-white
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-red-600
              px-5
              py-2.5
              font-semibold
              text-white
              transition
              hover:bg-red-700
            "
          >
            <Trash2 size={18} />

            Delete Procurement

          </button>

        </div>

      </div>
    </div>
  );
}