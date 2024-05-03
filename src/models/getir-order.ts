import { Order } from "./order";

export class GetirOrder {
  id?: string;

  status: number;

  isScheduled: boolean;

  confirmationId: string;

  clientId: string;

  clientName: string;

  clientContactPhoneNumber: string;

  clientPhoneNumber: string;

  clientDeliveryAddressId: string;

  clientDeliveryAddress: string;

  clientCity: string;

  clientDistrict: string;

  clientLocation: string;

  courierId: string;

  courierStatus: number;

  courierName: string;

  courierLocation: string;

  clientNote: string;

  doNotKnock: boolean;

  dropOffAtDoor: boolean;

  totalPrice: number;

  checkoutDate: string;

  deliveryType: number;

  isEcoFriendly: boolean;

  paymentMethodId: number;

  paymentMethodText: string;

  restaurantId: string;
  OrderId?: number;

  Order?: Order;
}
