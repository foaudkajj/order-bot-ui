import { DataGrid, Tooltip } from "devextreme-react";
import {
  Column,
  Editing,
  Format,
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
import PermissionService from "../../services/permission.service";
import { Category, DxStoreOptions } from "../models";

export default function Products() {
  const { t } = useTranslation();

  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [tooltipVisible, setTooltipVisibility] = useState<boolean>(false);
  const [allowAdd, setAllowAdd] = useState<boolean>(false);
  const [allowDelete, setAllowDelete] = useState<boolean>(false);
  const [allowUpdate, setAllowUpdate] = useState<boolean>(false);

  const productsGrid = useRef(null);
  const storeOption: DxStoreOptions = {
    loadUrl: "Products/Get",
    insertUrl: "Products/Insert",
    updateUrl: "Products/Update",
    updateMethod: "POST",
    deleteUrl: "Products/Delete",
    deleteMethod: "POST",
    Key: "id",
    onInserted: () => productsGrid?.current?.instance?.refresh(),
    onRemoved: () => productsGrid?.current?.instance?.refresh(),
    onUpdated: () => productsGrid?.current?.instance?.refresh(),
  };
  const store: CustomStore = DxStoreService.getStore(storeOption);

  useEffect(() => {
    GetService.getCategories().then((categories) =>{
      setCategoryList(categories.data)
    }
    );
    PermissionService.getPermissions().then((UIPermissions) => {
      setAllowAdd(UIPermissions.includes("ADD_PRODUCT"));
      setAllowDelete(UIPermissions.includes("DELETE_PRODUCT"));
      setAllowUpdate(UIPermissions.includes("UPDATE_PRODUCT"));
    });
  }, []);

  const onInitNewRow = (e) => {
    e.data.type = "article";
  };

  const gridEditorPreparing = (e) => {
    if (e.dataField === "type" && e.parentType === "dataRow") {
      e.editorOptions.disabled = true;
      e.editorOptions.value = "article";
      e.editorElement.id = "productType";
      e.editorElement.addEventListener("mouseenter", (e) => {
        setTooltipVisibility(!tooltipVisible);
      });
      e.setValue(e.editorOptions.value);
    }
  };

  const toolTipContent = (data) => {
    return <span>Hello</span>;
  };
  return (
    <React.Fragment>
      <h2 className={"content-block"}>{t("CATEGORY.TITLE")}</h2>
      <div className={"content-block"}>
        <div className={"dx-card responsive-paddings"}>
          <DataGrid
            ref={productsGrid}
            className={"dx-card wide-card"}
            dataSource={store}
            allowColumnResizing={true}
            columnAutoWidth={true}
            remoteOperations={true}
            showBorders={true}
            wordWrapEnabled={true}
            onEditorPreparing={gridEditorPreparing}
            onInitNewRow={onInitNewRow}
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

            <Column dataField={"thumbUrl"} caption={t("PRODUCT.THUMB_URL")}>
            </Column>
            <Column dataField={"title"} caption={t("PRODUCT.PRODUCT_TITLE")}>
              <ValidationRule type={"required"} />
            </Column>
            <Column
              dataField={"description"}
              caption={t("PRODUCT.DESCRIPTION")}
            >
              <ValidationRule type={"required"} />
            </Column>
            <Column
              dataField={"productCode"}
              caption={t("PRODUCT.PRODUCT_CODE")}
            >
              <ValidationRule type={"required"} />
            </Column>
            <Column
              dataField={"unitPrice"}
              caption={t("PRODUCT.UNIT_PRICE")}
              format={"currency"}
              dataType={"number"}
            >
              <Format type={"currency"} precision={2} />
              <ValidationRule type={"required"} />
            </Column>
            <Column
              dataField={"categoryId"}
              caption={t("PRODUCT.CATEGORY_KEY")}
            >
              <Lookup
                dataSource={categoryList}
                displayExpr={"name"}
                valueExpr={"id"}
              />
              <ValidationRule type={"required"} />
            </Column>

          </DataGrid>
        </div>
      </div>

      <Tooltip
        target={"#productType"}
        visible={tooltipVisible}
        closeOnOutsideClick={false}
        contentTemplate={toolTipContent}
      ></Tooltip>
    </React.Fragment>
  );
}
