import AxiosService from "./axios.service";

const cancelOrder = async (orderId: string) => {
  return AxiosService.get<void>(`Orders/Cancel/${orderId}`);
};

const OrderService = {
  cancelOrder,
};

export default OrderService;
