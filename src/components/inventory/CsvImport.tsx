"use client";

import { useState } from "react";

import {
  importProducts,
} from "@/services/productService";

import ProgressBar from "./ProgressBar";
import ImportSummary, {
  ImportError,
} from "./ImportSummary";

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CsvImport({
  onClose,
  onSuccess,
}: Props) {

  const [file, setFile] =
    useState<File | null>(null);

  const [progress, setProgress] =
    useState(0);

  const [uploading, setUploading] =
    useState(false);

  const [summary, setSummary] =
    useState<{
      success: number;
      failed: number;
      errors: ImportError[];
    } | null>(null);

  const handleUpload = async () => {

    if (!file) return;

    setUploading(true);

    try {

      const result =
        await importProducts(
          file,
          setProgress
        );

      setSummary(result);

      onSuccess?.();

    } catch (error) {

      alert(
        "Import failed."
      );

    } finally {

      setUploading(false);

    }
  };

  if (summary) {

    return (
      <ImportSummary
        success={summary.success}
        failed={summary.failed}
        errors={summary.errors}
        onClose={() => {

          setSummary(null);

          onClose();

        }}
      />
    );

  }

  return (

    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">

        <h2 className="text-xl font-bold mb-6">
          Upload Product CSV
        </h2>

        <input
          type="file"
          accept=".csv"
          onChange={(e) =>
            setFile(
              e.target.files?.[0] || null
            )
          }
        />

        {file && (

          <p className="mt-4 text-sm">

            Selected:

            <strong>
              {" "}
              {file.name}
            </strong>

          </p>

        )}

        {uploading && (

          <div className="mt-6">

            <ProgressBar
              progress={progress}
            />

          </div>

        )}

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
          >
            Upload
          </button>

        </div>

      </div>

    </div>

  );

}