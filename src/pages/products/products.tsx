import { DataGrid, FileUploader } from "devextreme-react";
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
import { Category, DxStoreOptions, PermissionEnum } from "../../models";
import ToastService from "../../services/toast.service";
import { replaceLinksWithHtmlTags } from "../../shared/utils";
import { useAuth } from "../../contexts/auth.context";

export default function Products() {
  const { t } = useTranslation();
  const {
    user,
    user: { permissions },
  } = useAuth();
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [allowAdd, setAllowAdd] = useState<boolean>(false);
  const [allowDelete, setAllowDelete] = useState<boolean>(false);
  const [allowUpdate, setAllowUpdate] = useState<boolean>(false);
  let isUploading = false;

  const productsGrid = useRef(null);
  const storeOption: DxStoreOptions = {
    loadUrl: "Products/Get",
    insertUrl: "Products/Insert",
    updateUrl: "Products/Update",
    updateMethod: "POST",
    deleteUrl: "Products/Delete",
    deleteMethod: "POST",
    Key: "id",
    onInserted: () => {
      productsGrid?.current?.instance?.refresh();
      ToastService.showToast("success");
    },
    onRemoved: () => {
      productsGrid?.current?.instance?.refresh();
      ToastService.showToast("success");
    },
    onUpdated: () => {
      productsGrid?.current?.instance?.refresh();
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
    GetService.getCategories().then((categories) => {
      setCategoryList(categories.data);
    });

    setAllowAdd(
      user.isAdmin ?? permissions.includes(PermissionEnum.ADD_PRODUCT)
    );
    setAllowDelete(
      user.isAdmin ?? permissions.includes(PermissionEnum.DELETE_PRODUCT)
    );
    setAllowUpdate(
      user.isAdmin ?? permissions.includes(PermissionEnum.UPDATE_PRODUCT)
    );
  }, [permissions]);

  const onInitNewRow = (e) => {
    e.data.type = "article";
  };

  const gridEditorPreparing = (e) => {
    if (e.parentType === "dataRow" && e.dataField === "description") {
      e.editorName = "dxTextArea";
    }
  };

  const thumbUploaderTemplate = (e: any) => {
    return (
      <>
        {e.data.thumbUrl ? (
          <img
            src={e.data.thumbUrl}
            alt={e.data.title}
            style={{ width: "40px" }}
          />
        ) : (
          ""
        )}
      </>
    );
  };

  const setIsUploading = (value: boolean) => {
    isUploading = value;
  };

  const onRowSaving = (e) => {
    if (isUploading) {
      ToastService.showToast("warning", t("PRODUCTS.WAIT_IMAGE_UPLOAD"));
    }
    e.cancel = isUploading;
  };

  const descriptionCustomizeText = (e) => {
    return replaceLinksWithHtmlTags(e.valueText);
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
            showBorders={true}
            wordWrapEnabled={true}
            onEditorPreparing={gridEditorPreparing}
            onInitNewRow={onInitNewRow}
            onSaving={onRowSaving}
          >
            <Editing
              mode={"popup"}
              allowAdding={allowAdd}
              allowDeleting={allowDelete}
              allowUpdating={allowUpdate}
            >
              <Form colCount={3}>
                <Item dataField="id" />
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

            <Column
              dataField={"title"}
              caption={t("PRODUCT.PRODUCT_TITLE")}
              editorOptions={{ maxLength: 50 }}
            >
              <ValidationRule type={"required"} />
            </Column>

            <Column
              dataField={"code"}
              caption={t("PRODUCT.CODE")}
              editorOptions={{ maxLength: 6 }}
              formItem={{ visible: false }}
            ></Column>

            <Column
              dataField={"unitPrice"}
              caption={t("PRODUCT.UNIT_PRICE")}
              dataType={"number"}
            >
              <Format type={"currency"} precision={2} />
              <ValidationRule type={"required"} />
            </Column>

            <Column
              dataField={"description"}
              caption={t("PRODUCT.DESCRIPTION")}
              encodeHtml={false}
              customizeText={descriptionCustomizeText}
              editorOptions={{ autoResizeEnabled: true, maxLength: 500 }}
            >
              <ValidationRule type={"required"} />
            </Column>

            <Column
              dataField={"categoryId"}
              caption={t("PRODUCT.CATEGORY_KEY")}
              groupIndex={1}
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
              editCellRender={(e) => {
                return thumbUploaderEditTemplate(e, setIsUploading);
              }}
              cellRender={thumbUploaderTemplate}
              width={100}
              formItem={{ colSpan: 2 }}
            ></Column>
          </DataGrid>
        </div>
      </div>
    </React.Fragment>
  );
}

const thumbUploaderEditTemplate = (
  eTemplate: any,
  setIsUploading: (value: boolean) => void
) => {
  const token = localStorage.getItem("Authorization");
  const uploadHeaders = {
    Authorization: "Bearer " + token,
  };
  const uploadUrl = `${process.env.REACT_APP_API_URL}Products/upload`;

  const thumbUploaded = (e) => {
    try {
      const resp = JSON.parse(e.request.response);
      eTemplate.setValue(resp.thumb.url);
    } catch (er) {
      console.log(er);
    }
  };

  const beforeSend = (e) => {
    e.request.setRequestHeader("product-id", eTemplate.row.data.id);
  };

  const uploadImageStarted = (e) => {
    setIsUploading(true);
  };

  const uploadImageUploaded = (e) => {
    setIsUploading(false);
  };
  return (
    <>
      <FileUploader
        onBeforeSend={beforeSend}
        onUploadStarted={uploadImageStarted}
        onFilesUploaded={uploadImageUploaded}
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
