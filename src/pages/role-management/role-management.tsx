import React, { useEffect, useRef, useState } from "react";
import "devextreme/data/odata/store";
import DataGrid, {
  Column,
  ValidationRule,
  Popup,
  Editing,
  Scrolling,
  MasterDetail,
} from "devextreme-react/data-grid";
import "devextreme/data/odata/store";
import { useTranslation } from "react-i18next";
import { Button, TreeList } from "devextreme-react";
import { Selection } from "devextreme-react/tree-list";
import {
  DxStoreOptions,
  PermissionEnum,
  RoleIdAndPermissions,
} from "../../models";
import ToastService from "../../services/toast.service";
import RoleService from "../../services/role.service";
import CustomStore from "devextreme/data/custom_store";
import DxStoreService from "../../services/dx-store.service";
import { useAuth } from "../../contexts/auth.context";

export default function RoleManagement() {
  const { t } = useTranslation();
  const {
    user,
    user: { permissions },
  } = useAuth();
  const [allowAdd, setAllowAdd] = useState<boolean>(false);
  const [allowDelete, setAllowDelete] = useState<boolean>(false);
  const [allowUpdate, setAllowUpdate] = useState<boolean>(false);

  const rolesGrid = useRef(null);
  const storeOptions: DxStoreOptions = {
    loadUrl: "Roles/Get",
    insertUrl: "Roles/Insert",
    updateUrl: "Roles/Update",
    updateMethod: "POST",
    deleteUrl: "Roles/Delete",
    deleteMethod: "POST",
    Key: "id",
    onInserted: () => {
      rolesGrid?.current?.instance.refresh();
      ToastService.showToast("success");
    },
    onRemoved: () => {
      rolesGrid?.current?.instance.refresh();
      ToastService.showToast("success");
    },
    onUpdated: () => {
      rolesGrid?.current?.instance.refresh();
      ToastService.showToast("success");
    }
  };
  const store: CustomStore = DxStoreService.getStore(storeOptions);

  useEffect(() => {
    setAllowAdd(user.isAdmin ?? permissions.includes(PermissionEnum.ADD_ROLE));
    setAllowDelete(
      user.isAdmin ?? permissions.includes(PermissionEnum.DELETE_ROLE)
    );
    setAllowUpdate(
      user.isAdmin ?? permissions.includes(PermissionEnum.UPDATE_ROLE)
    );
  }, [permissions]);

  return (
    <React.Fragment>
      <h2 className={"content-block"}>{t("ROLE_MANAGEMENT.TITLE")}</h2>
      <div className={"content-block"}>
        <div className={"dx-card responsive-paddings"}>
          <DataGrid
            ref={rolesGrid}
            allowColumnResizing={true}
            columnAutoWidth={true}
            dataSource={store}
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

            <Column
              dataField={"roleName"}
              caption={t("ROLE_MANAGEMENT.ROLE_NAME")}
              editorOptions={{ maxLength: 255 }}
            >
              <ValidationRule type={"required"} />
            </Column>

            <Column
              dataField={"description"}
              caption={t("ROLE_MANAGEMENT.DESCRIPTION")}
              editorOptions={{ maxLength: 255 }}
            >
              <ValidationRule type={"required"} />
            </Column>

            <MasterDetail enabled={true} component={MasterDetailTemplate} />
          </DataGrid>
        </div>
      </div>
    </React.Fragment>
  );
}

const MasterDetailTemplate = (role) => {
  const { t } = useTranslation();
  const {
    user,
    user: { permissions },
  } = useAuth();
  const permissionsTree = useRef(null);
  const [allowUpdatingPermissions, setAllowUpdatingPermissions] =
    useState<boolean>(false);
  const [selectedPermissionIdList, setSelectedPermissionIdList] =
    useState<string[]>();
  const [permissionsListStore, setPermissionsListStore] = useState<any>();

  useEffect(() => {
    setAllowUpdatingPermissions(
      user.isAdmin ?? permissions.includes(PermissionEnum.UPATE_PERMISSIONS)
    );

    const permissionsListStoreOption: DxStoreOptions = {
      loadUrl: "Roles/get-permissions",
      Key: "permissionKey",
      onInserted: () => permissionsTree?.current?.instance.refresh(),
      onRemoved: () => permissionsTree?.current?.instance.refresh(),
      onUpdated: () => permissionsTree?.current?.instance.refresh(),
    };

    setPermissionsListStore(
      DxStoreService.getStore(permissionsListStoreOption)
    );

    setSelectedPermissionIdList(role.data.data.rolePermissionsIds);
  }, [role.data.data.rolePermissionsIds, permissions]);

  const treeListTitleDisplayValue = (rowData) => {
    return t(rowData.permissionKey);
  };

  const selectedRowKeysChanged = (permissionIdList) => {
    setSelectedPermissionIdList(permissionIdList);
  };

  return (
    <>
      <TreeList
        ref={permissionsTree}
        dataSource={permissionsListStore}
        keyExpr={"permissionKey"}
        parentIdExpr={"parentKey"}
        hasItemsExpr={"isParent"}
        showRowLines={true}
        showBorders={true}
        columnAutoWidth={true}
        wordWrapEnabled={true}
        selectedRowKeys={selectedPermissionIdList}
        onSelectedRowKeysChange={selectedRowKeysChanged}
      >
        <Selection mode={"multiple"} recursive={false} />
        <Column
          dataField={"id"}
          visible={false}
          formItem={{ visible: false }}
        ></Column>
        <Column
          dataField={"permissionKey"}
          calculateDisplayValue={treeListTitleDisplayValue}
        ></Column>
      </TreeList>
      <Button
        disabled={!allowUpdatingPermissions}
        onClick={(e) =>
          save(
            permissionsTree.current?.instance?.getSelectedRowsData("all"),
            role.data.data.id
          )
        }
        style={{ float: "right" }}
        text={t("ROLE_MANAGEMENT.SAVE")}
      ></Button>
    </>
  );
};

const save = async (selectedRows: any, roleId: number) => {
  const roleIdAndPermissions: RoleIdAndPermissions = {
    roleId: roleId,
    rolePermissions: selectedRows.map((mp) => mp.id),
  };
  try {
    await RoleService.saveRolePermissions(roleIdAndPermissions);
    ToastService.showToast("success");
  } catch (e) {
    ToastService.showToast("error", e?.message);
    console.log(e);
  }
};
