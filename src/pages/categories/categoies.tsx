import { DataGrid } from "devextreme-react";
import {
  Column,
  Editing,
  Popup,
  Scrolling,
  ValidationRule,
} from "devextreme-react/data-grid";
import CustomStore from "devextreme/data/custom_store";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import DxStoreService from "../../services/dx-store.service";
import PermissionService from "../../services/permission.service";
import { DxStoreOptions } from "../models";

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
    onInserted: () => categoriesGrid?.current?.instance?.refresh(),
    onRemoved: () => categoriesGrid?.current?.instance?.refresh(),
    onUpdated: () => categoriesGrid?.current?.instance?.refresh(),
  };
  const store: CustomStore = DxStoreService.getStore(storeOption);

  useEffect(() => {
    PermissionService.getPermissions().then((UIPermissions) => {
      setAllowAdd(UIPermissions.includes("ADD_CATEGORY"));
      setAllowDelete(UIPermissions.includes("DELETE_CATEGORY"));
      setAllowUpdate(UIPermissions.includes("UPDATE_CATEGORY"));
    });
  }, []);

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
            remoteOperations={true}
            showBorders={true}
          >
            <Editing
              mode={"popup"}
              allowAdding={allowAdd}
              allowDeleting={allowDelete}
              allowUpdating={allowUpdate}
            >
              <Popup width={"auto"} height={"auto"} />
            </Editing>
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
            >
              <ValidationRule type={"required"} />
            </Column>
          </DataGrid>
        </div>
      </div>
    </React.Fragment>
  );
}
