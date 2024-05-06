import { DataGrid } from "devextreme-react";
import React, { useEffect, useState } from "react";
import {
  Button,
  Column,
  FilterRow,
  Format,
  Lookup,
  MasterDetail,
  Summary,
  TotalItem,
} from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";
import { DeliveryType, OrderStatus, PaymentMethod } from "../../models";
import { useTranslation } from "react-i18next";
import ToastService from "../../services/toast.service";
import DxStoreService from "../../services/dx-store.service";
import { Order } from "../../models/order";
import OrderStausBtn from "./order-status-btn";
import OrderDetailsTemplate from "./order-details";

export default function Orders() {
  const { t } = useTranslation();
  const [audio] = useState(new Audio(require("../../assets/new-order.mp3")));
  const [playing, setPlaying] = useState(false);
  const [cancelPopupVisibility, setCancelPopupVisibility] = useState(false);
  const [paymentMethods] = useState(
    Object.values(PaymentMethod).map((v) => {
      return {
        id: v,
        text: t(`ORDER.${v.toUpperCase()}`),
      };
    })
  );

  const gridInstance = React.createRef<DataGrid>();

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
      if (!cancelPopupVisibility) {
        await gridInstance.current.instance.refresh(true);
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
    }, 60_000);
    return () => clearInterval(currentInterval);
  });

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing, audio]);

  const gridInitNewRow = (e: any) => {
    e.data.createDate = new Date();
  };

  const onCancelPopupVisibilityChange = (visible: boolean) => {
    setCancelPopupVisibility(visible);
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

  // const paymentMethodsDisplayValue = (rowData: any) => {
  //   let text = "";

  //   switch (rowData.paymentMethod) {
  //     case "OnDelivery":
  //       text = "ORDER.ON_DELIVERY";
  //       break;

  //     case "ONLINE":
  //       text = "ORDER.ONLINE";
  //       break;
  //   }
  //   return t(text);
  // };

  const directToLocation = (e: any) => {
    if (e.row.data.customer.location) {
      const coordinates = JSON.parse(e.row.data.customer.location);
      window.open(
        "https://www.google.com/maps/dir/?api=1&destination=" +
          (coordinates.latitude ?? coordinates.lat) +
          "," +
          (coordinates.longitude ?? coordinates.lon) +
          "&travelmode=driving",
        "_blank"
      );
    } else {
    }
  };

  const directBtnDisabled = (e) => {
    return !e.row?.data?.customer?.location;
  };

  const getInTouchBtnDisabled = (e) => {
    return !e.row?.data?.customer?.telegramUserName;
  };

  const getInTouchButtonVisbility = (e: { row: { data: Order } }) => {
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
            <FilterRow visible={true} />
            <MasterDetail enabled={true} component={OrderDetailsTemplate} />

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
              allowSorting={false}
              caption={t("ORDER.PAYMENT_METHOD")}
              dataField={"paymentMethod"}
            >
              <Lookup
                dataSource={paymentMethods}
                displayExpr={"text"}
                valueExpr={"id"}
              />
            </Column>

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
                disabled={directBtnDisabled}
              ></Button>
              <Button
                visible={getInTouchButtonVisbility}
                icon={"fab fa-telegram"}
                hint={t("ORDER.GET_IN_TOUCH")}
                onClick={getInTouch}
                disabled={getInTouchBtnDisabled}
              ></Button>
            </Column>

            <Column
              allowSorting={false}
              calculateDisplayValue={orderStatusColumnCustomizeText}
              cellRender={(row) => (
                <OrderStausBtn
                  gridRow={row}
                  dataSource={dataSource}
                  onCancelPopupVisibilityChange={onCancelPopupVisibilityChange}
                />
              )}
            ></Column>

            <Summary>
              <TotalItem
                column="totalPrice"
                summaryType="sum"
                valueFormat="currency"
              />
            </Summary>
          </DataGrid>
        </div>
      </div>
    </>
  );
}
