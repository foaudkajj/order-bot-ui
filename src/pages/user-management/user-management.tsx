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
import DxStoreService from "../../services/dx-store.service";
import GetService from "../../services/get.service";
import PermissionService from "../../services/permession.service";
import { DxStoreOptions, Role } from "../models";

const UserStatus = [
  { Id: 1, Name: "Aktif" },
  { Id: 0, Name: "Pasif" },
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
    Key: "Id",
    onInserted: () => usersGrid?.current?.instance?.refresh(),
    onRemoved: () => usersGrid?.current?.instance?.refresh(),
    onUpdated: () => usersGrid?.current?.instance?.refresh(),
  };
  const store: CustomStore = DxStoreService.getStore(storeOption);

  useEffect(() => {
    GetService.getRoles().then((roles) => setRoles(roles.Result));
    PermissionService.getPermissions().then((UIPermessions) => {
      setAllowAdd(UIPermessions.includes("ADD_USER"));
      setAllowDelete(UIPermessions.includes("DELETE_USER"));
      setAllowUpdate(UIPermessions.includes("UPDATE_USER"));
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
              dataField={"Id"}
              caption={"Id"}
              dataType={"number"}
              visible={false}
              formItem={{ visible: false }}
            />

            <Column dataField={"Name"} caption={t("USER_MANAGEMENT.NAME")}>
              <ValidationRule type={"required"} />
            </Column>

            <Column
              dataField={"LastName"}
              caption={t("USER_MANAGEMENT.LASTNAME")}
            >
              <ValidationRule type={"required"} />
            </Column>

            <Column
              dataField={"Cellphone"}
              caption={t("USER_MANAGEMENT.CELLPHONE")}
              dataType={"string"}
              editorOptions={{ mask: "(999)999-9999" }}
            />

            <Column
              dataField={"UserName"}
              caption={t("USER_MANAGEMENT.USER_NAME")}
            >
              <ValidationRule type={"required"} />
            </Column>

            <Column
              dataField={"UserStatus"}
              caption={t("USER_MANAGEMENT.USER_STATUS")}
            >
              <Lookup
                dataSource={UserStatus}
                valueExpr={"Id"}
                displayExpr={"Name"}
              />
              <ValidationRule type={"required"} />
            </Column>

            <Column
              dataField={"Password"}
              caption={t("USER_MANAGEMENT.PASSWORD")}
              visible={false}
            >
              <ValidationRule type={"required"} />
            </Column>

            <Column dataField={"Email"} caption={t("USER_MANAGEMENT.EMAIL")}>
              <ValidationRule type={"email"} />
            </Column>

            <Column dataField={"RoleId"} caption={t("USER_MANAGEMENT.ROLE")}>
              <Lookup
                dataSource={roleList}
                valueExpr={"Id"}
                displayExpr={"RoleName"}
              />
              <ValidationRule type={"required"} />
            </Column>
          </DataGrid>
        </div>
      </div>
    </React.Fragment>
  );
}
