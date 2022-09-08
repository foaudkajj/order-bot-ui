import { DataGrid } from "devextreme-react";
import {
  Column,
  Editing,
  Lookup,
  Popup,
  Scrolling,
  ValidationRule,
} from "devextreme-react/data-grid";
import CustomStore from "devextreme/data/custom_store";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { DxStoreOptions, Role } from "../../models";
import DxStoreService from "../../services/dx-store.service";
import GetService from "../../services/get.service";
import PermissionService from "../../services/permission.service";
import ToastService from "../../services/toast.service";

const UserStatus = [
  { id: 1, name: "Aktif" },
  { id: 0, name: "Pasif" },
];

export default function UserManagement() {
  const { t } = useTranslation();

  const [roleList, setRoles] = useState<Role[]>([]);
  const [allowAdd, setAllowAdd] = useState<boolean>(false);
  const [allowDelete, setAllowDelete] = useState<boolean>(false);
  const [allowUpdate, setAllowUpdate] = useState<boolean>(false);

  const usersGrid = useRef(null);
  const storeOption: DxStoreOptions = {
    loadUrl: "User/Get",
    insertUrl: "User/Insert",
    updateUrl: "User/Update",
    updateMethod: "POST",
    deleteUrl: "User/Delete",
    deleteMethod: "POST",
    Key: "id",
    onInserted: () => {
      usersGrid?.current?.instance?.refresh();
      ToastService.showToast("success");
    },
    onRemoved: () => {
      usersGrid?.current?.instance?.refresh();
      ToastService.showToast("success");
    },
    onUpdated: () => {
      usersGrid?.current?.instance?.refresh();
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
    GetService.getRoles().then((roles) => {
      setRoles(roles.data);
    });
    PermissionService.getPermissions().then((UIPermissions) => {
      setAllowAdd(UIPermissions.includes("ADD_USER"));
      setAllowDelete(UIPermissions.includes("DELETE_USER"));
      setAllowUpdate(UIPermissions.includes("UPDATE_USER"));
    });
  }, []);

  return (
    <React.Fragment>
      <h2 className={"content-block"}>{t("NAV.USER_MANAGEMENT")}</h2>
      <div className={"content-block"}>
        <div className={"dx-card responsive-paddings"}>
          <DataGrid
            ref={usersGrid}
            className={"dx-card wide-card"}
            dataSource={store}
            allowColumnResizing={true}
            columnAutoWidth={true}
            showBorders={true}
            onEditorPreparing={(e) => {
              if (
                e.dataField === "password" &&
                e.parentType === "dataRow" &&
                !e.row.isNewRow
              ) {
                e.editorOptions.value = "*******";
              }
            }}
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

            <Column dataField={"name"} caption={t("USER_MANAGEMENT.NAME")}>
              <ValidationRule type={"required"} />
            </Column>

            <Column
              dataField={"lastName"}
              caption={t("USER_MANAGEMENT.LASTNAME")}
            >
              <ValidationRule type={"required"} />
            </Column>

            <Column
              dataField={"cellphone"}
              caption={t("USER_MANAGEMENT.CELLPHONE")}
              dataType={"string"}
              editorOptions={{ mask: "(999)999-9999" }}
            />

            <Column
              dataField={"userName"}
              caption={t("USER_MANAGEMENT.USER_NAME")}
            >
              <ValidationRule type={"required"} />
            </Column>

            <Column
              dataField={"userStatus"}
              caption={t("USER_MANAGEMENT.USER_STATUS")}
            >
              <Lookup
                dataSource={UserStatus}
                valueExpr={"id"}
                displayExpr={"name"}
              />
              <ValidationRule type={"required"} />
            </Column>

            <Column
              dataField={"password"}
              caption={t("USER_MANAGEMENT.PASSWORD")}
              visible={false}
            >
              <ValidationRule type={"required"} />
            </Column>

            <Column dataField={"email"} caption={t("USER_MANAGEMENT.EMAIL")}>
              <ValidationRule type={"email"} />
            </Column>

            <Column dataField={"roleId"} caption={t("USER_MANAGEMENT.ROLE")}>
              <Lookup
                dataSource={roleList}
                valueExpr={"id"}
                displayExpr={"roleName"}
              />
              <ValidationRule type={"required"} />
            </Column>
          </DataGrid>
        </div>
      </div>
    </React.Fragment>
  );
}
