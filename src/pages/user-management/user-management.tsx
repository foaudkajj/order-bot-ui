import { DataGrid } from "devextreme-react";
import {
  Column,
  Editing,
  Lookup,
  PatternRule,
  Popup,
  RequiredRule,
  Scrolling,
  ValidationRule,
} from "devextreme-react/data-grid";
import CustomStore from "devextreme/data/custom_store";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { DxStoreOptions, PermissionEnum, Role } from "../../models";
import DxStoreService from "../../services/dx-store.service";
import GetService from "../../services/get.service";
import ToastService from "../../services/toast.service";
import { useAuth } from "../../contexts/auth.context";

const UserStatus = [
  { id: 1, name: "Aktif" },
  { id: 0, name: "Pasif" },
];

export default function UserManagement() {
  const { t } = useTranslation();
  const {
    user,
    user: { permissions },
  } = useAuth();
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
  };
  const store: CustomStore = DxStoreService.getStore(storeOption);

  useEffect(() => {
    GetService.getRoles().then((roles) => {
      setRoles(roles.data);
    });

    setAllowAdd(user.isAdmin ?? permissions.includes(PermissionEnum.ADD_USER));
    setAllowDelete(
      user.isAdmin ?? permissions.includes(PermissionEnum.DELETE_USER)
    );
    setAllowUpdate(
      user.isAdmin ?? permissions.includes(PermissionEnum.UPDATE_USER)
    );
  }, [permissions, user]);

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

            <Column
              dataField={"name"}
              caption={t("USER_MANAGEMENT.NAME")}
              editorOptions={{ maxLength: 50 }}
            >
              <RequiredRule />
            </Column>

            <Column
              dataField={"lastName"}
              caption={t("USER_MANAGEMENT.LASTNAME")}
              editorOptions={{ maxLength: 50 }}
            >
              <RequiredRule />
            </Column>

            <Column
              dataField={"cellphone"}
              caption={t("USER_MANAGEMENT.CELLPHONE")}
              dataType={"string"}
              editorOptions={{ mask: "(999)999-9999", maxLength: 50 }}
            />

            <Column
              dataField={"userName"}
              caption={t("USER_MANAGEMENT.USER_NAME")}
              editorOptions={{ maxLength: 30 }}
            >
              <RequiredRule />
              <PatternRule
                message={t("USER_MANAGEMENT.USER_NAME_VALIDATION")}
                pattern="^[a-z0-9_.]+$"
              />
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
              <RequiredRule />
            </Column>

            <Column
              dataField={"password"}
              caption={t("USER_MANAGEMENT.PASSWORD")}
              visible={false}
            >
              <RequiredRule />
            </Column>

            <Column
              dataField={"email"}
              caption={t("USER_MANAGEMENT.EMAIL")}
              editorOptions={{ maxLength: 50 }}
            >
              <ValidationRule type={"email"} />
            </Column>

            <Column dataField={"roleId"} caption={t("USER_MANAGEMENT.ROLE")}>
              <Lookup
                dataSource={roleList}
                valueExpr={"id"}
                displayExpr={"roleName"}
              />
              <RequiredRule />
            </Column>
          </DataGrid>
        </div>
      </div>
    </React.Fragment>
  );
}
