import { CancelOrderRequest } from "../models";
import AxiosService from "./axios.service";

const cancelOrder = async (cancelOrder: CancelOrderRequest) => {
  return AxiosService.post<void>(`Orders/Cancel`, cancelOrder);
};

const OrderService = {
  cancelOrder,
};

export default OrderService;
