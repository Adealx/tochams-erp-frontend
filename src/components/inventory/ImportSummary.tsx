"use client";

export interface ImportError {
  row: number;
  sku: string;
  error: string;
}

interface ImportSummaryProps {
  success: number;
  failed: number;
  errors: ImportError[];
  onClose: () => void;
}

export default function ImportSummary({
  success,
  failed,
  errors,
  onClose,
}: ImportSummaryProps) {
  const downloadErrors = () => {
    if (!errors.length) return;

    const csv = [
      ["Row", "SKU", "Error"],
      ...errors.map((e) => [
        e.row,
        e.sku,
        e.error,
      ]),
    ];

    const content = csv
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([content], {
      type: "text/csv",
    });

    const url = window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download = "Import_Errors.csv";

    link.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">

        <h2 className="text-xl font-bold mb-6">
          Import Summary
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <div className="rounded-lg bg-green-100 p-4 text-center">

            <h3 className="text-green-700 font-semibold">
              Imported
            </h3>

            <p className="text-3xl font-bold">
              {success}
            </p>

          </div>

          <div className="rounded-lg bg-red-100 p-4 text-center">

            <h3 className="text-red-700 font-semibold">
              Failed
            </h3>

            <p className="text-3xl font-bold">
              {failed}
            </p>

          </div>

        </div>

        {errors.length > 0 && (
          <button
            onClick={downloadErrors}
            className="mt-6 w-full rounded-lg bg-red-600 text-white py-3 hover:bg-red-700"
          >
            Download Error Report
          </button>
        )}

        <button
          onClick={onClose}
          className="mt-3 w-full rounded-lg bg-gray-800 text-white py-3 hover:bg-black"
        >
          Close
        </button>

      </div>

    </div>
  );
}