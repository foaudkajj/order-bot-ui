import { DataGrid } from "devextreme-react";
import {
  Column,
  Editing,
  Scrolling,
  ValidationRule,
} from "devextreme-react/data-grid";
import CustomStore from "devextreme/data/custom_store";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import DxStoreService from "../../services/dx-store.service";
import PermissionService from "../../services/permission.service";
import { DxStoreOptions } from "../../models";
import ToastService from "../../services/toast.service";
import { turkishToLower } from "../../shared/utils";

export default function Categories() {
  const { t } = useTranslation();

  const [allowAdd, setAllowAdd] = useState<boolean>(false);
  const [allowDelete, setAllowDelete] = useState<boolean>(false);
  const [allowUpdate, setAllowUpdate] = useState<boolean>(false);

  const categoriesGrid = useRef(null);
  const storeOption: DxStoreOptions = {
    loadUrl: "Category/Get",
    insertUrl: "Category/Insert",
    updateUrl: "Category/Update",
    updateMethod: "POST",
    deleteUrl: "Category/Delete",
    deleteMethod: "POST",
    Key: "id",
    onInserted: () => {
      categoriesGrid?.current?.instance?.refresh();
      ToastService.showToast("success");
    },
    onRemoved: () => {
      categoriesGrid?.current?.instance?.refresh();
      ToastService.showToast("success");
    },
    onUpdated: () => {
      categoriesGrid?.current?.instance?.refresh();
      ToastService.showToast("success");
    },
    errorHandler: (e) => {
      if (e) {
        e.message = t(e?.message);
      }
    },
  };
  const store: CustomStore = DxStoreService.getStore(storeOption);

  useEffect(() => {
    PermissionService.getPermissions().then((UIPermissions) => {
      setAllowAdd(UIPermissions.includes("ADD_CATEGORY"));
      setAllowDelete(UIPermissions.includes("DELETE_CATEGORY"));
      setAllowUpdate(UIPermissions.includes("UPDATE_CATEGORY"));
    });
  }, []);

  const onRowInserting = (e) => {
    e.data.categoryKey = turkishToLower(e.data.name)
      .trim()
      .replace(new RegExp(" ", "g"), "_");
  };

  const onRowUpdating = (e) => {
    e.newData.categoryKey = turkishToLower(e.newData.name)
      .trim()
      .replace(new RegExp(" ", "g"), "_");
  };

  return (
    <React.Fragment>
      <h2 className={"content-block"}>{t("CATEGORY.TITLE")}</h2>
      <div className={"content-block"}>
        <div className={"dx-card responsive-paddings"}>
          <DataGrid
            ref={categoriesGrid}
            className={"dx-card wide-card"}
            dataSource={store}
            allowColumnResizing={true}
            columnAutoWidth={true}
            showBorders={true}
            onRowInserting={onRowInserting}
            onRowUpdating={onRowUpdating}
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
            />

            <Column dataField={"name"} caption={t("CATEGORY.NAME")}>
              <ValidationRule type={"required"} />
            </Column>

            <Column
              dataField={"categoryKey"}
              caption={t("CATEGORY.CATEGORY_KEY")}
              visible={false}
              formItem={{ visible: false }}
            >
              <ValidationRule type={"required"} />
            </Column>
          </DataGrid>
        </div>
      </div>
    </React.Fragment>
  );
}
