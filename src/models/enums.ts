export enum UserStatus {
  Passive,
  Active,
}

export enum OrderStatus {
  New = 'NEW',
  UserConfirmed = 'USER_CONFIRMED',
  MerchantConfirmed = 'MERCHANT_CONFIRMED',
  Prepared = 'PREPARED',
  OrderSent = 'ORDER_SENT',
  Delivered = 'DELIVERED',
  Canceled = 'CANCELLED',
  FutureOrder = 'FUTURE_ORDER',
  ConfirmedFutureOrder = 'CONFIRMED_FUTURE_ORDER',
}

export enum DeliveryType {
  ByGetir = 1,
  ByRestaurant = 2,
}

export enum OrderChannel {
  Telegram = 'TELEGRAM',
  YemekSepetei = 'YEMEKSEPETI',
  Getir = 'GETIR',
  Panel = 'PANEL',
}

export enum PaymentMethod {
  OnDelivery = 'OnDelivery',
  Online = 'Online',
}

export enum ProductStatus {
  // means that the user added the product to the basket by clicking on the related button.
  InBasket = 'INBASKET',
}

export enum PermissionEnum {
  SHOW_ROLE = 'SHOW_ROLE',
  SHOW_USER = 'SHOW_USER',
  ADD_USER = 'ADD_USER',
  DELETE_USER = 'DELETE_USER',
  UPDATE_USER = 'UPDATE_USER',
  ADD_ROLE = 'ADD_ROLE',
  DELETE_ROLE = 'DELETE_ROLE',
  UPDATE_ROLE = 'UPDATE_ROLE',
  UPATE_PERMISSIONS = 'UPATE_PERMISSIONS',
  SHOW_CATEGORY = 'SHOW_CATEGORY',
  ADD_CATEGORY = 'ADD_CATEGORY',
  UPDATE_CATEGORY = 'UPDATE_CATEGORY',
  DELETE_CATEGORY = 'DELETE_CATEGORY',
  SHOW_CUSTOMER = 'SHOW_CUSTOMER',
  ADD_CUSTOMER = 'ADD_CUSTOMER',
  UPDATE_CUSTOMER = 'UPDATE_CUSTOMER',
  DELETE_CUSTOMER = 'DELETE_CUSTOMER',
  SHOW_PRODUCT = 'SHOW_PRODUCT',
  ADD_PRODUCT = 'ADD_PRODUCT',
  UPDATE_PRODUCT = 'UPDATE_PRODUCT',
  DELETE_PRODUCT = 'DELETE_PRODUCT',
  SHOW_ORDER = 'SHOW_ORDER',
  ADD_ORDER = 'ADD_ORDER',
  UPDATE_ORDER = 'UPDATE_ORDER',
  DELETE_ORDER = 'DELETE_ORDER',
}
