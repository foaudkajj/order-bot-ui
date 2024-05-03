import { Category } from "./category";
import { Customer } from "./customer";
import { Order } from "./order";
import { Product } from "./product";

export class Merchant {
  id: number;
  botUserName: string;
  botToken: string;
  isActive: boolean;
  getirAppSecretKey: string;
  getirRestaurantSecretKey: string;
  getirAccessToken: string;
  getirTokenLastCreated: Date;
  getirRestaurantId: string;
  ysAppSecretKey: string;
  ysRestaurantSecretKey: string;
  products: Product[];
  customers: Customer[];
  orders: Order[];
  categories: Category[];
}
