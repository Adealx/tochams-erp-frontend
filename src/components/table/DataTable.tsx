"use client";

import { ReactNode, useMemo, useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  Search,
} from "lucide-react";

export interface Column<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");

  const [sortKey, setSortKey] =
    useState<keyof T | null>(null);

  const [ascending, setAscending] =
    useState(true);

  const [selectedRows, setSelectedRows] =
    useState<number[]>([]);

  const filteredData = useMemo(() => {
    let rows = [...data];

    if (search.trim()) {
      rows = rows.filter((row) =>
        Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (sortKey) {
      rows.sort((a, b) => {
        const first = String(a[sortKey] ?? "");
        const second = String(b[sortKey] ?? "");

        return ascending
          ? first.localeCompare(second)
          : second.localeCompare(first);
      });
    }

    return rows;
  }, [data, search, sortKey, ascending]);

  const toggleAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map((_, i) => i));
    }
  };

  const toggleRow = (index: number) => {
    setSelectedRows((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Toolbar */}

      <div className="flex flex-col gap-4 border-b p-5 md:flex-row md:items-center md:justify-between">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-3 text-slate-400"
          />

          <input
            placeholder="Search records..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              w-full
              md:w-80
              rounded-xl
              border
              border-slate-300
              py-2.5
              pl-10
              pr-4
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

        </div>

        <div className="text-sm text-slate-500">

          {filteredData.length} Records

        </div>

      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="w-14 px-4">

                <input
                  type="checkbox"
                  checked={
                    filteredData.length > 0 &&
                    selectedRows.length ===
                      filteredData.length
                  }
                  onChange={toggleAll}
                />

              </th>

              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  onClick={() => {
                    if (!column.sortable) return;

                    if (sortKey === column.key) {
                      setAscending(!ascending);
                    } else {
                      setSortKey(column.key);
                      setAscending(true);
                    }
                  }}
                  className={`
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-semibold
                    text-slate-700
                    ${
                      column.sortable
                        ? "cursor-pointer select-none"
                        : ""
                    }
                  `}
                >
                  <div className="flex items-center gap-2">

                    {column.title}

                    {column.sortable &&
                      sortKey === column.key &&
                      (ascending ? (
                        <ArrowUp size={15} />
                      ) : (
                        <ArrowDown size={15} />
                      ))}

                  </div>
                </th>
              ))}

            </tr>

          </thead>

          <tbody>

            {filteredData.length === 0 ? (

              <tr>

                <td
                  colSpan={
                    columns.length + 1
                  }
                  className="py-20 text-center text-slate-500"
                >

                  No records found.

                </td>

              </tr>

            ) : (

              filteredData.map((row, index) => (

                <tr
                  key={index}
                  className={`
                    border-t
                    transition
                    hover:bg-blue-50
                    ${
                      index % 2 === 0
                        ? "bg-white"
                        : "bg-slate-50"
                    }
                  `}
                >

                  <td className="px-4">

                    <input
                      type="checkbox"
                      checked={selectedRows.includes(
                        index
                      )}
                      onChange={() =>
                        toggleRow(index)
                      }
                    />

                  </td>

                  {columns.map((column) => (

                    <td
                      key={String(column.key)}
                      className="px-6 py-4"
                    >

                      {column.render
                        ? column.render(row)
                        : String(
                            row[column.key] ?? ""
                          )}

                    </td>

                  ))}

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}