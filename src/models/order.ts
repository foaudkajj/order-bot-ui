import { Customer } from "./customer";
import { OrderChannel, OrderStatus, PaymentMethod } from "./enums";
import { GetirOrder } from "./getir-order";
import { Merchant } from "./merchant";
import { OrderItem } from "./order-item";

export class Order {
  id: number;
  orderNo: string;
  orderChannel: OrderChannel;
  paymentMethod: PaymentMethod;
  totalPrice: number;
  orderStatus?: OrderStatus;
  createDate: Date;
  note?: string;
  cancelReason?: string;
  orderItems?: OrderItem[];
  customerId?: number;
  customer?: Customer;
  getirOrderId?: string;
  getirOrder?: GetirOrder;
  merchantId: number;
  merchant?: Merchant;
}
