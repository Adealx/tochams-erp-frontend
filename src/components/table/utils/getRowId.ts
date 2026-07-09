export function getRowId<
  T extends Record<string, any>
>(
  row: T,
  index: number,
  rowKey?:
    | keyof T
    | ((row: T) => string | number)
): string | number {
  if (typeof rowKey === "function") {
    return rowKey(row);
  }

  if (rowKey) {
    return row[rowKey] as string | number;
  }

  return index;
}