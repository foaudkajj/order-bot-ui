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
import { DxStoreOptions, RoleIdAndPermessions } from "../models";
import ToastService from "../../services/toast.service";
import RoleService from "../../services/role.service";
import PermissionService from "../../services/permession.service";
import CustomStore from "devextreme/data/custom_store";
import DxStoreService from "../../services/dx-store.service";

export default function RoleManagement() {
  const { t } = useTranslation();

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
    Key: "Id",
    onInserted: () => rolesGrid?.current?.instance.refresh(),
    onRemoved: () => rolesGrid?.current?.instance.refresh(),
    onUpdated: () => rolesGrid?.current?.instance.refresh(),
  };
  const store: CustomStore =
    DxStoreService.getStore(storeOptions);

  useEffect(() => {
    PermissionService.getPermissions().then((UIPermessions) => {
      setAllowAdd(UIPermessions.includes("ADD_ROLE"));
      setAllowDelete(UIPermessions.includes("DELETE_ROLE"));
      setAllowUpdate(UIPermessions.includes("UPDATE_ROLE"));
    });
  });

  return (
    <React.Fragment>
      <h2 className={"content-block"}>{t("ROLE_MANAGEMENT.TITLE")}</h2>
      <div className={"content-block"}>
        <div className={"dx-card responsive-paddings"}>
          <DataGrid
            ref={rolesGrid}
            allowColumnResizing={true}
            columnAutoWidth={true}
            remoteOperations={true}
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
              dataField={"Id"}
              caption={"Id"}
              dataType={"number"}
              visible={false}
              formItem={{ visible: false }}
            />

            <Column
              dataField={"RoleName"}
              caption={t("ROLE_MANAGEMENT.ROLE_NAME")}
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
  const permessionsTree = useRef(null);
  const [allowUpdatingPermessions, setAllowUpdatingPermessions] =
    useState<boolean>(false);
  const [selectedPermessionIdList, setSelectedPermessionIdList] =
    useState<string[]>();
  const [permessionsListStore, setPermessionsListStore] = useState<any>();

  useEffect(() => {
    PermissionService.getPermissions().then((UIPermessions) => {
      setAllowUpdatingPermessions(UIPermessions.includes("UPATE_PERMESSIONS"));
    });

    const permessionsListStoreOption: DxStoreOptions = {
      loadUrl: "Roles/GetPermessions",
      Key: "PermessionKey",
      onInserted: () => permessionsTree?.current?.instance.refresh(),
      onRemoved: () => permessionsTree?.current?.instance.refresh(),
      onUpdated: () => permessionsTree?.current?.instance.refresh(),
    };

    setPermessionsListStore(
      DxStoreService.getStore(permessionsListStoreOption)
    );

    setSelectedPermessionIdList(role.data.data.RolePermessionsIds);
  }, [role.data.data.RolePermessionsIds]);

  const treeListTitleDisplayValue = (rowData) => {
    return t(rowData.PermessionKey);
  };

  const selectedRowKeysChanged = (permessionIdList) => {
    setSelectedPermessionIdList(permessionIdList);
  };

  return (
    <>
      <TreeList
        ref={permessionsTree}
        dataSource={permessionsListStore}
        keyExpr={"PermessionKey"}
        parentIdExpr={"ParentKey"}
        hasItemsExpr={"IsParent"}
        showRowLines={true}
        showBorders={true}
        columnAutoWidth={true}
        wordWrapEnabled={true}
        selectedRowKeys={selectedPermessionIdList}
        onSelectedRowKeysChange={selectedRowKeysChanged}
      >
        <Selection mode={"multiple"} recursive={false} />
        <Column
          dataField={"Id"}
          visible={false}
          formItem={{ visible: false }}
        ></Column>
        <Column
          dataField={"PermessionKey"}
          calculateDisplayValue={treeListTitleDisplayValue}
        ></Column>
      </TreeList>
      <Button
        disabled={!allowUpdatingPermessions}
        onClick={(e) =>
          save(
            permessionsTree.current?.instance?.getSelectedRowsData("all"),
            role.data.data.Id
          )
        }
        style={{ float: "right" }}
        text={t("ROLE_MANAGEMENT.SAVE")}
      ></Button>
    </>
  );
};

const save = (selectedRows: any, roleId: number) => {
  const roleIdAndPermessions: RoleIdAndPermessions = {
    roleId: roleId,
    rolePermessions: selectedRows.map((mp) => mp.Id),
  };
  RoleService.saveRolePermessions(roleIdAndPermessions).then((t) => {
    t.IsError
      ? ToastService.showToast("error")
      : ToastService.showToast("success");
  });
};
