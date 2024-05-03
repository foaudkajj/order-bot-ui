import { Merchant } from "./merchant";
import { Order } from "./order";

export class Customer {
  id?: number;
  fullName?: string;
  telegramUserName?: string;
  telegramId?: number;
  phoneNumber?: string;
  location?: string;
  address?: string;
  customerChannel?: string;
  orders?: Order[];
  merchantId: number;
  merchant?: Merchant;
}
