import { ProductStatus } from "./enums";
import { Order } from "./order";
import { OrderOption } from "./order-option";
import { Product } from "./product";

export class OrderItem {
  id?: number;
  amount: number;
  itemNote?: string;
  productStatus?: ProductStatus;
  productId?: number;
  product?: Product;
  orderId?: number;
  order?: Order;
  orderOptions?: OrderOption[];
}
