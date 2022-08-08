import { DataGrid, FileUploader, Tooltip } from "devextreme-react";
import {
  Column,
  Editing,
  Form,
  Format,
  Lookup,
  Scrolling,
  ValidationRule,
} from "devextreme-react/data-grid";
import { Item } from "devextreme-react/form";
import CustomStore from "devextreme/data/custom_store";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import DxStoreService from "../../services/dx-store.service";
import GetService from "../../services/get.service";
import PermissionService from "../../services/permission.service";
import { Category, DxStoreOptions } from "../../models";

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
    GetService.getCategories().then((categories) => {
      setCategoryList(categories.data);
    });
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

    if (e.parentType === "dataRow" && e.dataField === "description") {
      e.editorName = "dxTextArea";
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
              <Form colCount={3}>
                <Item dataField="title" />
                <Item dataField="unitPrice" />
                <Item dataField="categoryId" />
                <Item dataField="description" colSpan={3} />
                <Item dataField="thumbUrl" colSpan={3} />
              </Form>
            </Editing>
            <Scrolling columnRenderingMode={"virtual"} />

            <Column
              dataField={"id"}
              caption={"id"}
              dataType={"number"}
              visible={false}
              formItem={{ visible: false }}
            />

            <Column dataField={"title"} caption={t("PRODUCT.PRODUCT_TITLE")}>
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
              dataField={"description"}
              caption={t("PRODUCT.DESCRIPTION")}
            >
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

            <Column
              dataField={"thumbUrl"}
              caption={t("PRODUCT.THUMB_URL")}
              editCellRender={thumbUploaderEditTemplate}
              cellRender={thumbUploaderTemplate}
              width={100}
              formItem={{ colSpan: 2 }}
            ></Column>
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

const thumbUploaderTemplate = (e: any) => {
  const blobUrl = process.env.REACT_APP_BLOB_URL;
  return (
    <>
      <img
        src={blobUrl + e.data.thumbUrl}
        alt={e.data.title}
        style={{ width: "40px" }}
      />
    </>
  );
};

const thumbUploaderEditTemplate = (eTemplate: any) => {
  const thumbUploaded = (e) => {
    eTemplate.setValue(e.file.name);
  };

  const token = sessionStorage.getItem("Authorization");
  const uploadHeaders = {
    Authorization: "Bearer " + token,
  };
  const uploadUrl = `${process.env.REACT_APP_API_URL}Products/upload`;
  return (
    <>
      <FileUploader
        multiple={false}
        accept="image/*"
        uploadMode="instantly"
        onUploaded={thumbUploaded}
        uploadHeaders={uploadHeaders}
        uploadUrl={uploadUrl}
      />
    </>
  );
};
