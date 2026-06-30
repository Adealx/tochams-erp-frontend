"use client";

interface Props {
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
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl w-[420px] p-6 shadow-xl">

        <h2 className="text-2xl font-bold mb-4">
          Delete Procurement
        </h2>

        <p className="text-gray-600">
          Are you sure you want to delete
        </p>

        <p className="font-bold text-xl mt-2">
          {poNumber}
        </p>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded border"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}