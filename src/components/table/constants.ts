export const columnSizes = {
  xs: "90px",
  sm: "130px",
  md: "180px",
  lg: "240px",
  xl: "320px",
} as const;

export type ColumnSize =
  keyof typeof columnSizes;