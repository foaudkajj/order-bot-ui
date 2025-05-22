export interface Product {
  id: number;
  type: string;
  thumbUrl: string;
  title: string;
  description: string;
  caption: string;
  productCode: string;
  unitPrice?: number;
  count?: number;
}
