"use client";

interface LoadingRowsProps {
  columns: number;

  rows?: number;
}

export default function LoadingRows({
  columns,
  rows = 8,
}: LoadingRowsProps) {
  return (
    <>
      {Array.from({
        length: rows,
      }).map((_, row) => (

        <tr
          key={row}
          className="border-t border-slate-100"
        >

          <td className="px-4 py-5">

            <div
              className="
                h-4
                w-4
                animate-pulse
                rounded
                bg-slate-200
              "
            />

          </td>

          {Array.from({
            length: columns,
          }).map((_, col) => (

            <td
              key={col}
              className="px-6 py-5"
            >

              <div
                className="
                  h-4
                  w-full
                  animate-pulse
                  rounded
                  bg-slate-200
                "
              />

            </td>

          ))}

        </tr>

      ))}
    </>
  );
}