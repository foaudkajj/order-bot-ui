import { useTranslation } from "react-i18next";
import { OrderStatus } from "../../models";
import { DropDownButton, Popup, TextArea } from "devextreme-react";
import React from "react";
import { ToolbarItem } from "devextreme-react/popup";
import OrderService from "../../services/order.service";
import DataSource from "devextreme/data/data_source";
import { Order } from "../../models/order";

interface OrderStausBtnProps {
  gridRow: { data: Order; text: string };
  dataSource: DataSource<any, any>;
  onCancelPopupVisibilityChange: (visible: boolean) => void;
}

export default function OrderStausBtn({
  gridRow,
  dataSource,
  onCancelPopupVisibilityChange,
}: OrderStausBtnProps) {
  const orderCancelPopupRef = React.createRef<Popup>();
  const reasonTxtarea = React.createRef<TextArea>();

  const { t } = useTranslation();

  let orderId = 0;
  const showCancelPopup = async (row) => {
    orderId = gridRow.data.id;
    await orderCancelPopupRef.current.instance.show();
  };

  const onOperationItemClick = async () => {
    let newOrderStatus = gridRow.data.orderStatus;

    if (gridRow.data.orderChannel === "TELEGRAM") {
      newOrderStatus = getNextStatus(gridRow.data.orderStatus);
    }
    await dataSource
      .store()
      .update(gridRow.data.id, { orderStatus: newOrderStatus });
    await dataSource.reload();
  };

  const getNextStatus = (current: OrderStatus): OrderStatus => {
    switch (current) {
      case OrderStatus.New:
        return OrderStatus.UserConfirmed;
      case OrderStatus.UserConfirmed:
        return OrderStatus.MerchantConfirmed;
      case OrderStatus.MerchantConfirmed:
        return OrderStatus.Prepared;
      case OrderStatus.Prepared:
        return OrderStatus.OrderSent;
      case OrderStatus.OrderSent:
        return OrderStatus.Delivered;
      case OrderStatus.Delivered:
    }
  };

  const onPopupHidden = (e) => {
    orderCancelPopupRef.current.instance.hide();
    reasonTxtarea.current.instance.option("value", "");
    onCancelPopupVisibilityChange(false);
  };

  const onPopupShown = (e) => {
    onCancelPopupVisibilityChange(true);
  };

  return (
    <>
      <DropDownButton
        disabled={
          gridRow.data.orderStatus === OrderStatus.Delivered ||
          gridRow.data.orderStatus === OrderStatus.Canceled ||
          gridRow.data.orderStatus === OrderStatus.ConfirmedFutureOrder
        }
        splitButton={true}
        useSelectMode={false}
        text={gridRow.text}
        items={[{ value: 1, name: t("ORDER.CANCEL"), icon: "fas fa-ban" }]}
        displayExpr={"name"}
        keyExpr={"id"}
        onButtonClick={onOperationItemClick}
        onItemClick={showCancelPopup}
      ></DropDownButton>

      <Popup
        ref={orderCancelPopupRef}
        dragEnabled={false}
        closeOnOutsideClick={true}
        showCloseButton={true}
        showTitle={true}
        title={t("ORDER.CANCEL_REASON")}
        container=".dx-viewport"
        width={400}
        height={300}
        onHidden={onPopupHidden}
        onShown={onPopupShown}
      >
        <ToolbarItem
          widget="dxButton"
          toolbar="bottom"
          location="after"
          options={{
            text: t("ORDER.CANCEL"),
            onClick: async () => {
              try {
                await OrderService.cancelOrder({
                  orderId: orderId,
                  cancelReason: reasonTxtarea.current.instance.option("value"),
                });
                reasonTxtarea.current.instance.option("value", "");
                orderCancelPopupRef.current.instance.hide();
                await dataSource.reload();
              } catch (e) {
                console.log(e);
              }
            },
          }}
        />

        <div className="dx-field">
          <TextArea
            ref={reasonTxtarea}
            autoResizeEnabled={true}
            width={"100%"}
            placeholder={t("ORDER.ENTER_REASON")}
            showClearButton={true}
          />
        </div>
      </Popup>
    </>
  );
}
