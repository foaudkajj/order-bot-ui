import { DataGrid, DropDownButton, Form, TextArea } from "devextreme-react";
import React, { useEffect, useState } from "react";
import {
  Button,
  Column,
  Format,
  MasterDetail,
  Scrolling,
} from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";
import { Item } from "devextreme-react/form";
import { DeliveryType, OrderStatus } from "../../models";
import { useTranslation } from "react-i18next";
import ToastService from "../../services/toast.service";
import DxStoreService from "../../services/dx-store.service";
import OrderService from "../../services/order.service";
import { Popup, ToolbarItem } from "devextreme-react/popup";

export default function Orders() {
  const { t } = useTranslation();
  const [audio] = useState(new Audio(require("../../assets/new-order.mp3")));
  const [playing, setPlaying] = useState(false);

  const gridInstance = React.createRef<DataGrid>();
  const reasonTxtarea = React.createRef<TextArea>();
  const popupRef = React.createRef<Popup>();
  let orderId = 0;

  const storeOption = {
    loadUrl: "Orders/Get",
    insertUrl: "Orders/Insert",
    updateUrl: "Orders/Update",
    updateMethod: "POST",
    deleteUrl: "Orders/Delete",
    deleteMethod: "POST",
    Key: "id",
    onUpdated: (key: any, values: { orderStatus: OrderStatus }) => {
      if (values.orderStatus === OrderStatus.FutureOrder) {
        ToastService.showToast(
          "success",
          "Siparis bir saat once tekrar dusecektir."
        );
      }
    },
    errorHandler: (e) => {
      if (e) {
        e.message = t(e?.message);
      }
    },
  };
  const dataSource = new DataSource({
    store: DxStoreService.getStore(storeOption),
  });

  useEffect(() => {
    const currentInterval = setInterval(async () => {
      if (!popupRef.current.instance.option("visible")) {
        await dataSource.reload();
        if (
          gridInstance?.current?.instance
            ?.getDataSource()
            ?.items()
            ?.some((s: any) => s.orderStatus === OrderStatus.UserConfirmed)
        ) {
          setPlaying(true);
        } else {
          setPlaying(false);
        }
      }
    }, 10_000);
    return () => clearInterval(currentInterval);
  });

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing, audio]);

  const gridInitNewRow = (e: any) => {
    e.data.createDate = new Date();
  };

  const onRowPrepared = (e: any) => {
    if (e.rowType === "data") {
      if (e.data.orderChannel === "TELEGRAM") {
        e.rowElement.style.backgroundColor = "#7fc8e8";
      } else if (e.data.orderChannel === "GETIR") {
        e.rowElement.style.backgroundColor = "#a8a1d3";
      }
    }
  };

  const paymentMethodsDisplayValue = (rowData: any) => {
    let text = "";

    switch (rowData.paymentMethod) {
      case "OnDelivery":
        text = "ORDER.ON_DELIVERY";
        break;

      case "ONLINE":
        text = "ORDER.ONLINE";
        break;
    }
    return t(text);
  };

  const directToLocation = (e: any) => {
    if (e.row.data.customer.location) {
      const coordinates = JSON.parse(e.row.data.customer.location);
      window.open(
        "https://www.google.com/maps/dir/?api=1&origin_place_id=ChIJ6_MMY8K1xRQRS7WWM5yBtOo&destination=" +
          (coordinates.latitude ?? coordinates.lat) +
          "," +
          (coordinates.longitude ?? coordinates.lon) +
          "&travelmode=driving&origin=corbana",
        "_blank"
      );
    }
  };

  const getInTouchButtonVisbility = (e: any) => {
    return e.row.data?.customer.telegramUserName;
  };

  const getInTouch = (e: any) => {
    if (e.row.data?.customer.telegramUserName) {
      window.open(
        "https://telegram.me/" + e.row.data?.customer.telegramUserName,
        "_blank"
      );

      // https://api.whatsapp.com/send/?phone=00905394679794
    }
  };

  const orderStatusColumnCustomizeText = (row: any) => {
    switch (row.orderStatus) {
      case OrderStatus.UserConfirmed:
        return t("ORDER.ORDER_OPERATION_BUTTONS.CONFIRM_ORDER");

      case OrderStatus.MerchantConfirmed:
        return t("ORDER.ORDER_OPERATION_BUTTONS.READY");

      case OrderStatus.Prepared: {
        let text: string = "";
        if (row.orderChannel === "TELEGRAM") {
          text = t("ORDER.ORDER_OPERATION_BUTTONS.SENT");
        } else if (row.orderChannel === "GETIR") {
          text =
            row.getirOrder.deliveryType === DeliveryType.ByGetir
              ? t("ORDER.ORDER_OPERATION_BUTTONS.HANDED_TO_GETIR")
              : t("ORDER.ORDER_OPERATION_BUTTONS.DELIVERED");
        }
        return text;
      }

      case OrderStatus.OrderSent:
        if (row.orderChannel === "TELEGRAM") {
          return t("ORDER.ORDER_OPERATION_BUTTONS.DELIVERED");
        } else {
          return t("ORDER.ORDER_OPERATION_BUTTONS.SENT");
        }

      case OrderStatus.Delivered:
        let text: string = "";
        if (row.orderChannel === "TELEGRAM") {
          text = t("ORDER.ORDER_OPERATION_BUTTONS.DELIVERED");
        } else if (row.orderChannel === "GETIR") {
          text =
            row.getirOrder.deliveryType === DeliveryType.ByGetir
              ? t("ORDER.ORDER_OPERATION_BUTTONS.HANDED_TO_GETIR")
              : t("ORDER.ORDER_OPERATION_BUTTONS.DELIVERED");
        }
        return text;

      case OrderStatus.Canceled:
        return t("ORDER.ORDER_OPERATION_BUTTONS.CANCELED");

      case OrderStatus.FutureOrder:
        return t("ORDER.ORDER_OPERATION_BUTTONS.CONFIRM_FUTURE_ORDER");

      case OrderStatus.ConfirmedFutureOrder:
        return t("ORDER.ORDER_OPERATION_BUTTONS.FUTURE_ORDER_CONFIRMED");
    }
  };

  const onPopupHidden = (e) => {
    popupRef.current.instance.hide();
    reasonTxtarea.current.instance.option("value", "");
  };

  const showCancelPopup = (order_Id: number) => {
    orderId = order_Id;
    popupRef.current.instance.show();
  };

  return (
    <>
      <h2 className={"content-block"}>{t("NAV.ORDERS")}</h2>
      <div className={"content-block"} id={"view-content"}>
        <div className={"dx-card responsive-paddings"}>
          <DataGrid
            ref={gridInstance}
            id={"gridContainer"}
            columnAutoWidth={true}
            dataSource={dataSource}
            onInitNewRow={gridInitNewRow}
            onRowPrepared={onRowPrepared}
          >
            <MasterDetail enabled={true} component={DetailTemplate} />

            <Column
              allowSorting={false}
              dataField="id"
              caption="id"
              visible={false}
              formItem={{ visible: false }}
              dataType={"number"}
            ></Column>

            <Column
              width={"auto"}
              allowSorting={false}
              dataField="totalPrice"
              caption={t("ORDER.TOTAL_PRICE")}
              dataType={"number"}
              format={"currency"}
            >
              <Format type={"currency"} precision={2}></Format>
            </Column>

            <Column
              width={"auto"}
              calculateDisplayValue={paymentMethodsDisplayValue}
              allowSorting={false}
              caption={t("ORDER.PAYMENT_METHOD")}
              dataField={"paymentMethod"}
            ></Column>

            <Column
              width={"auto"}
              allowSorting={false}
              sortOrder={"desc"}
              caption={t("ORDER.CREATE_DATE")}
              dataField={"createDate"}
              dataType={"date"}
              format={"dd.MM.yyyy, HH:mm"}
            ></Column>

            <Column
              width={"auto"}
              allowSorting={false}
              caption={t("ORDER.CUSTOMER.FULL_NAME")}
              dataField={"customer.fullName"}
            ></Column>

            <Column
              width={"auto"}
              allowSorting={false}
              caption={t("ORDER.CUSTOMER.PHONE_NUMBER")}
              dataField={"customer.phoneNumber"}
            ></Column>

            <Column type={"buttons"}>
              <Button
                icon={"fas fa-route"}
                hint={t("ORDER.CUSTOMER.LOCATION")}
                onClick={directToLocation}
              ></Button>
              <Button
                visible={getInTouchButtonVisbility}
                icon={"fab fa-telegram"}
                hint={t("ORDER.GET_IN_TOUCH")}
                onClick={getInTouch}
              ></Button>
            </Column>

            <Column
              allowSorting={false}
              calculateDisplayValue={orderStatusColumnCustomizeText}
              cellRender={(row) => (
                <OrderStausTemplate
                  row={row}
                  dataSource={dataSource}
                  gridInstance={gridInstance}
                  showCancelPopup={showCancelPopup}
                />
              )}
            ></Column>
          </DataGrid>
        </div>
      </div>

      <Popup
        ref={popupRef}
        dragEnabled={false}
        closeOnOutsideClick={true}
        showCloseButton={true}
        showTitle={true}
        title={t("ORDER.CANCEL_REASON")}
        container=".dx-viewport"
        width={400}
        height={300}
        onHidden={onPopupHidden}
      >
        <ToolbarItem
          widget="dxButton"
          toolbar="bottom"
          location="after"
          options={{
            text: "Cancel Order",
            onClick: async () => {
              try {
                await OrderService.cancelOrder({
                  orderId: orderId,
                  cancelReason: reasonTxtarea.current.instance.option("value"),
                });
                reasonTxtarea.current.instance.option("value", "");
                popupRef.current.instance.hide();
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

const DetailTemplate = (order: any) => {
  const { t } = useTranslation();

  const orderOptionsTemplate = (e) => {
    return (
      <>
        {order?.data?.orderOptions?.map((orderOption: any) => {
          return (
            <li>
              {orderOption?.option?.name + " " + orderOption?.price + " ₺"}
            </li>
          );
        })}
      </>
    );
  };

  return (
    <>
      <Form
        showColonAfterLabel={true}
        readOnly={true}
        formData={order?.data?.data}
        labelLocation="top"
      >
        <Item dataField={"note"} label={{ text: t("ORDER.NOTE") }}></Item>
        <Item
          dataField={"orderNo"}
          label={{ text: t("ORDER.ORDER_NO") }}
        ></Item>
        <Item
          dataField={"customer.address"}
          label={{ text: t("ORDER.CUSTOMER.ADDRESS") }}
          editorType={"dxTextArea"}
        ></Item>
      </Form>

      <hr />

      {order.data.data.orderChannel === "GETIR" && (
        <Form
          showColonAfterLabel={true}
          readOnly={true}
          formData={order?.data?.data?.getirOrder}
          labelLocation="top"
          colCount={3}
        >
          <Item dataField={"id"} label={{ text: t("ORDER.ORDER_NO") }}></Item>
          <Item
            dataField={"isScheduled"}
            label={{ text: t("ORDER.IS_SCHEDULED") }}
          ></Item>
          <Item
            dataField={"courierName"}
            label={{ text: t("ORDER.COURIER_NAME") }}
          ></Item>
          <Item
            dataField={"doNotKnock"}
            label={{ text: t("ORDER.DO_NOT_KNOCK") }}
          ></Item>
          <Item
            dataField={"dropOffAtDoor"}
            label={{ text: t("ORDER.DROP_OFF_AT_DOOR") }}
          ></Item>

          <Item
            dataField={"isEcoFriendly"}
            label={{ text: t("ORDER.IS_ECO_FRIENDLY") }}
          ></Item>

          <Item
            dataField={"totalPrice"}
            label={{ text: t("ORDER.TOTAL_PRICE") }}
          ></Item>

          <Item
            dataField={"clientName"}
            label={{ text: t("ORDER.CLIENT_NAME") }}
          ></Item>

          <Item
            dataField={"clientDeliveryAddress"}
            label={{ text: t("ORDER.CLIENT_DELIVERY_ADDRESS") }}
          ></Item>

          <Item
            dataField={"clientDistrict"}
            label={{ text: t("ORDER.CLIENT_DISTRICT") }}
          ></Item>

          <Item
            dataField={"clientCity"}
            label={{ text: t("ORDER.CLIENT_CITY") }}
          ></Item>
        </Form>
      )}

      <hr />

      <DataGrid
        allowColumnReordering={true}
        columnAutoWidth={true}
        dataSource={order.data.data.orderItems}
        showBorders={true}
      >
        <Column dataField="amount" caption={t("ORDER.AMOUNT")}></Column>
        <Column
          dataField="product.title"
          caption={t("ORDER.PRODUCT_TITLE")}
        ></Column>
        <Column
          dataField="product.description"
          caption={t("ORDER.PRODUCT_DESCRIPTION")}
        ></Column>
        <Column
          dataField="product.unitPrice"
          caption={t("ORDER.UNIT_PRICE")}
          format="currency"
          dataType={"number"}
        >
          <Format type={"currency"} precision={2}></Format>
        </Column>
        <Column
          dataField="orderOptions"
          caption={t("ORDER.PRODUCT_OPTIONS")}
          cellRender={orderOptionsTemplate}
        ></Column>

        <Column dataField="itemNote" caption={t("ORDER.PRODUCT_NOTE")}></Column>
        <Scrolling columnRenderingMode={"virtual"}></Scrolling>
      </DataGrid>
    </>
  );
};

const OrderStausTemplate = (props: any) => {
  const row = props.row;
  const dataSource = props.dataSource;
  // const gridInstance = props.gridInstance;

  const { t } = useTranslation();

  const showCancelPopup = async (e) => {
    props.showCancelPopup(row.data.id);
  };

  const onOperationItemClick = async () => {
    let newOrderStatus = row.data.orderStatus;

    if (row.data.orderChannel === "TELEGRAM") {
      newOrderStatus = row.data.orderStatus + 1;
    } else if (row.data.orderChannel === "GETIR") {
      if (row.data.orderStatus === OrderStatus.Prepared) {
        newOrderStatus = OrderStatus.Delivered;
      } else if (row.data.orderStatus !== OrderStatus.FutureOrder) {
        newOrderStatus = row.data.orderStatus + 1;
      }
    }

    await dataSource
      .store()
      .update(row.data.id, { orderStatus: newOrderStatus });
    await dataSource.reload();
  };

  return (
    <>
      <DropDownButton
        disabled={
          row.data.orderStatus === 5 ||
          row.data.orderStatus === 6 ||
          row.data.orderStatus === 8
        }
        splitButton={true}
        useSelectMode={false}
        text={row.text}
        items={[{ value: 1, name: t("CANCEL"), icon: "fas fa-ban" }]}
        displayExpr={"name"}
        keyExpr={"id"}
        onButtonClick={onOperationItemClick}
        onItemClick={showCancelPopup}
      ></DropDownButton>
    </>
  );
};
