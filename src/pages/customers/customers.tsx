import { DataGrid } from "devextreme-react";
import {
  Column,
  Editing,
  Scrolling,
  ValidationRule,
} from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import CustomStore from "devextreme/data/custom_store";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import DxStoreService from "../../services/dx-store.service";
import { DxStoreOptions, PermissionEnum } from "../../models";
import ToastService from "../../services/toast.service";
import { useAuth } from "../../contexts/auth.context";

export default function Customers() {
  const { t } = useTranslation();
  const {
    user,
    user: { permissions },
  } = useAuth();
  const [allowAdd, setAllowAdd] = useState<boolean>(false);
  const [allowDelete, setAllowDelete] = useState<boolean>(false);
  const [allowUpdate, setAllowUpdate] = useState<boolean>(false);
  // const [customerChannels] = useState(
  //   Object.values(OrderChannel).map((v) => {
  //     return {
  //       id: v,
  //       text: t(`CUSTOMER.${v.toUpperCase()}`),
  //     };
  //   })
  // );

  const gridRef = useRef(null);
  const storeOption: DxStoreOptions = {
    loadUrl: "customer/get",
    insertUrl: "customer/insert",
    updateUrl: "customer/update",
    updateMethod: "POST",
    deleteUrl: "customer/delete",
    deleteMethod: "POST",
    Key: "id",
    onInserted: () => {
      gridRef?.current?.instance?.refresh();
      ToastService.showToast("success");
    },
    onRemoved: () => {
      gridRef?.current?.instance?.refresh();
      ToastService.showToast("success");
    },
    onUpdated: () => {
      gridRef?.current?.instance?.refresh();
      ToastService.showToast("success");
    },
    errorHandler: (e) => {
      console.log(e);
      if (e) {
        e.message = t(e?.message);
      }
    },
  };
  const store: CustomStore = DxStoreService.getStore(storeOption);

  useEffect(() => {
    setAllowAdd(
      user.isAdmin ?? permissions.includes(PermissionEnum.ADD_CUSTOMER)
    );
    setAllowDelete(
      false //user.isAdmin ?? permissions.includes(PermissionEnum.DELETE_CUSTOMER)
    );
    setAllowUpdate(
      user.isAdmin ?? permissions.includes(PermissionEnum.UPDATE_CUSTOMER)
    );
  }, [permissions]);

  const directToLocation = (e: any) => {
    const location = e.row?.data?.location;
    if (location) {
      const coordinates = JSON.parse(location);
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

  const getInTouch = (e: any, app: "WHATSAPP" | "TELEGRAM") => {
    const phoneNumber = e.row.data?.phoneNumber;
    const telegramUserName = e.row.data?.telegramUserName;
    if (app === "TELEGRAM" && (telegramUserName || phoneNumber)) {
      window.open(
        "https://telegram.me/" + (phoneNumber ?? telegramUserName),
        "_blank"
      );
    } else if (app === "WHATSAPP" && phoneNumber) {
      window.open("https://wa.me/" + phoneNumber, "_blank");
    }
  };

  const userContactBtns = (e) => (
    <>
      <Button
        icon={"fas fa-route"}
        hint={t("CUSTOMER.LOCATION")}
        onClick={(_) => directToLocation(e)}
        disabled={!e.row?.data?.location}
      ></Button>

      <Button
        icon={"fab fa-telegram"}
        hint={t("CUSTOMER.GET_IN_TOUCH")}
        onClick={(_) => getInTouch(e, "TELEGRAM")}
        disabled={!e.row?.data?.phoneNumber && !e.row?.data?.telegramUserName}
      ></Button>

      <Button
        icon={"fab fa-whatsapp"}
        hint={t("CUSTOMER.GET_IN_TOUCH")}
        onClick={(_) => getInTouch(e, "WHATSAPP")}
        disabled={!e.row?.data?.phoneNumber}
      ></Button>
    </>
  );

  return (
    <React.Fragment>
      <h2 className={"content-block"}>{t("CUSTOMER.TITLE")}</h2>
      <div className={"content-block"}>
        <div className={"dx-card responsive-paddings"}>
          <DataGrid
            ref={gridRef}
            className={"dx-card wide-card"}
            dataSource={store}
            allowColumnResizing={true}
            columnAutoWidth={true}
            showBorders={true}
          >
            <Editing
              mode={"popup"}
              allowAdding={allowAdd}
              allowDeleting={allowDelete}
              allowUpdating={allowUpdate}
            ></Editing>
            <Scrolling columnRenderingMode={"virtual"} />

            <Column
              dataField={"id"}
              caption={"id"}
              dataType={"number"}
              visible={false}
              formItem={{ visible: false }}
              editorOptions={{ maxLength: 30 }}
            />

            <Column
              dataField={"fullName"}
              caption={t("CUSTOMER.FULL_NAME")}
              editorOptions={{ maxLength: 30 }}
            >
              <ValidationRule type={"required"} />
            </Column>

            <Column
              dataField={"telegramUserName"}
              caption={t("CUSTOMER.TELEGRAM_USER_NAME")}
              editorOptions={{ maxLength: 30 }}
            />

            <Column
              dataField={"phoneNumber"}
              caption={t("CUSTOMER.PHONE_NUMBER")}
              editorOptions={{ maxLength: 30, mask: "(599)999-9999" }}
            />

            <Column
              dataField={"address"}
              caption={t("CUSTOMER.ADDRESS")}
              editorOptions={{ maxLength: 1000 }}
            />

            <Column
              dataField={"location"}
              caption={t("CUSTOMER.LOCATION")}
              allowSorting={false}
              cellRender={userContactBtns}
              width={150}
              formItem={{ visible: false }}
            />

            {/* <Column
              dataField={"customerChannel"}
              caption={t("CUSTOMER.CUSTOMER_CHANNEL")}
            >
              <Lookup
                dataSource={customerChannels}
                displayExpr={"text"}
                valueExpr={"id"}
              />
            </Column> */}

            <Column
              dataField={"createDate"}
              caption={t("CUSTOMER.CREATE_DATE")}
              dataType={"date"}
              format={"dd.MM.yyyy, HH:mm"}
              formItem={{ visible: false }}
            />
          </DataGrid>
        </div>
      </div>
    </React.Fragment>
  );
}
