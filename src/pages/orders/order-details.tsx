import { DataGrid, Form } from "devextreme-react";
import { Column, Format, Scrolling } from "devextreme-react/data-grid";
import { Item } from "devextreme-react/form";
import { useTranslation } from "react-i18next";
import { Order } from "../../models";

export default function OrderDetailsTemplate(row: { data: { data: Order } }) {
  const { t } = useTranslation();

  // const prodDescriptionCustomizeText = (e) => {
  //   return replaceLinksWithHtmlTags(e.valueText);
  // };

  // const orderOptionsTemplate = (e) => {
  //   return (
  //     <>
  //       {order?.data?.orderOptions?.map((orderOption: any) => {
  //         return (
  //           <li>
  //             {orderOption?.option?.name + " " + orderOption?.price + " ₺"}
  //           </li>
  //         );
  //       })}
  //     </>
  //   );
  // };

  return (
    <>
      <Form
        showColonAfterLabel={true}
        readOnly={true}
        formData={row?.data?.data}
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

      {row.data.data.orderChannel === "GETIR" && (
        <Form
          showColonAfterLabel={true}
          readOnly={true}
          formData={row?.data?.data?.getirOrder}
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
        dataSource={row.data.data.orderItems}
        showBorders={true}
        wordWrapEnabled={true}
      >
        <Column
          dataField="product.title"
          caption={t("ORDER.PRODUCT_TITLE")}
        ></Column>
        <Column dataField="amount" caption={t("ORDER.AMOUNT")}></Column>
        {/* <Column
            dataField="product.description"
            encodeHtml={false}
            customizeText={prodDescriptionCustomizeText}
            caption={t("ORDER.PRODUCT_DESCRIPTION")}
          ></Column> */}
        <Column
          dataField="product.unitPrice"
          caption={t("ORDER.UNIT_PRICE")}
          format="currency"
          dataType={"number"}
        >
          <Format type={"currency"} precision={2}></Format>
        </Column>
        {/* <Column
            dataField="orderOptions"
            caption={t("ORDER.PRODUCT_OPTIONS")}
            cellRender={orderOptionsTemplate}
          ></Column> */}
        {/* <Column dataField="itemNote" caption={t("ORDER.PRODUCT_NOTE")}></Column> */}

        <Scrolling columnRenderingMode={"virtual"}></Scrolling>
      </DataGrid>
    </>
  );
}
