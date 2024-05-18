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
import { DxStoreOptions, PermissionEnum } from "../../models";
import ToastService from "../../services/toast.service";
import { turkishToLower } from "../../shared/utils";
import { useAuth } from "../../contexts/auth.context";

export default function Categories() {
  const { t } = useTranslation();
  const {
    user,
    user: { permissions },
  } = useAuth();
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
    }
  };
  const store: CustomStore = DxStoreService.getStore(storeOption);

  useEffect(() => {
    setAllowAdd(
      user.isAdmin ?? permissions.includes(PermissionEnum.ADD_CATEGORY)
    );
    setAllowDelete(
      user.isAdmin ?? permissions.includes(PermissionEnum.DELETE_CATEGORY)
    );
    setAllowUpdate(
      user.isAdmin ?? permissions.includes(PermissionEnum.UPDATE_CATEGORY)
    );
  }, [permissions]);

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

            <Column
              dataField={"name"}
              caption={t("CATEGORY.NAME")}
              editorOptions={{ maxLength: 30 }}
            >
              <ValidationRule type={"required"} />
            </Column>

            <Column
              dataField={"categoryKey"}
              caption={t("CATEGORY.CATEGORY_KEY")}
              visible={false}
              formItem={{ visible: false }}
              editorOptions={{ maxLength: 50 }}
            >
              <ValidationRule type={"required"} />
            </Column>
          </DataGrid>
        </div>
      </div>
    </React.Fragment>
  );
}
