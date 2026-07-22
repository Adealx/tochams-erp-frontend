export interface Category {
  id: number;
  name: string;
}

export interface Brand {
  id: number;
  name: string;
}

export interface Unit {
  id: number;
  name: string;
}

export interface Product {

  id: number;

  sku: string;

  name: string;

  category: number;

  brand: number;

  unit: number;

  category_name: string;

  brand_name: string;

  unit_name: string;

  supplier: string;

  barcode: string;

  description: string;

  cost_price: string;

  wholesale_price: string;

  retail_price: string;

  stock_quantity: number;

  reorder_level: number;

  status: string;

  stock_value: number;

  potential_sales_value: number;

  potential_profit: number;
}