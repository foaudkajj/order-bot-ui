import { Option } from "./option";
import { OrderItem } from "./order-item";

export class OrderOption {
  id?: number;
  price: number;
  optionId: number;
  option?: Option;
  orderItemId?: number;
  orderItem?: OrderItem;
}
